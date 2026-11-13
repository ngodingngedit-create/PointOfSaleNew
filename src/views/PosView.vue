<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useCartStore } from '../stores/cart'
import { useProductsStore } from '../stores/products'

const cart = useCartStore()
const productsStore = useProductsStore()

const paymentMethod = ref('cash')
const successTransaction = ref(null)
const errorMessage = ref('')
const processing = ref(false)
const search = ref('')
const searchInputRef = ref(null)
const orderType = ref('dine_in') // dine_in, take_away
const tableNo = ref('Meja 04')
const showManualItemModal = ref(false)
const manualItem = ref({ name: '', price: 0, qty: 1 })
const discountMember = ref(10000)

const categories = computed(() => {
  const cats = [
    ...new Set(
      productsStore.products
        .filter((p) => p.is_active)
        .map((p) => p.category || 'Lainnya')
    ),
  ]
  return cats.sort()
})
const activeCategory = ref('')

const filteredProducts = computed(() => {
  return productsStore.products.filter((p) => {
    if (!p.is_active) return false
    if (activeCategory.value && (p.category || 'Lainnya') !== activeCategory.value) return false
    if (search.value) {
      const query = search.value.toLowerCase()
      const matchesProduct = p.name.toLowerCase().includes(query)
      const matchesSku = String(p.sku || '').toLowerCase().includes(query)
      const matchesVariant = (Array.isArray(p.variants) ? p.variants : []).some((variant) =>
        `${variant.name} ${variant.sku}`.toLowerCase().includes(query)
      )
      if (!matchesProduct && !matchesSku && !matchesVariant) return false
    }
    return true
  })
})

const subtotal = computed(() => cart.total)
const pb1Tax = computed(() => Math.round(subtotal.value * 0.1))
const finalTotal = computed(() => {
  if (subtotal.value === 0) return 0
  const afterDiscount = subtotal.value + pb1Tax.value - discountMember.value
  return Math.max(0, afterDiscount)
})

function formatRupiah(v) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v || 0)
}

function addToCart(p) {
  cart.addItem(p)
}

function addCustomItem() {
  if (!manualItem.value.name || manualItem.value.price <= 0) return
  const customProd = {
    id: `custom_${Date.now()}`,
    name: manualItem.value.name,
    price: Number(manualItem.value.price),
    stock: 999,
    category: 'Custom',
    is_active: true,
  }
  for (let i = 0; i < manualItem.value.qty; i++) {
    cart.addItem(customProd)
  }
  manualItem.value = { name: '', price: 0, qty: 1 }
  showManualItemModal.value = false
}

async function handleCheckout() {
  if (cart.items.length === 0 || processing.value) return
  errorMessage.value = ''
  successTransaction.value = null
  processing.value = true

  try {
    const res = await cart.checkout(paymentMethod.value)
    successTransaction.value = res
    if (res.items) {
      productsStore.deductLocalStock(res.items)
    }
    await productsStore.fetchProducts()
  } catch (e) {
    errorMessage.value = e.message || 'Gagal memproses transaksi'
  } finally {
    processing.value = false
  }
}

function handleKeydown(e) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    searchInputRef.value?.focus()
  }
}

