<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const cashiers = ref([])
const selectedCashier = ref(null)
const pin = ref('')
const error = ref('')
const loading = ref(false)
const fetchingCashiers = ref(true)

async function loadCashiers() {
  fetchingCashiers.value = true
  error.value = ''
  try {
    const list = await auth.fetchCashiers()
    cashiers.value = Array.isArray(list) ? list : []
    if (cashiers.value.length > 0) selectedCashier.value = cashiers.value[0]
  } catch (e) {
    error.value = e.message || 'Tidak dapat memuat profil kasir.'
  } finally {
    fetchingCashiers.value = false
  }
}

function selectCashier(cashier) {
  selectedCashier.value = cashier
  pin.value = ''
  error.value = ''
}

function appendPin(digit) {
  if (!loading.value && pin.value.length < 4 && /^\d$/.test(String(digit))) {
    pin.value += String(digit)
    error.value = ''
  }
}

function backspacePin() {
  pin.value = pin.value.slice(0, -1)
  error.value = ''
}

function clearPin() {
  pin.value = ''
  error.value = ''
}

async function submitPin() {
  if (!selectedCashier.value) {
    error.value = 'Pilih profil kasir terlebih dahulu.'
    return
  }
  if (!/^\d{4}$/.test(pin.value)) {
    error.value = 'Masukkan PIN 4 digit untuk melanjutkan.'
    return
  }

  loading.value = true
  error.value = ''
  try {
    await auth.loginWithPin(selectedCashier.value.id, pin.value)
    pin.value = ''
    await router.replace('/')
  } catch (e) {
    error.value = e.message || 'PIN tidak valid.'
    pin.value = ''
  } finally {
    loading.value = false
  }
}

function handleKeyDown(event) {
  if (loading.value) return
  if (/^[0-9]$/.test(event.key)) appendPin(event.key)
  else if (event.key === 'Backspace') backspacePin()
  else if (event.key === 'Escape') clearPin()
  else if (event.key === 'Enter') submitPin()
}

onMounted(() => {
  loadCashiers()
  window.addEventListener('keydown', handleKeyDown)
})
onUnmounted(() => window.removeEventListener('keydown', handleKeyDown))
</script>

