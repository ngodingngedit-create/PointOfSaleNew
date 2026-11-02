import { defineStore } from 'pinia'
import { ref } from 'vue'
import { isSanityConfigured, PRODUCT_QUERY, sanityClient } from '../lib/sanity'
import { supabase } from '../lib/supabase'

export const useProductsStore = defineStore('products', () => {
  const products = ref([])
  const loading = ref(false)
  const error = ref('')

  async function fetchProducts() {
    loading.value = true
    error.value = ''
    try {
      if (isSanityConfigured && sanityClient) {
        // Query hanya produk aktif dari dataset publik Sanity
        const sanityData = await sanityClient.fetch(PRODUCT_QUERY)
        products.value = (sanityData || []).map((p) => ({
          id: p._id,
          name: p.name,
          category: p.category || 'Reguler',
          price: Number(p.price) || 0,
          stock: Number(p.stock) || 0,
          image_url: p.imageUrl || '',
          is_active: true,
        }))
      } else {
        const { data, error: supaError } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('name')
        if (supaError) throw supaError
        products.value = data ?? []
      }
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
      const pId = item.productId || item.product?.id
      const p = products.value.find((prod) => prod.id === pId)
      if (p) {
        p.stock = Math.max(0, p.stock - (item.qty || 1))
      }
    }
  }

  return { products, loading, error, fetchProducts, deductLocalStock }
})
