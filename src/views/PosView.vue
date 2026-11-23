<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useProductsStore } from '../stores/products'

const auth = useAuthStore()
const cart = useCartStore()
const productsStore = useProductsStore()

const paymentMethod = ref('cash')
const orderType = ref('dine_in')
const search = ref('')
const searchInputRef = ref(null)
const branchList = ref([])
const selectedBranchId = ref('')
const branchesLoading = ref(false)
const branchesError = ref('')
const branchConfigurationError = ref('')
const membersLoading = ref(false)
const membersError = ref('')
const memberQuery = ref('')
const memberResult = ref(null)
const memberNotFound = ref(false)
const newMemberName = ref('')
const newMemberPhone = ref('')
const creatingMember = ref(false)
const selectedMember = ref(null)
const showMemberPicker = ref(false)
const activeProduct = ref(null)
const successTransaction = ref(null)
const errorMessage = ref('')
const processing = ref(false)

const selectedBranch = computed(() => branchList.value.find((branch) => String(branch.id) === String(selectedBranchId.value)) || null)
const branchTables = computed(() => {
  const branch = selectedBranch.value
  const tables = branch?.tables || branch?.branch_tables || branch?.tableList || []
  return Array.isArray(tables) ? tables : []
})
const selectedTableId = ref('')
const selectedTable = computed(() => branchTables.value.find((table) => String(table.id) === String(selectedTableId.value)) || null)
const branchReady = computed(() => Boolean(selectedBranch.value) && !branchConfigurationError.value)
const checkoutBlockedReason = computed(() => {
  if (branchesLoading.value) return 'Memuat cabang kasir…'
  if (branchConfigurationError.value) return branchConfigurationError.value
  if (!selectedBranch.value) return branchesError.value || 'Cabang kasir belum tersedia. Checkout tidak dapat dilakukan.'
  if (orderType.value === 'dine_in' && !selectedTable.value) return 'Pilih meja untuk pesanan makan di tempat.'
  return ''
})
const categories = computed(() => [...new Set(productsStore.products.filter((product) => product.is_active).map((product) => product.category || 'Lainnya'))].sort())
const activeCategory = ref('')
const filteredProducts = computed(() => productsStore.products.filter((product) => {
  if (!product.is_active) return false
  if (activeCategory.value && (product.category || 'Lainnya') !== activeCategory.value) return false
  if (search.value) {
    const query = search.value.toLowerCase()
    const matchesVariant = (Array.isArray(product.variants) ? product.variants : []).some((variant) =>
      `${variant.name || ''} ${variant.sku || ''}`.toLowerCase().includes(query)
    )
    if (!product.name.toLowerCase().includes(query) && !String(product.sku || '').toLowerCase().includes(query) && !matchesVariant) return false
  }
  return true
}))
const subtotal = computed(() => cart.total)
const total = computed(() => subtotal.value)
function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value) || 0)
}
function memberName(member) {
  return member?.name || member?.fullName || member?.full_name || member?.phone || 'Member'
}
function tableName(table) {
  return table.name || table.label || table.tableNumber || table.table_number || `Meja ${table.number || table.id}`
}
function addToCart(product) {
  const variants = Array.isArray(product.variants) ? product.variants : []
  if (variants.length) {
    activeProduct.value = product
    return
  }
  cart.addItem(product)
}
function isProductOutOfStock(product) {
  const variants = Array.isArray(product.variants) ? product.variants : []
  return variants.length
    ? !variants.some((variant) => Number(variant.stock) > 0)
    : Number(product.stock) <= 0
}
function addVariantToCart(variant) {
  if (!activeProduct.value) return
  cart.addItem(activeProduct.value, variant)
  activeProduct.value = null
}

async function fetchBranches() {
  branchesLoading.value = true
  branchesError.value = ''
  try {
    const response = await fetch('/api/branches', { credentials: 'same-origin', cache: 'no-store' })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(data.error || `Gagal memuat cabang (${response.status})`)
    branchConfigurationError.value = typeof data.configurationError === 'string'
      ? data.configurationError
      : (data.configurationError ? 'Konfigurasi cabang kasir belum lengkap.' : '')
    const list = data.branches
    if (!Array.isArray(list)) throw new Error('Format data cabang dari server tidak valid.')
    branchList.value = list
    selectedBranchId.value = String(list[0]?.id || '')
  } catch (error) {
    branchList.value = []
    branchesError.value = error.message || 'Gagal memuat cabang.'
  } finally {
    branchesLoading.value = false
  }
}