<template>
  <main class="cashier-login">
    <div class="login-glow login-glow--top" aria-hidden="true"></div>
    <div class="login-glow login-glow--bottom" aria-hidden="true"></div>

    <section class="login-card" aria-labelledby="login-title">
      <header class="login-header">
        <div class="brand-lockup">
          <span class="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5 7.5h14M7 4.5h10a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M8 12h.01M12 12h.01M16 12h.01M8 15.5h.01M12 15.5h.01M16 15.5h.01" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
            </svg>
          </span>
          <span class="brand-copy">
            <span class="brand-name">POS <span>KAFE</span></span>
            <span class="brand-caption">AKSES KASIR</span>
          </span>
        </div>
        <span class="secure-badge">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 1.8 13 4v3.4c0 3.1-2.1 5.5-5 6.8-2.9-1.3-5-3.7-5-6.8V4l5-2.2Z" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round"/><path d="m5.9 7.8 1.4 1.4 2.9-3" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/></svg>
          AMAN
        </span>
      </header>

      <div class="welcome-copy">
        <p class="eyebrow">SIAP MEMULAI SHIFT?</p>
        <h1 id="login-title">Selamat datang kembali.</h1>
        <p class="welcome-description">Pilih profil kasir, lalu masukkan PIN 4 digit Anda.</p>
      </div>

      <section class="cashier-section" aria-labelledby="cashier-label">
        <div class="section-heading">
          <h2 id="cashier-label">Profil kasir</h2>
          <span v-if="!fetchingCashiers && cashiers.length" class="profile-count">{{ cashiers.length }} profil</span>
        </div>

        <div v-if="fetchingCashiers" class="profile-state" role="status">
          <span class="loading-spinner" aria-hidden="true"></span>
          Memuat profil kasir…
        </div>
        <div v-else-if="cashiers.length === 0" class="profile-state profile-state--empty">
          Tidak ada profil kasir aktif.
        </div>
        <div v-else class="cashier-grid">
          <button
            v-for="cashier in cashiers"
            :key="cashier.id"
            type="button"
            class="cashier-option"
            :class="{ 'cashier-option--selected': selectedCashier?.id === cashier.id }"
            :aria-pressed="selectedCashier?.id === cashier.id"
            @click="selectCashier(cashier)"
          >
            <span class="cashier-avatar">{{ cashier.avatar || cashier.name.slice(0, 2).toUpperCase() }}</span>
            <span class="cashier-details">
              <span class="cashier-name">{{ cashier.name }}</span>
              <span class="cashier-role">{{ cashier.role }}</span>
            </span>
            <span class="selection-indicator" aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="none"><path d="m3.5 8.2 2.8 2.7 6.2-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </span>
          </button>
        </div>
      </section>

      <section class="pin-section" aria-label="Entri PIN">
        <div class="pin-card">
          <div class="pin-card-heading">
            <div>
              <p class="pin-label">PIN 4 DIGIT ANDA</p>
              <p class="pin-selected">Masuk sebagai <strong>{{ selectedCashier?.name || '—' }}</strong></p>
            </div>
            <span class="pin-lock" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="none"><rect x="3.4" y="8.4" width="13.2" height="9" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M6.4 8.4V6a3.6 3.6 0 0 1 7.2 0v2.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M10 12v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </span>
          </div>
          <div
            class="pin-indicators"
            role="img"
            :aria-label="`${pin.length} dari 4 digit PIN dimasukkan`"
          >
            <span v-for="idx in 4" :key="idx" class="pin-indicator" :class="{ 'pin-indicator--filled': pin.length >= idx }"></span>
          </div>
          <p class="keyboard-hint">Gunakan keypad atau ketik angka di keyboard</p>
        </div>

        <p v-if="error" class="login-error" role="alert">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6.2" stroke="currentColor" stroke-width="1.4"/><path d="M8 4.8v3.7M8 11.2h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          {{ error }}
        </p>

        <div class="keypad" aria-label="Keypad PIN">
          <button v-for="digit in [1, 2, 3, 4, 5, 6, 7, 8, 9]" :key="digit" type="button" class="keypad-key" :disabled="loading || pin.length >= 4" :aria-label="`Masukkan ${digit}`" @click="appendPin(digit)">{{ digit }}</button>
          <button type="button" class="keypad-key keypad-key--utility" :disabled="loading || pin.length === 0" aria-label="Hapus PIN" @click="clearPin">
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M7 5.2h8.4v9.6H7L3.8 10 7 5.2Z" stroke="currentColor" stroke-width="1.45" stroke-linejoin="round"/><path d="m9 8 4 4m0-4-4 4" stroke="currentColor" stroke-width="1.45" stroke-linecap="round"/></svg>
            <span>Hapus</span>
          </button>
          <button type="button" class="keypad-key" :disabled="loading || pin.length >= 4" aria-label="Masukkan 0" @click="appendPin(0)">0</button>
          <button type="button" class="keypad-key keypad-key--utility" :disabled="loading || pin.length === 0" aria-label="Hapus angka terakhir" @click="backspacePin">
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M7 5.2h8.4v9.6H7L3.8 10 7 5.2Z" stroke="currentColor" stroke-width="1.45" stroke-linejoin="round"/><path d="m9.5 8.2 3 3.6m0-3.6-3 3.6" stroke="currentColor" stroke-width="1.45" stroke-linecap="round"/></svg>
            <span>Koreksi</span>
          </button>
        </div>

        <button type="button" class="sign-in-button" :disabled="loading || pin.length !== 4 || !selectedCashier" @click="submitPin">
          <span>{{ loading ? 'Memverifikasi PIN…' : 'Masuk ke POS' }}</span>
          <svg v-if="!loading" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span v-else class="loading-spinner loading-spinner--light" aria-hidden="true"></span>
        </button>
      </section>

      <footer class="login-footer">
        <p>PIN belum diatur? Minta administrator untuk mengaturnya.</p>
        <RouterLink to="/admin/login" class="admin-link">Akses administrator <span aria-hidden="true">↗</span></RouterLink>
      </footer>
    </section>

    <p class="page-footnote">Akses masuk kasir POS yang aman</p>
  </main>
</template>

<style scoped>
.cashier-login {
  --ink: #1f1b17;
  --muted: #766b64;
  --line: #eae1da;
  --accent: #904d00;
  --accent-deep: #763300;
  position: relative;
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 36px 20px 58px;
  background: #fff8f5;
  color: var(--ink);
}

.login-glow {
  position: absolute;
  width: 410px;
  height: 410px;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(1px);
}

.login-glow--top {
  top: -275px;
  right: -150px;
  background: radial-gradient(circle, rgba(255, 220, 195, 0.52), rgba(255, 220, 195, 0));
}

.login-glow--bottom {
  bottom: -315px;
  left: -170px;
  background: radial-gradient(circle, rgba(226, 216, 210, 0.48), rgba(226, 216, 210, 0));
}

