<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useProductsStore } from '../stores/products'

const store = useProductsStore()
const showForm = ref(false)
const editingId = ref(null)
const error = ref('')

const form = reactive({
  name: '',
  category: '',
  price: 0,
  stock: 0,
  image_url: '',
  is_active: true,
})

function resetForm() {
  form.name = ''
  form.category = ''
  form.price = 0
  form.stock = 0
  form.image_url = ''
  form.is_active = true
  editingId.value = null
}

function openCreate() {
  resetForm()
  showForm.value = true
}

function openEdit(p) {
  Object.assign(form, {
    name: p.name,
    category: p.category ?? '',
    price: p.price,
    stock: p.stock,
    image_url: p.image_url ?? '',
    is_active: p.is_active,
  })
  editingId.value = p.id
  showForm.value = true
}

async function submitForm() {
  error.value = ''
  try {
    if (editingId.value) {
      await store.updateProduct(editingId.value, { ...form })
    } else {
      await store.addProduct({ ...form })
    }
    showForm.value = false
    resetForm()
  } catch (e) {
    error.value = e.message
  }
}

async function handleDelete(p) {
  if (!confirm(`Hapus produk "${p.name}"?`)) return
  try {
    await store.deleteProduct(p.id)
  } catch (e) {
    error.value = e.message
  }
}

function formatRupiah(v) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(v)
}

onMounted(() => store.fetchProducts())
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-4 border-b border-stone-200 pb-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight">Katalog Produk</h1>
        <p class="text-xs sm:text-sm text-stone-500 mt-0.5">Kelola item menu, stok kasir, dan status tayang</p>
      </div>
      <button
        type="button"
        @click="openCreate"
        class="h-10 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-xs sm:text-sm font-medium transition-colors"
      >
        Tambah Menu Baru
      </button>
    </div>

    <div v-if="error" class="text-xs text-red-800 bg-red-50 border border-red-200 rounded p-3">
      {{ error }}
    </div>

    <!-- Modal Dialog Form Produk -->
    <div
      v-if="showForm"
      class="fixed inset-0 z-50 bg-stone-900/50 flex items-center justify-center p-4 overflow-y-auto"
      @click.self="showForm = false; resetForm()"
    >
      <div class="bg-white border border-stone-200 rounded-lg p-6 max-w-lg w-full shadow-xl">
        <div class="pb-3 mb-4 border-b border-stone-100 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-stone-900">
            {{ editingId ? 'Perbarui Menu' : 'Tambah Menu Baru' }}
          </h2>
          <button
            type="button"
            @click="showForm = false; resetForm()"
            class="text-xs text-stone-400 hover:text-stone-700"
          >
            Tutup
          </button>
        </div>

        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-stone-700 mb-1">Nama Produk</label>
            <input
              v-model="form.name"
              required
              class="w-full h-10 px-3 text-sm bg-stone-50 border border-stone-300 rounded-md focus:bg-white focus:border-stone-900"
              placeholder="Contoh: Kopi Susu Aren"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-stone-700 mb-1">Kategori</label>
              <input
                v-model="form.category"
                class="w-full h-10 px-3 text-sm bg-stone-50 border border-stone-300 rounded-md focus:bg-white focus:border-stone-900"
                placeholder="Kopi, Non-Kopi, Snack"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-stone-700 mb-1">Harga (Rp)</label>
              <input
                v-model.number="form.price"
                type="number"
                min="0"
                required
                class="w-full h-10 px-3 text-sm bg-stone-50 border border-stone-300 rounded-md focus:bg-white focus:border-stone-900 font-mono"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-stone-700 mb-1">Stok Awal</label>
              <input
                v-model.number="form.stock"
                type="number"
                min="0"
                required
                class="w-full h-10 px-3 text-sm bg-stone-50 border border-stone-300 rounded-md focus:bg-white focus:border-stone-900 font-mono"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-stone-700 mb-1">URL Gambar (Opsional)</label>
              <input
                v-model="form.image_url"
                class="w-full h-10 px-3 text-sm bg-stone-50 border border-stone-300 rounded-md focus:bg-white focus:border-stone-900"
                placeholder="https://..."
              />
            </div>
          </div>

          <label class="inline-flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer pt-1">
            <input v-model="form.is_active" type="checkbox" class="w-4 h-4 rounded text-stone-900" />
            Aktifkan menu ini untuk ditampilkan pada kasir
          </label>

          <div class="flex items-center justify-end gap-2 pt-4 border-t border-stone-100">
            <button
              type="button"
              @click="showForm = false; resetForm()"
              class="h-10 px-4 bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 rounded-md text-xs font-medium transition-colors"
            >
              Batalkan
            </button>
            <button
              type="submit"
              class="h-10 px-5 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-xs font-medium transition-colors"
            >
              Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Tampilan Data / Grid Produk -->
    <div v-if="store.loading" class="bg-white border border-stone-200 rounded-lg p-10 text-center text-xs text-stone-500">
      Mengambil daftar produk...
    </div>

    <div
      v-else-if="store.products.length === 0"
      class="bg-white border border-dashed border-stone-300 rounded-lg p-12 text-center"
    >
      <p class="text-sm font-medium text-stone-800">Belum ada item dalam katalog</p>
      <p class="text-xs text-stone-500 mt-1">Gunakan tombol "Tambah Menu Baru" di atas untuk mendaftarkan menu perdana.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <div
        v-for="p in store.products"
        :key="p.id"
        class="bg-white border border-stone-200 rounded-lg p-4 flex flex-col justify-between"
      >
        <div>
          <div class="flex justify-between items-start gap-2">
            <div>
              <h3 class="font-medium text-stone-900 text-sm">{{ p.name }}</h3>
              <p class="text-xs text-stone-500 mt-0.5">{{ p.category || 'Reguler' }}</p>
            </div>
            <span
              class="text-[10px] px-2 py-0.5 rounded font-medium"
              :class="p.is_active
                ? 'bg-stone-100 text-stone-800 border border-stone-200'
                : 'bg-stone-100 text-stone-400 line-through'"
            >
              {{ p.is_active ? 'Aktif' : 'Nonaktif' }}
            </span>
          </div>

          <p class="text-base font-semibold font-mono text-stone-900 mt-3">{{ formatRupiah(p.price) }}</p>
          <p
            class="text-xs mt-0.5 font-mono"
            :class="p.stock <= 5 ? 'text-amber-800 font-semibold' : 'text-stone-500'"
          >
            Stok tersisa: {{ p.stock }} unit
          </p>
        </div>

        <div class="flex gap-2 mt-4 pt-3 border-t border-stone-100 text-xs">
          <button
            type="button"
            @click="openEdit(p)"
            class="flex-1 py-1.5 border border-stone-300 rounded text-stone-700 hover:bg-stone-50 font-medium transition-colors"
          >
            Edit
          </button>
          <button
            type="button"
            @click="handleDelete(p)"
            class="flex-1 py-1.5 border border-stone-200 rounded text-stone-500 hover:text-red-700 hover:border-red-200 font-medium transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