async function searchMember() {
  const phone = memberQuery.value.trim()
  memberResult.value = null
  memberNotFound.value = false
  membersError.value = ''
  if (!phone) {
    membersError.value = 'Masukkan nomor telepon lengkap untuk mencari member.'
    return
  }
  membersLoading.value = true
  try {
    const response = await fetch(`/api/members?phone=${encodeURIComponent(phone)}`, { credentials: 'same-origin', cache: 'no-store' })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(data.error || `Gagal memuat member (${response.status})`)
    if (!Object.hasOwn(data, 'member')) throw new Error('Format data member dari server tidak valid.')
    memberResult.value = data.member || null
    memberNotFound.value = !data.member
    if (!data.member) newMemberPhone.value = phone
  } catch (error) {
    membersError.value = error.message || 'Gagal memuat member.'
  } finally {
    membersLoading.value = false
  }
}

function openMemberPicker() {
  showMemberPicker.value = true
  memberQuery.value = ''
  memberResult.value = null
  memberNotFound.value = false
  membersError.value = ''
  newMemberName.value = ''
  newMemberPhone.value = ''
}

async function createMember() {
  const name = newMemberName.value.trim()
  const phone = newMemberPhone.value.trim()
  if (!name || !phone) {
    membersError.value = 'Nama dan nomor telepon wajib diisi.'
    return
  }
  creatingMember.value = true
  membersError.value = ''
  try {
    const response = await fetch('/api/members', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone }),
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(data.error || `Gagal membuat member (${response.status})`)
    if (!data.member) throw new Error('Server tidak mengembalikan data member yang dibuat.')
    selectedMember.value = data.member
    showMemberPicker.value = false
  } catch (error) {
    membersError.value = error.message || 'Gagal membuat member.'
  } finally {
    creatingMember.value = false
  }
}

async function handleCheckout() {
  const retryingUnknownCheckout = cart.checkoutOutcomeUnknown
  if ((cart.items.length === 0 && !retryingUnknownCheckout) || processing.value) return
  if (!retryingUnknownCheckout && (!branchReady.value || (orderType.value === 'dine_in' && !selectedTable.value))) {
    errorMessage.value = checkoutBlockedReason.value || 'Periksa cabang dan meja sebelum checkout.'
    return
  }
  errorMessage.value = ''
  successTransaction.value = null
  processing.value = true
  try {
    const result = await cart.checkout(retryingUnknownCheckout ? undefined : {
      branchId: selectedBranch.value?.id,
      cashierId: auth.cashier?.id,
      memberId: selectedMember.value?.id,
      orderType: orderType.value,
      tableId: orderType.value === 'dine_in' ? selectedTable.value?.id : undefined,
      paymentMethod: paymentMethod.value,
    })
    successTransaction.value = result
    if (result.items) productsStore.deductLocalStock(result.items)
    await productsStore.fetchProducts()
  } catch (error) {
    errorMessage.value = `${error.message || 'Gagal memproses transaksi.'}${error.outcomeUnknown ? ' Hasil transaksi belum diketahui; ulangi checkout untuk mencoba kembali dengan kunci transaksi yang sama.' : ''}`
  } finally {
    processing.value = false
  }
}

