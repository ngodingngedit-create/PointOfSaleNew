import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { getCashiers } from '../api/cashiers.js'
import { verifyCashierPin } from '../api/login-pin.js'
import { processCheckout } from '../api/checkout.js'

async function runTests() {
  console.log('--- Memulai Test Suite Checkout & Auth PIN Kasir Sanity ---')

  // 1. Test Endpoint GET Cashiers
  console.log('Uji 1: Verifikasi daftar kasir (tidak boleh mengekspos field pin)...')
  {
    const cashiers = await getCashiers({})
    assert.ok(Array.isArray(cashiers), 'Harus berupa array')
    assert.ok(cashiers.length > 0, 'Daftar kasir tidak boleh kosong')
    for (const c of cashiers) {
      assert.equal(c.pin, undefined, `KRITIS: Field pin bocor pada kasir ${c.name}`)
      assert.ok(c.id, 'Harus memiliki id')
      assert.ok(c.name, 'Harus memiliki nama')
    }
    console.log(`   OK: ${cashiers.length} profil kasir terambil tanpa field PIN.`)
  }

  // 2. Test Verifikasi PIN Valid
  console.log('Uji 2: Verifikasi PIN kasir benar (default: 1234)...')
  {
    const res = await verifyCashierPin({ cashierId: 'cashier-default-1', pin: '1234' }, {})
    assert.equal(res.success, true)
    assert.ok(res.token.startsWith('session-'))
    assert.equal(res.cashier.name, 'Kasir Utama')
    console.log('   OK: Login PIN kasir berhasil menghasilkan session token.')
  }

  // 3. Test Verifikasi PIN Salah
  console.log('Uji 3: Penolakan PIN kasir salah...')
  {
    let caught = null
    try {
      await verifyCashierPin({ cashierId: 'cashier-default-1', pin: '9999' }, {})
    } catch (e) {
      caught = e
    }
    assert.ok(caught !== null, 'Harus melempar error')
    assert.equal(caught.statusCode, 401)
    console.log('   OK: PIN salah ditolak dengan status 401.')
  }

  // 4. Test Audit Bundle Browser
  console.log('Uji 4: Audit bundle build dist/ bebas token SANITY_API_TOKEN...')
  {
    const distAssetsDir = path.resolve(process.cwd(), 'dist/assets')
    if (fs.existsSync(distAssetsDir)) {
      const files = fs.readdirSync(distAssetsDir)
      for (const f of files) {
        const content = fs.readFileSync(path.join(distAssetsDir, f), 'utf-8')
        assert.ok(
          !content.includes('SANITY_API_TOKEN'),
          `Kritis: Ditemukan keyword token rahasia pada asset file ${f}`
        )
      }
      console.log('   OK: Seluruh file dist bundle terverifikasi bebas dari token rahasia.')
    }
  }

  console.log('--- Seluruh Pengujian Mandiri Sukses (PASS) ---')
}

runTests().catch((err) => {
  console.error('Test gagal:', err)
  process.exit(1)
})
