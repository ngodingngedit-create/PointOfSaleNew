<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useProductsStore } from '../stores/products'

const store = useProductsStore()
const showForm = ref(false)
const editingId = ref(null)
const error = ref('')
const search = ref('')
const selectedStatus = ref('all') // all, ready, low, out
const sortBy = ref('name-asc') // name-asc, price-desc, price-asc
const activeCategoryTab = ref('Semua')

const form = reactive({
  name: '',
  category: '',
  price: 0,
  cost: 0,
  sku: '',
  stock: 0,
  image_url: '',
  is_active: true,
})

function resetForm() {
  form.name = ''
  form.category = ''
  form.price = 0
  form.cost = 0
  form.sku = ''
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
    cost: p.cost ?? 0,
    sku: p.sku ?? '',
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

async function toggleActive(p) {
  try {
    await store.updateProduct(p.id, { is_active: !p.is_active })
  } catch (e) {
    error.value = e.message
  }
}

function formatRupiah(v) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v || 0)
}

function getMargin(price, cost) {
  if (price === null || price === undefined || Number(price) <= 0) return null
  if (cost === null || cost === undefined || cost === '') return null
  return Math.round(((Number(price) - Number(cost)) / Number(price)) * 100)
}

const categories = computed(() => {
  const cats = [...new Set(store.products.map(p => p.category || 'Lainnya'))]
  return cats.filter(Boolean)
})

const filteredProducts = computed(() => {
  let list = [...store.products]

  if (activeCategoryTab.value !== 'Semua') {
    list = list.filter(p => (p.category || 'Lainnya') === activeCategoryTab.value)
  }

  if (selectedStatus.value === 'ready') list = list.filter(p => p.stock > 5)
  else if (selectedStatus.value === 'low') list = list.filter(p => p.stock > 0 && p.stock <= 5)
  else if (selectedStatus.value === 'out') list = list.filter(p => p.stock <= 0)

  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.sku && String(p.sku).toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    )
  }

  if (sortBy.value === 'name-asc') list.sort((a, b) => a.name.localeCompare(b.name, 'id'))
  else if (sortBy.value === 'price-desc') list.sort((a, b) => b.price - a.price)
  else if (sortBy.value === 'price-asc') list.sort((a, b) => a.price - b.price)

  return list
})