function handleKeydown(event) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    searchInputRef.value?.focus()
  }
}
onMounted(() => {
  productsStore.fetchProducts()
  fetchBranches()
  window.addEventListener('keydown', handleKeydown)
})
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <div class="w-full px-4 sm:px-6 lg:px-8 py-4 pb-12">
    <div v-if="successTransaction" class="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-3">
      <div>
        <p class="font-bold text-[13px]">Transaksi berhasil.</p>
        <p class="text-[11px]">{{ successTransaction.transactionId || successTransaction.id || '' }} <span v-if="successTransaction.totalAmount">• {{ formatRupiah(successTransaction.totalAmount) }}</span></p>
      </div>
      <button type="button" @click="successTransaction = null" class="text-xs font-semibold">Tutup</button>
    </div>
    <div v-if="errorMessage" class="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-[12px]" role="alert">
      <strong class="block mb-1">Checkout gagal</strong>{{ errorMessage }}
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      <section class="xl:col-span-8 flex flex-col gap-4 min-w-0">
        <div class="bg-surface-container-lowest p-3 rounded-xl shadow-xs flex items-center gap-3 border border-surface-container-high/60">
          <div class="relative w-full">
            <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
            <input ref="searchInputRef" v-model="search" class="w-full pl-11 pr-4 py-2 rounded-xl bg-surface-container-low text-[13px] focus:outline-none focus:ring-1 focus:ring-secondary" placeholder="Cari menu atau SKU..." type="search" />
          </div>
        </div>

        <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button type="button" @click="activeCategory = ''" class="px-4 py-2 rounded-xl text-[12px] font-semibold shrink-0" :class="activeCategory === '' ? 'bg-primary text-white' : 'bg-surface-container-lowest text-on-surface'">Semua Kategori</button>
          <button v-for="category in categories" :key="category" type="button" @click="activeCategory = category" class="px-4 py-2 rounded-xl text-[12px] font-semibold shrink-0" :class="activeCategory === category ? 'bg-primary text-white' : 'bg-surface-container-lowest text-on-surface'">{{ category }}</button>
        </div>

        <div v-if="productsStore.loading && productsStore.products.length === 0" class="p-12 text-center bg-surface-container-lowest rounded-xl border border-surface-container-high/60 text-[13px] text-on-surface-variant">Memuat katalog produk…</div>
        <div v-else-if="productsStore.error && productsStore.products.length === 0" class="p-8 text-center bg-red-50 rounded-xl border border-red-200 text-[13px] text-red-900" role="alert">Katalog tidak dapat dimuat: {{ productsStore.error }}</div>
        <div v-else-if="filteredProducts.length === 0" class="p-12 text-center bg-surface-container-lowest rounded-xl border border-surface-container-high/60">
          <span class="material-symbols-outlined text-outline text-[40px] mb-2">sentiment_dissatisfied</span>
          <p class="text-[13px] text-on-surface-variant">{{ productsStore.products.length ? 'Tidak ada menu yang sesuai dengan pencarian atau kategori.' : 'Belum ada produk pada katalog.' }}</p>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          <button v-for="product in filteredProducts" :key="product.id" type="button" @click="addToCart(product)" :disabled="isProductOutOfStock(product) || cart.checkoutOutcomeUnknown" class="group text-left relative bg-surface-container-lowest rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col cursor-pointer active:scale-[0.99] border border-surface-container-high/50 disabled:opacity-60 disabled:cursor-not-allowed">
            <div class="relative h-36 w-full overflow-hidden bg-surface-container">
              <img v-if="product.image_url" :src="product.image_url" :alt="product.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div v-else class="w-full h-full flex items-center justify-center text-outline"><span class="material-symbols-outlined text-[40px]">local_cafe</span></div>
              <span v-if="isProductOutOfStock(product)" class="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-error text-white text-[10px] font-bold">Habis</span>
            </div>
            <div class="p-3 flex flex-col justify-between flex-1 gap-2">
              <div><h3 class="text-[14px] font-semibold text-on-surface leading-tight line-clamp-1">{{ product.name }}</h3><p class="text-on-surface-variant text-[11px] line-clamp-1 mt-0.5">{{ product.category || 'Lainnya' }}</p></div>
              <div class="flex items-center justify-between pt-1"><span class="text-[14px] font-bold text-on-surface">{{ formatRupiah(product.price) }}</span><span class="material-symbols-outlined text-[18px]">add</span></div>
            </div>
          </button>
        </div>
      </section>

      <aside class="xl:col-span-4 sticky top-20 flex flex-col gap-4">
        <div class="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-sm border border-surface-container-high/60 flex flex-col">
          <div class="flex items-center justify-between pb-3 border-b border-surface-container-high/60">
            <div class="flex items-center gap-2"><h2 class="text-[16px] font-bold">Pesanan Aktif</h2><span class="px-2 py-0.5 rounded-full bg-surface-container-high text-[11px] font-semibold">{{ cart.count }} Item</span></div>
            <button v-if="cart.items.length" type="button" @click="cart.clear()" title="Bersihkan pesanan" class="text-outline hover:text-error"><span class="material-symbols-outlined">delete_sweep</span></button>
          </div>

          <div class="mt-3 space-y-3">
            <div>
              <label class="block text-[11px] font-semibold text-on-surface-variant mb-1" for="branch-select">Cabang</label>
              <select id="branch-select" v-model="selectedBranchId" :disabled="branchesLoading || !branchList.length || cart.checkoutOutcomeUnknown" @change="selectedTableId = ''" class="w-full px-3 py-2 rounded-lg bg-surface-container-low text-[12px] disabled:opacity-60">
                <option value="" disabled>{{ branchesLoading ? 'Memuat cabang…' : 'Pilih cabang' }}</option>
                <option v-for="branch in branchList" :key="branch.id" :value="String(branch.id)">{{ branch.name || branch.branchName || branch.branch_name || `Cabang ${branch.id}` }}</option>
              </select>
              <p v-if="branchesError" class="text-[11px] text-red-700 mt-1">Cabang tidak dapat dimuat: {{ branchesError }} Checkout diblokir.</p>
              <p v-else-if="branchConfigurationError" class="text-[11px] text-red-700 mt-1">{{ branchConfigurationError }} Checkout diblokir.</p>
              <p v-else-if="!branchesLoading && branchList.length === 0" class="text-[11px] text-red-700 mt-1">Server belum menyediakan cabang kasir untuk akun ini. Checkout diblokir.</p>
            </div>

            <div class="grid grid-cols-2 p-1 rounded-xl bg-surface-container-low">
              <button type="button" :disabled="cart.checkoutOutcomeUnknown" @click="orderType = 'dine_in'" class="py-1.5 rounded-lg text-[12px] font-semibold disabled:opacity-60" :class="orderType === 'dine_in' ? 'bg-white shadow-xs' : 'text-on-surface-variant'">Makan di tempat</button>
              <button type="button" :disabled="cart.checkoutOutcomeUnknown" @click="orderType = 'take_away'" class="py-1.5 rounded-lg text-[12px] font-semibold disabled:opacity-60" :class="orderType === 'take_away' ? 'bg-white shadow-xs' : 'text-on-surface-variant'">Take away</button>
            </div>
            <div v-if="orderType === 'dine_in'">
              <label class="block text-[11px] font-semibold text-on-surface-variant mb-1" for="table-select">Meja</label>
              <select id="table-select" v-model="selectedTableId" :disabled="!branchTables.length || cart.checkoutOutcomeUnknown" class="w-full px-3 py-2 rounded-lg bg-surface-container-low text-[12px] disabled:opacity-60">
                <option value="">{{ branchTables.length ? 'Pilih meja' : 'Data meja belum tersedia' }}</option>
                <option v-for="table in branchTables" :key="table.id" :value="String(table.id)">{{ tableName(table) }}</option>
              </select>
              <p v-if="selectedBranch && !branchTables.length" class="text-[11px] text-red-700 mt-1">Daftar meja tidak tersedia untuk cabang kasir ini. Makan di tempat tidak dapat di-checkout.</p>
              <p v-else-if="!selectedTable" class="text-[11px] text-on-surface-variant mt-1">Pilih meja sebelum checkout.</p>
            </div>
          </div>

          <div v-if="cart.items.length === 0" class="py-8 text-center text-on-surface-variant text-[12px]"><span class="material-symbols-outlined text-[32px] text-outline mb-1">shopping_cart</span><p>Keranjang masih kosong.</p><p class="text-[10px] text-outline mt-0.5">Pilih produk dari katalog untuk ditambahkan.</p></div>
          <div v-else class="flex flex-col gap-2 max-h-[290px] overflow-y-auto pr-1 mt-3">
            <div v-for="item in cart.items" :key="`${item.product.id}-${item.product.variantKey || ''}`" class="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between gap-2">
              <div class="min-w-0 flex-1"><h4 class="text-[13px] font-semibold truncate">{{ item.product.name }}<span v-if="item.product.variantName"> · {{ item.product.variantName }}</span></h4><span class="text-on-surface-variant text-[11px]">{{ item.product.sku ? `${item.product.sku} · ` : '' }}{{ formatRupiah(item.product.price) }} · Stok {{ item.product.stock }}</span></div>
              <div class="flex items-center gap-2 shrink-0"><div class="flex items-center bg-white rounded-lg p-0.5"><button type="button" :disabled="cart.checkoutOutcomeUnknown" @click="cart.decrementQty(item.product.id, item.product.variantKey)" aria-label="Kurangi jumlah" class="w-6 h-6 disabled:opacity-40">−</button><span class="w-6 text-center text-[12px] font-bold">{{ item.qty }}</span><button type="button" :disabled="cart.checkoutOutcomeUnknown" @click="cart.incrementQty(item.product.id, item.product.variantKey)" aria-label="Tambah jumlah" class="w-6 h-6 disabled:opacity-40">+</button></div><span class="text-[11px] font-bold w-16 text-right">{{ formatRupiah(item.product.price * item.qty) }}</span></div>
            </div>
          </div>

          <div class="mt-3 pt-3 border-t border-surface-container-high/60 flex flex-col gap-1.5">
            <div class="flex justify-between items-center text-[12px] text-on-surface-variant"><span>Subtotal</span><span class="font-medium text-on-surface">{{ formatRupiah(subtotal) }}</span></div>
            <div class="pt-2 mt-1 flex justify-between items-baseline border-t border-surface-container"><span class="text-[12px] text-on-surface-variant uppercase tracking-wider font-semibold">Total sementara</span><span class="text-[22px] leading-tight font-bold tracking-tight">{{ formatRupiah(total) }}</span></div>
            <p class="text-[10px] text-on-surface-variant">Pajak dan penyesuaian total mengikuti hasil server saat checkout.</p>
          </div>

          <div class="mt-3 rounded-xl bg-surface-container-low p-2">
            <div class="flex items-center justify-between gap-2"><div class="min-w-0"><span class="block text-[11px] text-on-surface-variant">Member</span><span class="block text-[12px] font-semibold truncate">{{ selectedMember ? memberName(selectedMember) : 'Tidak dipilih' }}</span></div><button type="button" :disabled="cart.checkoutOutcomeUnknown" @click="openMemberPicker" class="px-3 py-2 rounded-lg bg-white text-[11px] font-semibold disabled:opacity-50">{{ selectedMember ? 'Ganti' : 'Pilih Member' }}</button></div>
            <button v-if="selectedMember" type="button" :disabled="cart.checkoutOutcomeUnknown" @click="selectedMember = null" class="mt-1 text-[10px] text-secondary underline disabled:opacity-50">Hapus member dari pesanan</button>
          </div>

          <div class="mt-3 grid grid-cols-2 gap-1.5 p-1 bg-surface-container-low rounded-xl">
            <button v-for="method in [{id:'cash',label:'Tunai',icon:'payments'},{id:'qris',label:'QRIS',icon:'qr_code_scanner'}]" :key="method.id" type="button" :disabled="cart.checkoutOutcomeUnknown" @click="paymentMethod = method.id" class="p-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 disabled:opacity-50" :class="paymentMethod === method.id ? 'bg-white shadow-xs text-on-surface' : 'text-on-surface-variant'"><span class="material-symbols-outlined text-[17px]">{{ method.icon }}</span>{{ method.label }}</button>
          </div>
          <p v-if="checkoutBlockedReason && !branchesLoading" class="mt-3 text-[11px] text-red-700" role="status">{{ checkoutBlockedReason }}</p>
          <button type="button" @click="handleCheckout" :disabled="cart.items.length === 0 || processing || (!cart.checkoutOutcomeUnknown && Boolean(checkoutBlockedReason))" class="mt-4 w-full py-3 px-4 rounded-xl bg-primary hover:bg-secondary text-white font-bold text-[14px] shadow-xs flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
            <span v-if="processing" class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span><span v-else class="material-symbols-outlined text-[20px]">point_of_sale</span>
            <span>{{ processing ? 'Memproses transaksi…' : cart.checkoutOutcomeUnknown ? `Coba checkout lagi ${formatRupiah(total)}` : `Checkout ${formatRupiah(total)}` }}</span>
          </button>
          <p v-if="cart.checkoutOutcomeUnknown" class="mt-2 text-[10px] text-amber-800">Keranjang dan detail transaksi dikunci sampai server mengonfirmasi hasil retry.</p>
        </div>
      </aside>
    </div>

    <div v-if="showMemberPicker" class="fixed inset-0 z-50 bg-stone-900/40 flex items-center justify-center p-4" @click.self="showMemberPicker = false">
      <section class="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-5 max-w-md w-full shadow-xl" role="dialog" aria-modal="true" aria-labelledby="member-picker-title">
        <div class="flex items-center justify-between mb-3"><h2 id="member-picker-title" class="text-[16px] font-bold">Cari Member</h2><button type="button" @click="showMemberPicker = false" aria-label="Tutup">×</button></div>
        <form @submit.prevent="searchMember" class="flex gap-2">
          <input v-model="memberQuery" type="tel" autocomplete="off" inputmode="tel" placeholder="Nomor telepon lengkap" class="min-w-0 flex-1 px-3 py-2 rounded-lg bg-surface-container-low text-[13px]" />
          <button type="submit" :disabled="membersLoading" class="px-3 py-2 rounded-lg bg-primary text-white text-[12px] font-semibold disabled:opacity-50">{{ membersLoading ? 'Mencari…' : 'Cari' }}</button>
        </form>
        <p class="mt-2 text-[10px] text-on-surface-variant">Pencarian dilakukan hanya dengan nomor telepon yang dimasukkan; tidak ada daftar seluruh member yang dimuat.</p>
        <p v-if="membersError" class="py-3 text-[12px] text-red-800" role="alert">{{ membersError }}</p>
        <div v-else-if="memberResult" class="mt-4 p-3 rounded-xl bg-surface-container-low flex items-center justify-between gap-3"><div class="min-w-0"><span class="block text-[13px] font-semibold">{{ memberName(memberResult) }}</span><span class="block text-[11px] text-on-surface-variant">{{ memberResult.phone }}</span></div><button type="button" @click="selectedMember = memberResult; showMemberPicker = false" class="px-3 py-2 rounded-lg bg-white text-[11px] font-semibold">Pilih</button></div>
        <form v-else-if="memberNotFound" @submit.prevent="createMember" class="mt-4 space-y-3">
          <p class="text-[12px] text-on-surface-variant">Nomor ini belum terdaftar. Buat member baru:</p>
          <label class="block text-[11px] font-semibold">Nama<input v-model="newMemberName" type="text" autocomplete="off" required class="mt-1 w-full px-3 py-2 rounded-lg bg-surface-container-low text-[13px]" /></label>
          <label class="block text-[11px] font-semibold">Nomor telepon<input v-model="newMemberPhone" type="tel" autocomplete="off" required class="mt-1 w-full px-3 py-2 rounded-lg bg-surface-container-low text-[13px]" /></label>
          <button type="submit" :disabled="creatingMember" class="w-full px-3 py-2 rounded-lg bg-primary text-white text-[12px] font-semibold disabled:opacity-50">{{ creatingMember ? 'Membuat…' : 'Buat dan pilih member' }}</button>
        </form>
      </section>
    </div>

    <div v-if="activeProduct" class="fixed inset-0 z-50 bg-stone-900/40 flex items-center justify-center p-4" @click.self="activeProduct = null">
      <section class="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-5 max-w-md w-full shadow-xl" role="dialog" aria-modal="true" aria-labelledby="variant-picker-title">
        <div class="flex items-center justify-between mb-3"><h2 id="variant-picker-title" class="text-[16px] font-bold">Pilih varian · {{ activeProduct.name }}</h2><button type="button" @click="activeProduct = null" aria-label="Tutup">×</button></div>
        <div class="divide-y divide-surface-container max-h-80 overflow-y-auto">
          <button v-for="variant in activeProduct.variants" :key="variant.id" type="button" :disabled="Number(variant.stock) <= 0 || cart.checkoutOutcomeUnknown" @click="addVariantToCart(variant)" class="w-full text-left py-3 px-2 flex items-center justify-between gap-3 hover:bg-surface-container-low disabled:opacity-50 disabled:cursor-not-allowed">
            <span class="min-w-0"><span class="block text-[13px] font-semibold">{{ variant.name }}</span><span class="block text-[11px] text-on-surface-variant">{{ variant.sku || 'Tanpa SKU' }} · Stok {{ variant.stock }}</span></span><span class="text-[13px] font-bold whitespace-nowrap">{{ formatRupiah(variant.price) }}</span>
          </button>
        </div>
        <p v-if="!activeProduct.variants.some((variant) => Number(variant.stock) > 0)" class="mt-3 text-[12px] text-on-surface-variant">Semua varian sedang habis.</p>
      </section>
    </div>
  </div>
</template>
