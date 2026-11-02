<script setup>
import { computed, onMounted, ref } from 'vue'
import { useCartStore } from '../stores/cart'
import { useProductsStore } from '../stores/products'

const cart = useCartStore()
const productsStore = useProductsStore()

const paymentMethod = ref('cash')
const successTransaction = ref(null)
const errorMessage = ref('')
const processing = ref(false)
const search = ref('')
const isCartOpenMobile = ref(false)
const showConfirmModal = ref(false)

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

const filteredProducts = computed(() =>
  productsStore.products.filter((p) => {
    if (!p.is_active) return false
    if (activeCategory.value && (p.category || 'Lainnya') !== activeCategory.value) return false
    if (search.value && !p.name.toLowerCase().includes(search.value.toLowerCase())) return false
    return true
  })
)

function getQtyInCart(productId) {
  const found = cart.items.find((i) => i.product.id === productId)
  return found ? found.qty : 0
}

function formatRupiah(v) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(v || 0)
}

function openConfirmation() {
  if (cart.items.length === 0) return
  errorMessage.value = ''
  showConfirmModal.value = true
}

async function proceedCheckout() {
  showConfirmModal.value = false
  errorMessage.value = ''
  successTransaction.value = null
  processing.value = true

  try {
    const res = await cart.checkout(paymentMethod.value)
    successTransaction.value = res
    // Update stok lokal agar responsif seketika
    if (res.items) {
      productsStore.deductLocalStock(res.items)
    }
    // Refresh katalog dari server untuk data paling mutakhir
    await productsStore.fetchProducts()
    isCartOpenMobile.value = false
  } catch (e) {
    errorMessage.value = e.message || 'Terjadi kesalahan saat memproses checkout'
  } finally {
    processing.value = false
  }
}

onMounted(() => productsStore.fetchProducts())
</script>

