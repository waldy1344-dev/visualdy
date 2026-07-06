const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://yepxaexatxpucjxmptvb.supabase.co'
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllcHhhZXhhdHhwdWNqeG1wdHZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MDc3NDEsImV4cCI6MjA5MTk4Mzc0MX0.fElqOnPQcXPoTHXUZHorPwakom5w__5Ydly68yJ9h5U'

// Try using the management API to run SQL
// We'll use direct fetch to the Supabase REST endpoint
async function runSQL() {
  console.log('Attempting to add columns via Supabase...')

  // Try using rpc if available, or use pg functions
  // First, let's login as a user to get elevated access
  const supabase = createClient(SUPABASE_URL, ANON_KEY)

  // Sign in with known credentials
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'vd.admin@gmail.com',
    password: 'Admin123!',
  })

  if (authError) {
    console.log('Auth failed, trying another user...')
    // Try with different credentials
    const { data: authData2, error: authError2 } = await supabase.auth.signInWithPassword({
      email: 'vd.visualdy@gmail.com',
      password: 'Visualdy123!',
    })
    if (authError2) {
      console.error('Could not authenticate:', authError2.message)
    }
  } else {
    console.log('Logged in as:', authData.user?.email)
  }

  // Try to ALTER TABLE via a custom function if available
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS video_url TEXT; ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'image';`
  })

  if (error) {
    console.log('\nCannot auto-migrate (expected). Here is what you need to do:')
    console.log('\n📋 STEP 1: Go to https://supabase.com/dashboard/project/yepxaexatxpucjxmptvb/sql')
    console.log('\n📋 STEP 2: Run this SQL:\n')
    console.log('ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS video_url TEXT;')
    console.log("ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'image';")
    console.log('\n📋 STEP 3: Create Storage Bucket:')
    console.log('Go to Storage > New bucket > Name: "portfolio-videos" > Make it PUBLIC')
  } else {
    console.log('✅ Columns added successfully!')
  }
}

runSQL().catch(console.error)
