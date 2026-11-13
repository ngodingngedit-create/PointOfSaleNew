export function optionalNumber(value) {
  if (value === null || value === undefined || value === '') return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

export function normalizeSanityProduct(product) {
  const variants = Array.isArray(product.variants)
    ? product.variants
        .filter((variant) => typeof variant?._key === 'string' && variant._key)
        .map((variant) => ({
          id: variant._key,
          name: String(variant.name || 'Variant'),
          sku: String(variant.sku || ''),
          price: optionalNumber(variant.price),
          stock: optionalNumber(variant.stock),
        }))
    : []

  return {
    id: product._id,
    name: String(product.name || ''),
    category: product.category || 'Reguler',
    sku: String(product.sku || ''),
    price: Number(product.price) || 0,
    stock: Number(product.stock) || 0,
    image_url: product.image?.asset?.url || product.imageUrl || '',
    variants,
    is_active: true,
  }
}