onMounted(() => {
  productsStore.fetchProducts()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="w-full px-4 sm:px-6 lg:px-8 py-4 pb-12">
    <!-- Feedback Alerts -->
    <div
      v-if="successTransaction"
      class="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-3 shadow-xs"
    >
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-emerald-600 text-[24px]">check_circle</span>
        <div>
          <p class="font-bold text-[13px] text-emerald-950">Pesanan Berhasil Diselesaikan &amp; Struk Terkirim!</p>
          <p class="text-[11px] text-emerald-800">
            ID: {{ successTransaction.transactionId }} • {{ successTransaction.paymentMethod?.toUpperCase() }} • {{ formatRupiah(successTransaction.totalAmount) }}
          </p>
        </div>
      </div>
      <button
        type="button"
        @click="successTransaction = null"
        class="text-xs text-emerald-700 hover:text-emerald-950 font-semibold px-2 py-1"
      >
        Tutup
      </button>
    </div>

    <div
      v-if="errorMessage"
      class="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-center justify-between gap-3 shadow-xs"
    >
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-red-600 text-[24px]">error</span>
        <div>
          <p class="font-bold text-[13px] text-red-950">Gagal Memproses Pesanan</p>
          <p class="text-[11px] text-red-800">{{ errorMessage }}</p>
        </div>
      </div>
      <button
        type="button"
        @click="errorMessage = ''"
        class="text-xs text-red-700 hover:text-red-950 font-semibold px-2 py-1"
      >
        Tutup
      </button>
    </div>

    <!-- Main Split Layout (Left: 8 cols, Right: 4 cols) -->
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      <!-- LEFT PANEL: Catalog, Search & Product Grid -->
      <section class="xl:col-span-8 flex flex-col gap-4 min-w-0">
        <!-- Top Action Bar: Search & Shortcut Hint -->
        <div class="bg-surface-container-lowest p-3 rounded-xl shadow-xs flex items-center gap-3 border border-surface-container-high/60">
          <div class="relative w-full flex-1">
            <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
            <input
              ref="searchInputRef"
              v-model="search"
              class="w-full pl-11 pr-20 py-2 rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline text-[13px] focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-secondary transition-all"
              placeholder="Cari menu atau ketik ⌘K..."
              type="text"
            />
            <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd class="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[10px] font-mono">⌘K</kbd>
            </div>
          </div>
        </div>

        <!-- Category Filter Pills Bar -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            @click="activeCategory = ''"
            class="px-4 py-2 rounded-xl text-[12px] font-semibold shrink-0 shadow-xs flex items-center gap-2 transition-transform active:scale-95"
            :class="activeCategory === '' ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest hover:bg-surface-container-high text-on-surface'"
          >
            <span>Semua Kategori</span>
            <span
              class="px-1.5 py-0.5 rounded-full text-[10px]"
              :class="activeCategory === '' ? 'bg-surface-container-high/30 text-on-primary' : 'bg-surface-container-low text-on-surface-variant'"
            >
              {{ productsStore.products.filter(p => p.is_active).length }}
            </span>
          </button>
          <button
            v-for="c in categories"
            :key="c"
            type="button"
            @click="activeCategory = c"
            class="px-4 py-2 rounded-xl text-[12px] font-semibold shrink-0 shadow-xs flex items-center gap-2 transition-all active:scale-95"
            :class="activeCategory === c ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest hover:bg-surface-container-high text-on-surface'"
          >
            <span class="material-symbols-outlined text-[16px] text-secondary">local_cafe</span>
            <span>{{ c }}</span>
            <span
              class="px-1.5 py-0.5 rounded-full text-[10px]"
              :class="activeCategory === c ? 'bg-surface-container-high/30 text-on-primary' : 'bg-surface-container-low text-on-surface-variant'"
            >
              {{ productsStore.products.filter(p => p.is_active && (p.category || 'Lainnya') === c).length }}
            </span>
          </button>
        </div>

        <!-- Menu Items Grid (Responsive 2 to 4 columns) -->
        <div v-if="filteredProducts.length === 0" class="p-12 text-center bg-surface-container-lowest rounded-xl border border-surface-container-high/60">
          <span class="material-symbols-outlined text-outline text-[40px] mb-2">sentiment_dissatisfied</span>
          <p class="text-[13px] text-on-surface-variant">Tidak ada menu yang sesuai dengan filter.</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          <div
            v-for="p in filteredProducts"
            :key="p.id"
            @click="addToCart(p)"
            class="group relative bg-surface-container-lowest rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col cursor-pointer active:scale-[0.99] border border-surface-container-high/50"
          >
            <div class="relative h-36 w-full overflow-hidden bg-surface-container">
              <img
                :src="p.image_url || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60'"
                :alt="p.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span v-if="p.stock <= 5 && p.stock > 0" class="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-secondary text-white text-[10px] font-bold">
                Sisa {{ p.stock }}
              </span>
              <span v-else-if="p.stock <= 0" class="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-error text-white text-[10px] font-bold">
                Habis
              </span>
            </div>
            <div class="p-3 flex flex-col justify-between flex-1 gap-2">
              <div>
                <h3 class="text-[14px] font-semibold text-on-surface leading-tight line-clamp-1 group-hover:text-secondary transition-colors">
                  {{ p.name }}
                </h3>
                <p class="text-on-surface-variant text-[11px] line-clamp-1 mt-0.5">
                  {{ p.category || 'Specialty Coffee' }} <span v-if="p.sku">• {{ p.sku }}</span>
                </p>
              </div>
              <div class="flex items-center justify-between pt-1">
                <span class="text-[14px] font-bold text-on-surface">{{ formatRupiah(p.price) }}</span>
                <button
                  type="button"
                  class="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface group-hover:bg-primary group-hover:text-on-primary flex items-center justify-center transition-all shadow-xs"
                >
                  <span class="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Add Custom / Open Price -->
        <div class="p-4 bg-surface-container-low rounded-xl flex items-center justify-between shadow-xs border border-surface-container">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-secondary shadow-xs">
              <span class="material-symbols-outlined text-[22px]">tune</span>
            </div>
            <div>
              <h4 class="text-[13px] font-semibold text-on-surface">Item Kustom / Open Price</h4>
              <p class="text-on-surface-variant text-[11px]">Untuk pesanan seasonal atau permintaan khusus pelanggan</p>
            </div>
          </div>
          <button
            type="button"
            @click="showManualItemModal = true"
            class="px-4 py-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface text-[12px] font-semibold shadow-xs transition-all flex items-center gap-1.5"
          >
            <span class="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Input Manual</span>
          </button>
        </div>
      </section>

      <!-- RIGHT PANEL: Active Order Cart & Terminal Checkout -->
      <aside class="xl:col-span-4 sticky top-20 flex flex-col gap-4">
        <div class="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-sm border border-surface-container-high/60 flex flex-col">
          <!-- Cart Header -->
          <div class="flex items-center justify-between pb-3 border-b border-surface-container-high/60">
            <div class="flex items-center gap-2">
              <h2 class="text-[16px] font-bold text-on-surface">Pesanan Aktif</h2>
              <span class="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface text-[11px] font-semibold">
                {{ cart.itemCount }} Item
              </span>
            </div>
            <button
              v-if="cart.items.length > 0"
              @click="cart.clearCart()"
              type="button"
              class="text-outline hover:text-error transition-colors p-1 rounded-lg hover:bg-surface-container-low"
              title="Bersihkan Pesanan"
            >
              <span class="material-symbols-outlined text-[20px]">delete_sweep</span>
            </button>
          </div>

          <!-- Dining Mode Tabs -->
          <div class="grid grid-cols-2 p-1 rounded-xl bg-surface-container-low my-3">
            <button
              type="button"
              @click="orderType = 'dine_in'"
              class="py-1.5 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all"
              :class="orderType === 'dine_in' ? 'bg-surface-container-lowest shadow-xs text-on-surface' : 'text-on-surface-variant hover:text-on-surface'"
            >
              <span class="material-symbols-outlined text-[16px] text-secondary">table_restaurant</span>
              <span>{{ tableNo }}</span>
            </button>
            <button
              type="button"
              @click="orderType = 'take_away'"
              class="py-1.5 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all"
              :class="orderType === 'take_away' ? 'bg-surface-container-lowest shadow-xs text-on-surface' : 'text-on-surface-variant hover:text-on-surface'"
            >
              <span class="material-symbols-outlined text-[16px]">shopping_bag</span>
              <span>Take Away</span>
            </button>
          </div>

          <!-- Cart Item List -->
          <div v-if="cart.items.length === 0" class="py-10 text-center text-on-surface-variant text-[12px]">
            <span class="material-symbols-outlined text-[32px] text-outline mb-1">shopping_cart</span>
            <p>Keranjang masih kosong.</p>
            <p class="text-[10px] text-outline mt-0.5">Pilih produk di katalog untuk ditambahkan.</p>
          </div>

          <div v-else class="flex flex-col gap-2 max-h-[290px] overflow-y-auto pr-1">
            <div
              v-for="i in cart.items"
              :key="i.product.id"
              class="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between"
            >
              <div class="min-w-0 flex-1">
                <h4 class="text-[13px] font-semibold text-on-surface truncate">{{ i.product.name }}</h4>
                <span class="text-on-surface-variant text-[11px]">{{ formatRupiah(i.product.price) }}</span>
              </div>
              <div class="flex items-center gap-3 shrink-0">
                <div class="flex items-center bg-surface-container-lowest rounded-lg p-0.5 shadow-xs">
                  <button
                    type="button"
                    @click="cart.decrementQty(i.product.id, i.product.variantKey)"
                    class="w-6 h-6 flex items-center justify-center rounded text-on-surface hover:bg-surface-container transition-all"
                  >
                    <span class="material-symbols-outlined text-[13px]">remove</span>
                  </button>
                  <span class="w-6 text-center text-[12px] font-bold text-on-surface">{{ i.qty }}</span>
                  <button
                    type="button"
                    @click="cart.incrementQty(i.product.id, i.product.variantKey)"
                    class="w-6 h-6 flex items-center justify-center rounded text-on-surface hover:bg-surface-container transition-all"
                  >
                    <span class="material-symbols-outlined text-[13px]">add</span>
                  </button>
                </div>
                <span class="text-[12px] font-bold text-on-surface w-16 text-right">
                  {{ (i.product.price * i.qty).toLocaleString('id-ID') }}
                </span>
              </div>
            </div>
          </div>

          <!-- Totals Summary -->
          <div class="mt-3 pt-3 border-t border-surface-container-high/60 flex flex-col gap-1.5">
            <div class="flex justify-between items-center text-[12px] text-on-surface-variant">
              <span>Subtotal</span>
              <span class="text-[13px] font-medium text-on-surface">{{ formatRupiah(subtotal) }}</span>
            </div>
            <div class="flex justify-between items-center text-[12px] text-on-surface-variant">
              <span>PB1 (10%)</span>
              <span class="text-[13px] font-medium text-on-surface">{{ formatRupiah(pb1Tax) }}</span>
            </div>
            <div class="flex justify-between items-center text-[12px] text-secondary font-medium">
              <span>Diskon Member</span>
              <span>-{{ formatRupiah(discountMember) }}</span>
            </div>
            <div class="pt-2 mt-1 flex justify-between items-baseline border-t border-surface-container">
              <span class="text-[12px] text-on-surface-variant uppercase tracking-wider font-semibold">Total</span>
              <span class="text-[24px] leading-tight font-bold text-on-surface tracking-tight">
                {{ formatRupiah(finalTotal) }}
              </span>
            </div>
          </div>

          <!-- Payment Methods Pills -->
          <div class="mt-3">
            <div class="grid grid-cols-2 gap-1.5 p-1 bg-surface-container-low rounded-xl">
              <button
                type="button"
                @click="paymentMethod = 'cash'"
                class="p-2 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all"
                :class="paymentMethod === 'cash' ? 'bg-surface-container-lowest shadow-xs text-on-surface font-bold' : 'text-on-surface-variant hover:bg-surface-container'"
              >
                <span class="material-symbols-outlined text-[18px]">payments</span>
                <span>Tunai</span>
              </button>
              <button
                type="button"
                @click="paymentMethod = 'qris'"
                class="p-2 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all"
                :class="paymentMethod === 'qris' ? 'bg-surface-container-lowest shadow-xs text-on-surface font-bold' : 'text-on-surface-variant hover:bg-surface-container'"
              >
                <span class="material-symbols-outlined text-[18px] text-secondary">qr_code_scanner</span>
                <span>QRIS</span>
              </button>
              <button
                type="button"
                @click="paymentMethod = 'edc'"
                class="p-2 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all"
                :class="paymentMethod === 'edc' ? 'bg-surface-container-lowest shadow-xs text-on-surface font-bold' : 'text-on-surface-variant hover:bg-surface-container'"
              >
                <span class="material-symbols-outlined text-[18px] text-secondary">credit_card</span>
                <span>EDC / Kartu</span>
              </button>
              <button
                type="button"
                @click="paymentMethod = 'transfer'"
                class="p-2 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all"
                :class="paymentMethod === 'transfer' ? 'bg-surface-container-lowest shadow-xs text-on-surface font-bold' : 'text-on-surface-variant hover:bg-surface-container'"
              >
                <span class="material-symbols-outlined text-[18px] text-secondary">account_balance</span>
                <span>Transfer</span>
              </button>
            </div>
          </div>

          <!-- Checkout Actions -->
          <div class="mt-4 flex flex-col gap-2">
            <button
              type="button"
              @click="handleCheckout"
              :disabled="cart.items.length === 0 || processing"
              class="w-full py-3 px-4 rounded-xl bg-primary hover:bg-secondary text-white font-bold text-[14px] shadow-xs transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span v-if="processing" class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
              <span v-else class="material-symbols-outlined text-[20px]">print</span>
              <span>{{ processing ? 'Memproses Struk Thermal...' : `Bayar ${formatRupiah(finalTotal)}` }}</span>
            </button>
            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                class="py-2 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-[12px] font-semibold transition-all flex items-center justify-center gap-1"
              >
                <span class="material-symbols-outlined text-[16px]">pause</span>
                <span>Hold</span>
              </button>
              <button
                type="button"
                class="py-2 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-[12px] font-semibold transition-all flex items-center justify-center gap-1"
              >
                <span class="material-symbols-outlined text-[16px]">person</span>
                <span>Member</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- Manual Item Modal -->
    <div
      v-if="showManualItemModal"
      class="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="showManualItemModal = false"
    >
      <div class="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-5 max-w-sm w-full shadow-lg">
        <h3 class="text-[15px] font-bold text-on-surface mb-1">Item Kustom / Open Price</h3>
        <p class="text-[12px] text-on-surface-variant mb-4">Input pesanan tanpa item katalog.</p>
        <div class="space-y-3">
          <div>
            <label class="block text-[11px] font-semibold text-on-surface mb-1">Nama Item</label>
            <input
              v-model="manualItem.name"
              type="text"
              placeholder="Contoh: Kopi Khusus Blend X"
              class="w-full px-3 py-2 rounded-lg bg-surface-container-low text-[13px] border border-surface-container"
            />
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-on-surface mb-1">Harga (Rp)</label>
            <input
              v-model="manualItem.price"
              type="number"
              placeholder="0"
              class="w-full px-3 py-2 rounded-lg bg-surface-container-low text-[13px] border border-surface-container"
            />
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-on-surface mb-1">Jumlah</label>
            <input
              v-model="manualItem.qty"
              type="number"
              min="1"
              class="w-full px-3 py-2 rounded-lg bg-surface-container-low text-[13px] border border-surface-container"
            />
          </div>
        </div>
        <div class="flex items-center gap-2 mt-5">
          <button
            type="button"
            @click="showManualItemModal = false"
            class="flex-1 py-2 rounded-lg bg-surface-container text-on-surface text-[12px] font-semibold"
          >
            Batal
          </button>
          <button
            type="button"
            @click="addCustomItem"
            class="flex-1 py-2 rounded-lg bg-primary text-white text-[12px] font-semibold"
          >
            Tambahkan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
