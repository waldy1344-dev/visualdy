const { createClient } = require('@supabase/supabase-js')
const readline = require('readline')

const SUPABASE_URL = 'https://yepxaexatxpucjxmptvb.supabase.co'
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllcHhhZXhhdHhwdWNqeG1wdHZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MDc3NDEsImV4cCI6MjA5MTk4Mzc0MX0.fElqOnPQcXPoTHXUZHorPwakom5w__5Ydly68yJ9h5U'

const supabase = createClient(SUPABASE_URL, ANON_KEY)

const dummyData = [
  // ── LOGO ──────────────────────────────────────
  {
    title: 'Logo Kopi Nusantara',
    description: 'Desain logo modern untuk brand kopi lokal dengan nuansa earthy tone yang hangat dan elegan.',
    image_url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=85',
    category: 'Logo',
    media_type: 'image',
    video_url: null,
  },
  {
    title: 'Logo Startup Fintech',
    description: 'Identitas visual minimalis dan tegas untuk perusahaan teknologi keuangan masa depan.',
    image_url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=85',
    category: 'Logo',
    media_type: 'image',
    video_url: null,
  },
  {
    title: 'Logo Studio Kreatif',
    description: 'Branding visual unik berbasis geometri untuk studio desain dan kreatif.',
    image_url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=85',
    category: 'Logo',
    media_type: 'image',
    video_url: null,
  },

  // ── POSTER ────────────────────────────────────
  {
    title: 'Poster Festival Musik',
    description: 'Desain poster dinamis bertema neon untuk event festival musik tahunan di Jakarta.',
    image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=85',
    category: 'Poster',
    media_type: 'image',
    video_url: null,
  },
  {
    title: 'Poster Pameran Seni',
    description: 'Visual artistik dan kontemporer untuk pameran seni rupa Indonesia 2024.',
    image_url: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&q=85',
    category: 'Poster',
    media_type: 'image',
    video_url: null,
  },
  {
    title: 'Poster Film Pendek',
    description: 'Poster sinematik dramatik untuk film pendek kompetisi nasional.',
    image_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=85',
    category: 'Poster',
    media_type: 'image',
    video_url: null,
  },

  // ── BANNER ────────────────────────────────────
  {
    title: 'Banner Promo Ramadhan',
    description: 'Banner promosi elegan bertema Ramadhan untuk campaign e-commerce fashion muslim.',
    image_url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=85',
    category: 'Banner',
    media_type: 'image',
    video_url: null,
  },
  {
    title: 'Banner Digital Agency',
    description: 'Banner web modern dan profesional untuk landing page digital marketing agency.',
    image_url: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=85',
    category: 'Banner',
    media_type: 'image',
    video_url: null,
  },
  {
    title: 'Banner Peluncuran Produk',
    description: 'Banner eksklusif untuk event peluncuran produk smartphone flagship terbaru.',
    image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=85',
    category: 'Banner',
    media_type: 'image',
    video_url: null,
  },

  // ── VISUAL JOCKEY ─────────────────────────────
  {
    title: 'VJ Night Club Visualizer',
    description: 'Loop visual abstrak energetik untuk pertunjukan DJ malam di club premium.',
    image_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=85',
    category: 'Visual Jockey',
    media_type: 'video',
    video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    title: 'VJ Festival Elektronik',
    description: 'Visualisasi musikal futuristik untuk festival musik elektronik outdoor berskala besar.',
    image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=85',
    category: 'Visual Jockey',
    media_type: 'video',
    video_url: 'https://www.w3schools.com/html/movie.mp4',
  },
]

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const ask = (q) => new Promise(resolve => rl.question(q, resolve))

async function seedPortfolio() {
  console.log('╔══════════════════════════════════════╗')
  console.log('║   Seed Portfolio - Visualdy Admin    ║')
  console.log('╚══════════════════════════════════════╝\n')

  // Coba berbagai username admin yang mungkin sudah terdaftar
  const adminEmails = [
    'vd.admin@gmail.com',
    'vd.visualdy@gmail.com',
    'vd.aldyy@gmail.com',
  ]

  let loggedIn = false

  for (const email of adminEmails) {
    console.log(`🔑 Mencoba login sebagai ${email}...`)
    const passwords = ['Admin123!', 'Visualdy123!', 'admin123', 'visualdy123']
    
    for (const password of passwords) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (!error && data.user) {
        console.log(`✅ Login berhasil sebagai: ${email}\n`)
        loggedIn = true
        break
      }
    }
    if (loggedIn) break
  }

  if (!loggedIn) {
    console.log('⚠️  Auto-login gagal. Masukkan kredensial admin Anda:\n')
    const username = await ask('Username (tanpa vd.): ')
    const password = await ask('Password: ')
    rl.close()

    const email = `vd.${username.toLowerCase().trim()}@gmail.com`
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error('\n❌ Login gagal:', error.message)
      console.log('\nAlternatif: Jalankan SQL ini langsung di Supabase SQL Editor:')
      printSQL()
      return
    }
    console.log(`\n✅ Login berhasil sebagai: ${email}\n`)
  } else {
    rl.close()
  }

  // Cek apakah kolom video_url & media_type sudah ada
  const { data: sample } = await supabase.from('portfolio').select('*').limit(1)
  const cols = sample && sample[0] ? Object.keys(sample[0]) : []
  const hasVideo = cols.includes('video_url')
  const hasMediaType = cols.includes('media_type')

  if (!hasVideo || !hasMediaType) {
    console.log('⚠️  Kolom video_url / media_type belum ada di tabel.')
    console.log('   Data VJ akan diinsert tanpa field video.\n')
  }

  console.log('🌱 Mulai insert data...\n')
  let ok = 0, fail = 0

  for (const item of dummyData) {
    const payload = { ...item }
    if (!hasVideo) delete payload.video_url
    if (!hasMediaType) delete payload.media_type

    const { error } = await supabase.from('portfolio').insert(payload)

    if (error) {
      console.log(`❌ ${item.title}: ${error.message}`)
      fail++
    } else {
      console.log(`✅ ${item.category.padEnd(15)} → ${item.title}`)
      ok++
    }
  }

  console.log('\n══════════════════════════════════')
  console.log(`✅ Berhasil : ${ok} item`)
  console.log(`❌ Gagal    : ${fail} item`)
  console.log(`📦 Total   : ${dummyData.length} item`)
  if (ok > 0) {
    console.log('\n🎉 Selesai! Buka http://localhost:3000/portfolio')
  }
}

function printSQL() {
  console.log('\n── SQL untuk insert manual ──\n')
  for (const item of dummyData) {
    console.log(`INSERT INTO portfolio (title, description, image_url, category) VALUES ('${item.title}', '${item.description}', '${item.image_url}', '${item.category}');`)
  }
}

seedPortfolio().catch(err => {
  console.error('Error:', err.message)
  rl.close()
})
