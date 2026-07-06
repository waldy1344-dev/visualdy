const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://yepxaexatxpucjxmptvb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllcHhhZXhhdHhwdWNqeG1wdHZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MDc3NDEsImV4cCI6MjA5MTk4Mzc0MX0.fElqOnPQcXPoTHXUZHorPwakom5w__5Ydly68yJ9h5U'
)

// Judul data baru yang baru diinsert (yang mau dipertahankan)
const NEW_TITLES = [
  'Logo Kopi Nusantara',
  'Logo Startup Fintech',
  'Logo Studio Kreatif',
  'Poster Festival Musik',
  'Poster Pameran Seni',
  'Poster Film Pendek',
  'Banner Promo Ramadhan',
  'Banner Digital Agency',
  'Banner Peluncuran Produk',
  'VJ Night Club Visualizer',
  'VJ Festival Elektronik',
]

async function cleanOldPortfolios() {
  // Login dulu
  const { error: authErr } = await supabase.auth.signInWithPassword({
    email: 'vd.admin@gmail.com',
    password: 'password123',
  })
  if (authErr) {
    console.error('❌ Login gagal:', authErr.message)
    return
  }
  console.log('✅ Login berhasil\n')

  // Ambil semua data
  const { data: all, error } = await supabase
    .from('portfolio')
    .select('id, title, category, created_at')
    .order('created_at', { ascending: true })

  if (error) { console.error('❌ Gagal ambil data:', error.message); return }

  console.log(`📦 Total data di Supabase: ${all.length} item\n`)

  // Pisahkan: data lama vs data baru
  const oldItems = all.filter(p => !NEW_TITLES.includes(p.title))
  const newItems = all.filter(p => NEW_TITLES.includes(p.title))

  console.log(`🆕 Data baru (dipertahankan): ${newItems.length} item`)
  newItems.forEach(p => console.log(`   ✓ [${p.category}] ${p.title}`))

  console.log(`\n🗑️  Data lama (akan dihapus): ${oldItems.length} item`)
  oldItems.forEach(p => console.log(`   × [${p.category || '-'}] ${p.title} (${p.created_at?.slice(0,10)})`))

  if (oldItems.length === 0) {
    console.log('\n✅ Tidak ada data lama. Semua data sudah terbaru!')
    return
  }

  // Hapus data lama
  console.log('\n🚀 Menghapus data lama...')
  const oldIds = oldItems.map(p => p.id)

  const { error: delErr } = await supabase
    .from('portfolio')
    .delete()
    .in('id', oldIds)

  if (delErr) {
    console.error('❌ Gagal hapus:', delErr.message)
  } else {
    console.log(`\n✅ ${oldItems.length} data lama berhasil dihapus!`)
    console.log(`📦 Sisa data: ${newItems.length} item (semua data baru)`)
  }
}

cleanOldPortfolios().catch(console.error)