<template>
  <div class="relative">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-24 lg:pb-0">
      <!-- Katalog Produk -->
      <section class="lg:col-span-7 xl:col-span-8 space-y-4">
        <!-- Pencarian & Filter Kategori -->
        <div class="bg-white border border-stone-200 rounded-lg p-3 sm:p-4 space-y-3">
          <div class="relative">
            <input
              v-model="search"
              type="search"
              placeholder="Cari nama menu..."
              class="w-full h-11 pl-3.5 pr-4 text-sm bg-stone-50 border border-stone-300 rounded-md focus:bg-white focus:border-stone-900 transition-colors"
            />
          </div>

          <!-- Kategori Horizontal Pills -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              @click="activeCategory = ''"
              class="h-8 px-3 rounded-full border whitespace-nowrap transition-colors"
              :class="activeCategory === ''
                ? 'bg-stone-900 border-stone-900 text-white font-medium'
                : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100'"
            >
              Semua Kategori
            </button>
            <button
              v-for="c in categories"
              :key="c"
              type="button"
              @click="activeCategory = c"
              class="h-8 px-3 rounded-full border whitespace-nowrap transition-colors"
              :class="activeCategory === c
                ? 'bg-stone-900 border-stone-900 text-white font-medium'
                : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100'"
            >
              {{ c }}
            </button>
          </div>
        </div>

        <!-- Feedback Alert -->
        <div
          v-if="successTransaction"
          class="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-emerald-900 flex items-start justify-between gap-3 text-xs sm:text-sm"
        >
          <div>
            <p class="font-semibold text-emerald-950">Transaksi Berhasil Diselesaikan</p>
            <p class="font-mono text-xs mt-0.5">ID: {{ successTransaction.transactionId }}</p>
            <p class="text-xs text-emerald-800 mt-1">
              Metode: <span class="uppercase font-semibold">{{ successTransaction.paymentMethod }}</span>
              • Total: <span class="font-mono font-bold">{{ formatRupiah(successTransaction.totalAmount) }}</span>
            </p>
          </div>
          <button
            type="button"
            @click="successTransaction = null"
            class="text-xs text-emerald-700 hover:text-emerald-950 font-medium"
          >
            Tutup
          </button>
        </div>

        <div
          v-if="errorMessage"
          class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-900 flex items-start justify-between gap-3 text-xs sm:text-sm"
        >
          <div>
            <p class="font-semibold text-red-950">Gagal Memproses Transaksi</p>
            <p class="text-xs text-red-800 mt-0.5">{{ errorMessage }}</p>
          </div>
          <button
            type="button"
            @click="errorMessage = ''"
            class="text-xs text-red-700 hover:text-red-950 font-medium"
          >
            Tutup
          </button>
        </div>

        <!-- State Loading Produk -->
        <div
          v-if="productsStore.loading && productsStore.products.length === 0"
          class="bg-white border border-stone-200 rounded-lg p-12 text-center text-xs text-stone-500"
        >
          Memuat katalog menu dari Sanity...
        </div>

        <!-- Product Cards Grid -->
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          <div
            v-for="p in filteredProducts"
            :key="p.id"
            class="min-h-[140px] bg-white border rounded-lg p-3 text-left transition flex flex-col justify-between"
            :class="[
              getQtyInCart(p.id) > 0 ? 'border-stone-900 ring-1 ring-stone-900' : 'border-stone-200 hover:border-stone-400',
              p.stock <= 0 ? 'opacity-40 pointer-events-none' : ''
            ]"
          >
            <div class="cursor-pointer" @click="cart.addItem(p)">
              <!-- Thumbnail gambar jika ada -->
              <div v-if="p.image_url" class="w-full h-24 mb-2 rounded overflow-hidden bg-stone-100 border border-stone-100">
                <img :src="p.image_url" :alt="p.name" class="w-full h-full object-cover" loading="lazy" />
              </div>

              <div class="flex items-center justify-between gap-1 text-[11px] text-stone-500 font-medium">
                <span class="truncate">{{ p.category || 'Reguler' }}</span>
                <span
                  class="px-1.5 py-0.5 rounded text-[10px] font-mono"
                  :class="p.stock <= 5 ? 'bg-amber-100 text-amber-900 font-bold' : 'bg-stone-100 text-stone-600'"
                >
                  {{ p.stock }} sisa
                </span>
              </div>
              <p class="font-medium text-stone-900 text-sm mt-1 line-clamp-2">{{ p.name }}</p>
            </div>

            <div class="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
              <span class="text-stone-900 font-semibold text-sm font-mono">{{ formatRupiah(p.price) }}</span>

              <!-- Direct Add/Qty Button -->
              <div v-if="getQtyInCart(p.id) > 0" class="flex items-center gap-1">
                <button
                  type="button"
                  @click.stop="cart.decrementQty(p.id)"
                  class="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center justify-center"
                >
                  -
                </button>
                <span class="text-xs font-mono font-semibold px-1">{{ getQtyInCart(p.id) }}</span>
                <button
                  type="button"
                  @click.stop="cart.incrementQty(p.id)"
                  :disabled="getQtyInCart(p.id) >= p.stock"
                  class="w-6 h-6 rounded bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
              <button
                v-else
                type="button"
                @click.stop="cart.addItem(p)"
                :disabled="p.stock <= 0"
                class="px-2 py-1 rounded bg-stone-100 hover:bg-stone-900 hover:text-white text-stone-700 text-xs font-medium transition-colors"
              >
                + Tambah
              </button>
            </div>
          </div>
        </div>

        <div
          v-if="!productsStore.loading && filteredProducts.length === 0"
          class="bg-white border border-dashed border-stone-300 rounded-lg p-10 text-center"
        >
          <p class="text-sm font-medium text-stone-700">Produk tidak ditemukan</p>
          <p class="text-xs text-stone-500 mt-1">Coba kata kunci pencarian atau kategori lain.</p>
        </div>
      </section>

      <!-- Desktop Sidebar Keranjang -->
      <aside class="hidden lg:block lg:col-span-5 xl:col-span-4 lg:sticky lg:top-16">
        <div class="bg-white border border-stone-200 rounded-lg p-4 sm:p-5">
          <div class="flex items-center justify-between pb-3 border-b border-stone-200">
            <div>
              <h2 class="text-sm font-semibold tracking-wide text-stone-900 uppercase">Pesanan Aktif</h2>
              <p class="text-xs text-stone-500">{{ cart.items.length }} menu dipilih</p>
            </div>
            <button
              v-if="cart.items.length > 0"
              @click="cart.clear"
              type="button"
              class="text-xs text-stone-500 hover:text-red-700 transition-colors"
            >
              Reset
            </button>
          </div>

          <div v-if="cart.items.length === 0" class="py-12 text-center">
            <p class="text-xs text-stone-400">Keranjang masih kosong.</p>
            <p class="text-xs text-stone-500 mt-1">Pilih menu di katalog untuk mulai pesanan.</p>
          </div>

          <div v-else class="divide-y divide-stone-100 my-3 max-h-72 overflow-y-auto pr-1">
            <div
              v-for="i in cart.items"
              :key="i.product.id"
              class="py-2.5 flex items-center justify-between gap-2"
            >
              <div class="min-w-0 flex-1">
                <p class="text-xs sm:text-sm font-medium text-stone-800 truncate">{{ i.product.name }}</p>
                <p class="text-xs text-stone-500 font-mono">{{ formatRupiah(i.product.price) }} × {{ i.qty }}</p>
              </div>
              <div class="flex items-center gap-1.5">
                <button
                  @click="cart.decrementQty(i.product.id)"
                  type="button"
                  aria-label="Kurangi jumlah"
                  class="w-8 h-8 rounded border border-stone-300 text-stone-700 hover:bg-stone-100 flex items-center justify-center font-bold text-sm"
                >
                  -
                </button>
                <span class="w-7 text-center text-xs font-semibold font-mono">{{ i.qty }}</span>
                <button
                  @click="cart.incrementQty(i.product.id)"
                  type="button"
                  aria-label="Tambah jumlah"
                  :disabled="i.qty >= i.product.stock"
                  class="w-8 h-8 rounded border border-stone-300 text-stone-700 hover:bg-stone-100 flex items-center justify-center font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  +
                </button>
                <button
                  @click="cart.removeItem(i.product.id)"
                  type="button"
                  class="w-8 h-8 text-xs text-stone-400 hover:text-red-700 flex items-center justify-center ml-1"
                  title="Hapus item"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-stone-200 space-y-3">
            <div class="flex justify-between items-baseline">
              <span class="text-xs text-stone-500 font-medium">Subtotal</span>
              <span class="text-base font-semibold font-mono text-stone-900">{{ formatRupiah(cart.total) }}</span>
            </div>

            <div>
              <label class="block text-xs font-medium text-stone-600 mb-1.5">Metode Pembayaran</label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  @click="paymentMethod = 'cash'"
                  :class="paymentMethod === 'cash'
                    ? 'border-stone-900 bg-stone-900 text-white'
                    : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'"
                  class="h-10 border rounded text-xs font-semibold tracking-wide transition-colors"
                >
                  Tunai (Cash)
                </button>
                <button
                  type="button"
                  @click="paymentMethod = 'qris'"
                  :class="paymentMethod === 'qris'
                    ? 'border-stone-900 bg-stone-900 text-white'
                    : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'"
                  class="h-10 border rounded text-xs font-semibold tracking-wide transition-colors"
                >
                  QRIS
                </button>
              </div>
            </div>

            <button
              type="button"
              @click="openConfirmation"
              :disabled="cart.items.length === 0 || processing"
              class="w-full h-12 bg-amber-700 hover:bg-amber-800 text-white font-medium text-sm rounded-md disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {{ processing ? 'Memproses ke server...' : `Konfirmasi Bayar (${formatRupiah(cart.total)})` }}
            </button>
          </div>
        </div>
      </aside>
    </div>

    <!-- Mobile Sticky Cart Bar -->
    <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-3 z-30 flex items-center justify-between gap-3 shadow-lg">
      <div>
        <p class="text-[11px] text-stone-500">{{ cart.items.length }} menu dipilih</p>
        <p class="text-sm font-semibold font-mono text-stone-900">{{ formatRupiah(cart.total) }}</p>
      </div>
      <button
        type="button"
        @click="isCartOpenMobile = true"
        :disabled="cart.items.length === 0"
        class="h-10 px-5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-md disabled:opacity-40"
      >
        Lihat Pesanan & Bayar
      </button>
    </div>

    <!-- Mobile Drawer Modal -->
    <div
      v-if="isCartOpenMobile"
      class="lg:hidden fixed inset-0 z-40 bg-stone-900/40 flex flex-col justify-end"
      @click.self="isCartOpenMobile = false"
    >
      <div class="bg-white rounded-t-xl p-4 max-h-[85vh] flex flex-col">
        <div class="flex items-center justify-between pb-3 border-b border-stone-200">
          <div>
            <h2 class="text-sm font-semibold text-stone-900">Rincian Pembayaran</h2>
            <p class="text-xs text-stone-500">{{ cart.items.length }} menu di keranjang</p>
          </div>
          <button
            type="button"
            @click="isCartOpenMobile = false"
            class="text-xs font-medium text-stone-500 hover:text-stone-900 p-1"
          >
            Tutup
          </button>
        </div>

        <div class="divide-y divide-stone-100 my-3 overflow-y-auto flex-1">
          <div
            v-for="i in cart.items"
            :key="i.product.id"
            class="py-2.5 flex items-center justify-between gap-2"
          >
            <div class="min-w-0 flex-1">
              <p class="text-xs font-medium text-stone-800 truncate">{{ i.product.name }}</p>
              <p class="text-[11px] text-stone-500 font-mono">{{ formatRupiah(i.product.price) }} × {{ i.qty }}</p>
            </div>
            <div class="flex items-center gap-1.5">
              <button
                @click="cart.decrementQty(i.product.id)"
                type="button"
                class="w-7 h-7 rounded border border-stone-300 text-stone-700 font-bold text-xs"
              >
                -
              </button>
              <span class="w-6 text-center text-xs font-semibold font-mono">{{ i.qty }}</span>
              <button
                @click="cart.incrementQty(i.product.id)"
                type="button"
                :disabled="i.qty >= i.product.stock"
                class="w-7 h-7 rounded border border-stone-300 text-stone-700 font-bold text-xs disabled:opacity-30"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-stone-200 space-y-3">
          <div class="flex justify-between items-baseline">
            <span class="text-xs text-stone-500 font-medium">Total Tagihan</span>
            <span class="text-base font-semibold font-mono text-stone-900">{{ formatRupiah(cart.total) }}</span>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              @click="paymentMethod = 'cash'"
              :class="paymentMethod === 'cash' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700'"
              class="h-10 rounded text-xs font-semibold"
            >
              Cash
            </button>
            <button
              type="button"
              @click="paymentMethod = 'qris'"
              :class="paymentMethod === 'qris' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700'"
              class="h-10 rounded text-xs font-semibold"
            >
              QRIS
            </button>
          </div>

          <button
            type="button"
            @click="openConfirmation"
            :disabled="cart.items.length === 0 || processing"
            class="w-full h-12 bg-amber-700 text-white font-medium text-sm rounded-md disabled:opacity-40"
          >
            {{ processing ? 'Memproses transaksi...' : `Konfirmasi Bayar (${formatRupiah(cart.total)})` }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Konfirmasi Checkout -->
    <div
      v-if="showConfirmModal"
      class="fixed inset-0 z-50 bg-stone-900/50 flex items-center justify-center p-4"
      @click.self="showConfirmModal = false"
    >
      <div class="bg-white border border-stone-200 rounded-lg p-5 sm:p-6 max-w-md w-full shadow-xl">
        <h3 class="text-base font-semibold text-stone-900 mb-1">Konfirmasi Pembayaran</h3>
        <p class="text-xs text-stone-500 mb-4">Pastikan rincian pesanan dan metode bayar sudah sesuai sebelum diproses ke server.</p>

        <div class="bg-stone-50 border border-stone-200 rounded-md p-3 mb-4 space-y-2 max-h-48 overflow-y-auto">
          <div
            v-for="i in cart.items"
            :key="i.product.id"
            class="flex items-center justify-between text-xs"
          >
            <span class="text-stone-800 font-medium truncate pr-2">{{ i.qty }}x {{ i.product.name }}</span>
            <span class="text-stone-600 font-mono whitespace-nowrap">{{ formatRupiah(i.product.price * i.qty) }}</span>
          </div>
        </div>

        <div class="border-t border-stone-200 pt-3 mb-5 space-y-1.5 text-xs">
          <div class="flex justify-between text-stone-600">
            <span>Metode Bayar</span>
            <span class="uppercase font-semibold text-stone-900 font-mono">{{ paymentMethod }}</span>
          </div>
          <div class="flex justify-between text-stone-900 font-semibold text-sm">
            <span>Total Tagihan</span>
            <span class="font-mono text-base text-amber-900">{{ formatRupiah(cart.total) }}</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="showConfirmModal = false"
            class="flex-1 h-10 border border-stone-300 text-stone-700 hover:bg-stone-50 rounded-md text-xs font-medium transition-colors"
          >
            Kembali
          </button>
          <button
            type="button"
            @click="proceedCheckout"
            :disabled="processing"
            class="flex-1 h-10 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-xs font-semibold transition-colors disabled:opacity-40"
          >
            {{ processing ? 'Memproses...' : 'Selesaikan Transaksi' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