.login-card {
  position: relative;
  z-index: 1;
  width: min(100%, 440px);
  padding: 28px 30px 24px;
  border: 1px solid rgba(208, 196, 190, 0.72);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 22px 70px rgba(53, 38, 26, 0.09), 0 3px 10px rgba(53, 38, 26, 0.035);
}

.login-header,
.brand-lockup,
.section-heading,
.pin-card-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-lockup {
  justify-content: flex-start;
  gap: 11px;
}

.brand-mark {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 13px;
  background: #1c1917;
  color: #ffb77d;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
}

.brand-mark svg {
  width: 23px;
  height: 23px;
}

.brand-copy {
  display: grid;
  gap: 3px;
}

.brand-name {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.1em;
}

.brand-name span {
  color: #7d8982;
  font-weight: 600;
}

.brand-caption,
.eyebrow,
.pin-label {
  font-size: 9px;
  font-weight: 750;
  letter-spacing: 0.16em;
}

.brand-caption {
  color: #8c7e74;
}

.secure-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 8px;
  border: 1px solid #f0e6e0;
  border-radius: 999px;
  background: #fffaf7;
  color: #904d00;
  font-size: 9px;
  font-weight: 750;
  letter-spacing: 0.08em;
}

.secure-badge svg {
  width: 13px;
  height: 13px;
}

.welcome-copy {
  margin: 30px 0 24px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #904d00;
}

.welcome-copy h1 {
  margin: 0;
  color: #1f1b17;
  font-size: 27px;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 1.15;
}

.welcome-description {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.55;
}

.cashier-section {
  margin-bottom: 17px;
}

.section-heading {
  margin-bottom: 9px;
}

.section-heading h2 {
  margin: 0;
  color: #333e38;
  font-size: 11px;
  font-weight: 700;
}

.profile-count {
  color: #99a29c;
  font-size: 10px;
}

.cashier-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  max-height: 140px;
  overflow: auto;
  padding: 1px;
}

.cashier-option {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 9px;
  padding: 9px 9px;
  border: 1px solid #eae1da;
  border-radius: 12px;
  background: #fff;
  color: #4d4540;
  text-align: left;
  cursor: pointer;
  transition: border-color 140ms ease, background 140ms ease, box-shadow 140ms ease;
}

.cashier-option:hover {
  border-color: #d0b7a2;
  background: #fffaf7;
}

.cashier-option--selected {
  border-color: #c98646;
  background: #fff8f0;
  box-shadow: inset 0 0 0 1px rgba(144, 77, 0, 0.08);
}

.cashier-avatar {
  display: grid;
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  place-items: center;
  border-radius: 10px;
  background: #f0e6e0;
  color: #6e5a4b;
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.03em;
}

.cashier-option--selected .cashier-avatar {
  background: #ffdcc3;
  color: var(--accent-deep);
}

.cashier-details {
  display: grid;
  min-width: 0;
  flex: 1;
  gap: 3px;
}