onMounted(() => store.fetchProducts())
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
    <!-- Top Action & Title Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div class="flex flex-col gap-1">
        <h1 class="text-[26px] font-bold text-on-surface tracking-tight">Katalog Produk &amp; Menu</h1>
        <p class="text-[13px] text-on-surface-variant">Kelola item menu, stok bahan baku, margin laba, dan status tayang di terminal kasir.</p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          @click="openCreate"
          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-neutral-800 text-white text-[12px] font-semibold shadow-xs hover:shadow-md transition-all active:scale-[0.98]"
        >
          <span class="material-symbols-outlined text-[18px] text-secondary-fixed">add_circle</span>
          <span>Tambah Menu Baru</span>
        </button>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="p-3 bg-red-50 border border-red-200 text-red-900 rounded-xl text-[12px]">
      {{ error }}
    </div>

    <!-- Filters, Category Tabs, and Dynamic Search Header -->
    <div class="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container-high/60 flex flex-col gap-3">
      <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div class="relative flex-1">
          <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-outline">search</span>
          <input
            v-model="search"
            class="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline text-[13px] focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-secondary transition-all"
            placeholder="Cari menu, SKU, atau kategori..."
            type="text"
          />
        </div>
        <div class="flex items-center gap-2">
          <div class="relative min-w-[140px]">
            <select
              v-model="selectedStatus"
              class="w-full appearance-none pl-3 pr-8 py-2 rounded-lg bg-surface-container-low text-on-surface text-[13px] focus:outline-none cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="ready">Tersedia</option>
              <option value="low">Stok Menipis</option>
              <option value="out">Habis</option>
            </select>
            <span class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[16px] text-outline pointer-events-none">expand_more</span>
          </div>
          <div class="relative min-w-[150px]">
            <select
              v-model="sortBy"
              class="w-full appearance-none pl-3 pr-8 py-2 rounded-lg bg-surface-container-low text-on-surface text-[13px] focus:outline-none cursor-pointer"
            >
              <option value="name-asc">Nama A–Z</option>
              <option value="price-desc">Harga Tertinggi</option>
              <option value="price-asc">Harga Terendah</option>
            </select>
            <span class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[16px] text-outline pointer-events-none">expand_more</span>
          </div>
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[12px]">
        <button
          type="button"
          @click="activeCategoryTab = 'Semua'"
          class="px-3 py-1 rounded-full font-semibold transition-all"
          :class="activeCategoryTab === 'Semua' ? 'bg-primary text-white shadow-xs' : 'text-on-surface-variant hover:bg-surface-container-low'"
        >
          Semua
        </button>
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          @click="activeCategoryTab = cat"
          class="px-3 py-1 rounded-full font-semibold transition-all whitespace-nowrap"
          :class="activeCategoryTab === cat ? 'bg-primary text-white shadow-xs' : 'text-on-surface-variant hover:bg-surface-container-low'"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Main High-Fidelity Data Table Container -->
    <div class="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container-high/60 overflow-hidden flex flex-col">
      <!-- Table Scroll Wrapper -->
      <div class="overflow-x-auto w-full">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container text-on-surface-variant text-[11px] uppercase tracking-wider font-semibold">
              <th class="py-3 px-4" scope="col">Item</th>
              <th class="py-3 px-4" scope="col">SKU</th>
              <th class="py-3 px-4 text-right" scope="col">Harga</th>
              <th class="py-3 px-4 text-right" scope="col">Modal</th>
              <th class="py-3 px-4 text-center" scope="col">Margin</th>
              <th class="py-3 px-4" scope="col">Status Stok</th>
              <th class="py-3 px-4 text-center" scope="col">Tayang Kasir</th>
              <th class="py-3 px-4 text-center" scope="col">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-container text-[13px] text-on-surface">
            <tr v-if="store.loading && store.products.length === 0">
              <td colspan="8" class="p-8 text-center text-[12px] text-on-surface-variant">Memuat katalog produk…</td>
            </tr>
            <tr v-else-if="store.error && store.products.length === 0">
              <td colspan="8" class="p-8 text-center text-[12px] text-error">Katalog tidak dapat dimuat: {{ store.error }}</td>
            </tr>
            <tr v-else-if="filteredProducts.length === 0">
              <td colspan="8" class="p-8 text-center text-[12px] text-on-surface-variant">{{ store.products.length ? 'Tidak ada produk yang sesuai dengan filter.' : 'Belum ada produk pada katalog.' }}</td>
            </tr>

            <tr
              v-for="p in filteredProducts"
              :key="p.id"
              class="hover:bg-surface-container-low/40 transition-colors"
              :class="{ 'opacity-60': !p.is_active }"
            >
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-surface-container overflow-hidden shrink-0">
                    <img
                      v-if="p.image_url"
                      :src="p.image_url"
                      :alt="p.name"
                      class="w-full h-full object-cover"
                      :class="{ 'grayscale': p.stock <= 0 }"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-outline"><span class="material-symbols-outlined">inventory_2</span></div>
                  </div>
                  <div class="flex flex-col min-w-0">
                    <span class="font-semibold text-on-surface truncate">{{ p.name }}</span>
                    <span class="text-[11px] text-on-surface-variant truncate">{{ p.category || 'Tanpa kategori' }}</span>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4">
                <span class="font-mono text-[11px] text-on-surface-variant">{{ p.sku || '—' }}</span>
              </td>
              <td class="py-3 px-4 text-right font-medium text-on-surface">
                {{ formatRupiah(p.price) }}
              </td>
              <td class="py-3 px-4 text-right text-[12px] text-on-surface-variant">
                {{ p.cost !== null && p.cost !== undefined ? formatRupiah(p.cost) : '—' }}
              </td>
              <td class="py-3 px-4 text-center text-[12px] text-on-surface-variant font-medium">
                {{ getMargin(p.price, p.cost) === null ? '—' : `${getMargin(p.price, p.cost)}%` }}
              </td>
              <td class="py-3 px-4">
                <div class="flex items-center gap-2">
                  <span
                    class="w-2 h-2 rounded-full"
                    :class="p.stock > 5 ? 'bg-secondary-container' : (p.stock > 0 ? 'bg-secondary' : 'bg-error')"
                  ></span>
                  <span
                    class="text-[12px]"
                    :class="p.stock <= 0 ? 'text-error font-medium' : (p.stock <= 5 ? 'text-secondary font-medium' : 'text-on-surface')"
                  >
                    {{ p.stock > 0 ? `${p.stock} porsi` : '0 porsi (habis)' }}
                  </span>
                </div>
              </td>
              <td class="py-3 px-4 text-center">
                <button
                  type="button"
                  @click="toggleActive(p)"
                  role="switch"
                  :aria-checked="p.is_active"
                  class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none"
                  :class="p.is_active ? 'bg-primary' : 'bg-surface-container-high'"
                >
                  <span
                    class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 mt-0.5 ml-0.5"
                    :class="p.is_active ? 'translate-x-4' : 'translate-x-0'"
                  ></span>
                </button>
              </td>
              <td class="py-3 px-4 text-center">
                <div class="flex items-center justify-center gap-1 text-on-surface-variant">
                  <button
                    type="button"
                    @click="openEdit(p)"
                    class="p-1 hover:text-on-surface transition-colors"
                    title="Ubah"
                  >
                    <span class="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button
                    type="button"
                    @click="handleDelete(p)"
                    class="p-1 hover:text-error transition-colors"
                    title="Hapus"
                  >
                    <span class="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <!-- Modal Form Tambah/Ubah Menu -->
    <div
      v-if="showForm"
      class="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      @click.self="showForm = false; resetForm()"
    >
      <div class="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-6 max-w-lg w-full shadow-xl">
        <div class="pb-3 mb-4 border-b border-surface-container-high flex items-center justify-between">
          <h2 class="text-[16px] font-bold text-on-surface">
            {{ editingId ? 'Perbarui Menu' : 'Tambah Menu Baru' }}
          </h2>
          <button type="button" @click="showForm = false; resetForm()" class="text-outline hover:text-on-surface">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label class="block text-[12px] font-semibold text-on-surface mb-1">Nama Produk</label>
            <input
              v-model="form.name"
              required
              class="w-full px-3 py-2 rounded-xl bg-surface-container-low text-[13px] border border-surface-container focus:bg-surface-container-lowest focus:outline-none"
              placeholder="Contoh: Iced Caramel Macchiato"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[12px] font-semibold text-on-surface mb-1">Kategori</label>
              <input
                v-model="form.category"
                class="w-full px-3 py-2 rounded-xl bg-surface-container-low text-[13px] border border-surface-container focus:bg-surface-container-lowest focus:outline-none"
                placeholder="Coffee, Non-Coffee, Pastry"
              />
            </div>
            <div>
              <label class="block text-[12px] font-semibold text-on-surface mb-1">SKU</label>
              <input
                v-model="form.sku"
                class="w-full px-3 py-2 rounded-xl bg-surface-container-low text-[13px] border border-surface-container focus:bg-surface-container-lowest focus:outline-none font-mono"
                placeholder="CF-001"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[12px] font-semibold text-on-surface mb-1">Harga Jual (Rp)</label>
              <input
                v-model.number="form.price"
                type="number"
                min="0"
                required
                class="w-full px-3 py-2 rounded-xl bg-surface-container-low text-[13px] border border-surface-container focus:bg-surface-container-lowest focus:outline-none font-mono"
              />
            </div>
            <div>
              <label class="block text-[12px] font-semibold text-on-surface mb-1">Harga Modal / HPP (Rp)</label>
              <input
                v-model.number="form.cost"
                type="number"
                min="0"
                class="w-full px-3 py-2 rounded-xl bg-surface-container-low text-[13px] border border-surface-container focus:bg-surface-container-lowest focus:outline-none font-mono"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[12px] font-semibold text-on-surface mb-1">Stok Porsi</label>
              <input
                v-model.number="form.stock"
                type="number"
                min="0"
                required
                class="w-full px-3 py-2 rounded-xl bg-surface-container-low text-[13px] border border-surface-container focus:bg-surface-container-lowest focus:outline-none font-mono"
              />
            </div>
            <div>
              <label class="block text-[12px] font-semibold text-on-surface mb-1">URL Foto Produk</label>
              <input
                v-model="form.image_url"
                class="w-full px-3 py-2 rounded-xl bg-surface-container-low text-[13px] border border-surface-container focus:bg-surface-container-lowest focus:outline-none"
                placeholder="https://..."
              />
            </div>
          </div>

          <label class="inline-flex items-center gap-2 text-[12px] font-medium text-on-surface cursor-pointer pt-1">
            <input v-model="form.is_active" type="checkbox" class="w-4 h-4 rounded text-primary focus:ring-secondary cursor-pointer" />
            <span>Tampilkan menu ini di POS Kasir (Aktif)</span>
          </label>

          <div class="flex items-center justify-end gap-2 pt-4 border-t border-surface-container-high">
            <button
              type="button"
              @click="showForm = false; resetForm()"
              class="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl text-[12px] font-semibold transition-colors"
            >
              Batalkan
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-primary hover:bg-neutral-800 text-white rounded-xl text-[12px] font-semibold transition-colors shadow-xs"
            >
              Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
