import { defineStore } from 'pinia'
import { ref } from 'vue'
import { isSanityConfigured, PRODUCT_QUERY, sanityClient } from '../lib/sanity'
import { normalizeSanityProduct } from '../lib/product'

export const useProductsStore = defineStore('products', () => {
  const products = ref([])
  const loading = ref(false)
  const error = ref('')

  async function fetchProducts() {
    loading.value = true
    error.value = ''
    try {
      if (!isSanityConfigured || !sanityClient) throw new Error('Katalog Sanity belum dikonfigurasi.')
      // Query hanya produk aktif dari dataset publik Sanity; jangan menampilkan data contoh.
      const sanityData = await sanityClient.fetch(PRODUCT_QUERY)
      products.value = (sanityData || []).map(normalizeSanityProduct)
    } catch (err) {
      error.value = err.message || 'Gagal memuat katalog produk'
      console.error('Fetch products error:', err)
    } finally {
      loading.value = false
    }
  }

  // Update stok lokal setelah checkout berhasil
  function deductLocalStock(items) {
    for (const item of items) {
      const cartProduct = item.product || item
      const pId = item.productId || cartProduct.id
      const p = products.value.find((prod) => prod.id === pId)
      if (p) {
        const qty = item.qty || 1
        const variant = cartProduct.variantKey
          ? p.variants.find((candidate) => candidate.id === cartProduct.variantKey)
          : null
        if (variant && variant.stock !== null) {
          variant.stock = Math.max(0, variant.stock - qty)
        } else {
          p.stock = Math.max(0, p.stock - qty)
        }
      }
    }
  }

  return { products, loading, error, fetchProducts, deductLocalStock }
})