.cashier-name {
  overflow: hidden;
  color: #2c2520;
  font-size: 11px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cashier-role {
  overflow: hidden;
  color: #897d74;
  font-size: 9px;
  text-overflow: ellipsis;
  text-transform: capitalize;
  white-space: nowrap;
}

.selection-indicator {
  display: grid;
  width: 16px;
  height: 16px;
  flex: 0 0 16px;
  place-items: center;
  border: 1px solid #ded3cc;
  border-radius: 50%;
  color: transparent;
}

.selection-indicator svg {
  width: 10px;
  height: 10px;
}

.cashier-option--selected .selection-indicator {
  border-color: var(--accent);
  background: var(--accent);
  color: #fff;
}

.profile-state {
  display: flex;
  min-height: 56px;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: 1px dashed #ded3cc;
  border-radius: 12px;
  color: #897d74;
  font-size: 11px;
}

.profile-state--empty {
  padding: 10px;
  text-align: center;
}

.pin-card {
  padding: 14px 15px 12px;
  border: 1px solid #f0e6e0;
  border-radius: 14px;
  background: #fcf2eb;
}

.pin-card-heading {
  align-items: flex-start;
}

.pin-label {
  margin: 0;
  color: #7b6250;
  font-size: 9px;
}

.pin-selected {
  margin: 5px 0 0;
  color: #8e8178;
  font-size: 10px;
}

.pin-selected strong {
  color: #4d4035;
  font-weight: 700;
}

.pin-lock {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border: 1px solid #f0e6e0;
  border-radius: 10px;
  background: #fff;
  color: #904d00;
}

.pin-lock svg {
  width: 17px;
  height: 17px;
}

.pin-indicators {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 15px 0 8px;
}

.pin-indicator {
  width: 11px;
  height: 11px;
  border: 1.5px solid #d7c9bf;
  border-radius: 50%;
  background: #fff;
  transition: transform 130ms ease, border-color 130ms ease, background 130ms ease;
}

.pin-indicator--filled {
  transform: scale(1.06);
  border-color: var(--accent);
  background: var(--accent);
}

.keyboard-hint {
  margin: 0;
  color: #93877f;
  font-size: 9px;
  text-align: center;
}

.login-error {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 10px 0 0;
  padding: 9px 10px;
  border: 1px solid #f0d6d1;
  border-radius: 10px;
  background: #fff7f5;
  color: #a74739;
  font-size: 10px;
  line-height: 1.4;
}

.login-error svg {
  width: 15px;
  height: 15px;
  flex: 0 0 15px;
}

.keypad {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 12px;
}

.keypad-key {
  display: flex;
  min-height: 47px;
  align-items: center;
  justify-content: center;
  border: 1px solid #eae1da;
  border-radius: 11px;
  background: #fff;
  color: #2c2520;
  font-size: 18px;
  font-weight: 650;
  cursor: pointer;
  box-shadow: 0 1px 1px rgba(53, 38, 26, 0.025);
  transition: transform 100ms ease, border-color 130ms ease, background 130ms ease, box-shadow 130ms ease;
  -webkit-tap-highlight-color: transparent;
}

.keypad-key:hover:not(:disabled) {
  border-color: #d0b7a2;
  background: #fffaf7;
  box-shadow: 0 3px 9px rgba(53, 38, 26, 0.06);
}

.keypad-key:active:not(:disabled) {
  transform: scale(0.98);
  background: #fcf2eb;
}

.keypad-key:disabled {
  cursor: not-allowed;
  opacity: 0.46;
}

.keypad-key--utility {
  flex-direction: column;
  gap: 1px;
  color: #7e7167;
  font-size: 9px;
  font-weight: 600;
}

.keypad-key--utility svg {
  width: 18px;
  height: 18px;
}

.sign-in-button {
  display: flex;
  width: 100%;
  min-height: 47px;
  align-items: center;
  justify-content: center;
  gap: 9px;
  margin-top: 11px;
  border: 0;
  border-radius: 11px;
  background: #1c1917;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background 130ms ease, box-shadow 130ms ease, transform 100ms ease;
}

.sign-in-button:hover:not(:disabled) {
  background: #342f2b;
  box-shadow: 0 5px 14px rgba(28, 25, 23, 0.18);
}

.sign-in-button:active:not(:disabled) {
  transform: translateY(1px);
}

.sign-in-button:disabled {
  background: #b8aea7;
  color: rgba(255, 255, 255, 0.88);
  cursor: not-allowed;
}

.sign-in-button svg {
  width: 17px;
  height: 17px;
}

.login-footer {
  margin-top: 17px;
  padding-top: 14px;
  border-top: 1px solid #f0e6e0;
  text-align: center;
}

.login-footer p {
  margin: 0 0 8px;
  color: #929b95;
  font-size: 9px;
}

.admin-link {
  color: #6e3900;
  font-size: 10px;
  font-weight: 700;
  text-decoration: none;
}

.admin-link:hover {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.page-footnote {
  position: absolute;
  bottom: 17px;
  left: 0;
  width: 100%;
  margin: 0;
  color: #a2978f;
  font-size: 9px;
  letter-spacing: 0.05em;
  text-align: center;
}

.loading-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid #eae1da;
  border-top-color: #904d00;
  border-radius: 50%;
  animation: spin 700ms linear infinite;
}

.loading-spinner--light {
  width: 15px;
  height: 15px;
  border-color: rgba(255, 255, 255, 0.38);
  border-top-color: #fff;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

button:focus-visible,
a:focus-visible {
  outline: 3px solid #904d00;
  outline-offset: 2px;
}

@media (max-width: 480px) {
  .cashier-login {
    align-items: flex-start;
    padding: 18px 14px 52px;
  }

  .login-card {
    margin: auto 0;
    padding: 22px 19px 19px;
    border-radius: 18px;
  }

  .welcome-copy {
    margin: 25px 0 21px;
  }

  .cashier-grid {
    grid-template-columns: 1fr;
    max-height: 124px;
  }

  .cashier-option {
    padding: 8px 9px;
  }

  .keypad-key {
    min-height: 45px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
