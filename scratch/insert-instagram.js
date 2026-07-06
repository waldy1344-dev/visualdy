const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yepxaexatxpucjxmptvb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllcHhhZXhhdHhwdWNqeG1wdHZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MDc3NDEsImV4cCI6MjA5MTk4Mzc0MX0.fElqOnPQcXPoTHXUZHorPwakom5w__5Ydly68yJ9h5U';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function insertInstagram() {
  // Login first to bypass RLS
  console.log('Authenticating as admin...');
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email: 'vd.admin@gmail.com',
    password: 'password123'
  });

  if (loginError) {
    console.error('Authentication failed:', loginError.message);
    return;
  }
  console.log('Authentication successful!');

  const payload = {
    platform: 'Instagram',
    url: 'https://www.instagram.com/visualdy_?igsh=eDBxdno1eXJpMjls'
  };

  console.log('Inserting/Upserting Instagram link into database...');
  const { data, error } = await supabase
    .from('social_links')
    .upsert(payload, { onConflict: 'platform' })
    .select();

  if (error) {
    console.error('Error inserting Instagram:', error.message);
  } else {
    console.log('Success! Inserted data:', JSON.stringify(data));
  }
}

insertInstagram();
