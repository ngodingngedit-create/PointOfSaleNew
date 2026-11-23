function checkoutError(statusCode, message) {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

export function parseCheckoutItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw checkoutError(400, 'Keranjang belanja kosong')
  }

  const requested = new Map()
  for (const item of items) {
    const productId = item?.productId || item?.product_id || item?.id
    const qty = Number(item?.qty)
    const variantKey = item?.variantKey || null
    if (
      typeof productId !== 'string' ||
      !productId ||
      productId.length > 128 ||
      !Number.isSafeInteger(qty) ||
      qty <= 0 ||
      (variantKey !== null && (typeof variantKey !== 'string' || !/^[A-Za-z0-9_-]{1,128}$/.test(variantKey)))
    ) {
      throw checkoutError(400, 'Format item pesanan tidak valid')
    }

    const identity = JSON.stringify([productId, variantKey])
    const existing = requested.get(identity)
    if (existing) existing.qty += qty
    else requested.set(identity, {productId, variantKey, qty})
  }
  return [...requested.values()]
}

export function buildCheckoutPlan(requestedLines, dbProducts) {
  const productsById = new Map(dbProducts.map((product) => [product._id, product]))
  const linesByProduct = new Map()
  for (const line of requestedLines) {
    if (!linesByProduct.has(line.productId)) linesByProduct.set(line.productId, [])
    linesByProduct.get(line.productId).push(line)
  }

  const verifiedItems = []
  const stockUpdates = []
  let calculatedTotal = 0

  for (const [productId, lines] of linesByProduct) {
    const product = productsById.get(productId)
    if (!product) throw checkoutError(404, `Produk dengan ID ${productId} tidak ditemukan`)
    if (product.isActive === false) {
      throw checkoutError(400, `Produk "${product.name}" sedang nonaktif dan tidak dapat dibeli`)
    }

    const variants = Array.isArray(product.variants) ? product.variants : []
    const update = {productId, revision: product._rev, parentQty: 0, variantQtys: []}
    let sharedStockQty = 0

    for (const line of lines) {
      let variant = null
      if (variants.length > 0) {
        if (!line.variantKey) {
          throw checkoutError(400, `Pilih varian untuk produk "${product.name}"`)
        }
        variant = variants.find((candidate) => candidate._key === line.variantKey)
        if (!variant) throw checkoutError(400, `Varian produk "${product.name}" tidak ditemukan`)
      } else if (line.variantKey) {
        throw checkoutError(400, `Produk "${product.name}" tidak memiliki varian yang dipilih`)
      }

      const hasVariantStock = variant && variant.stock !== null && variant.stock !== undefined
      const stockValue = hasVariantStock ? variant.stock : product.stock
      const stock = stockValue === null || stockValue === undefined || stockValue === '' ? NaN : Number(stockValue)
      const priceValue = variant?.price !== null && variant?.price !== undefined ? variant.price : product.price
      const price = Number(priceValue)
      if (!Number.isFinite(stock) || stock < 0) {
        throw checkoutError(409, `Data stok untuk "${product.name}" tidak valid`)
      }
      if (priceValue === null || priceValue === undefined || priceValue === '' || !Number.isSafeInteger(price) || price < 0) {
        throw checkoutError(409, `Data harga untuk "${product.name}" tidak valid`)
      }
      if (hasVariantStock) {
        if (stock < line.qty) {
          throw checkoutError(409, `Stok tidak mencukupi untuk "${product.name} — ${variant.name || variant.sku}". Tersedia: ${stock}, diminta: ${line.qty}`)
        }
        update.variantQtys.push({variantKey: line.variantKey, qty: line.qty})
      } else {
        sharedStockQty += line.qty
      }

      const subtotal = price * line.qty
      calculatedTotal += subtotal
      verifiedItems.push({
        productId: product._id,
        ...(variant ? {variantKey: variant._key, variantName: variant.name || '', sku: variant.sku || ''} : {}),
        ...(!variant && product.sku ? {sku: product.sku} : {}),
        productName: product.name,
        category: product.category || 'Reguler',
        priceAtSale: price,
        qty: line.qty,
        subtotal,
      })
    }

    if (sharedStockQty > 0) {
      const parentStock = Number(product.stock)
      if (!Number.isFinite(parentStock) || parentStock < sharedStockQty) {
        throw checkoutError(409, `Stok tidak mencukupi untuk "${product.name}". Tersedia: ${Number.isFinite(parentStock) ? parentStock : 0}, diminta: ${sharedStockQty}`)
      }
      update.parentQty = sharedStockQty
    }
    stockUpdates.push(update)
  }

  return {verifiedItems, calculatedTotal, stockUpdates}
}
