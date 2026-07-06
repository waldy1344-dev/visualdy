const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yepxaexatxpucjxmptvb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllcHhhZXhhdHhwdWNqeG1wdHZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MDc3NDEsImV4cCI6MjA5MTk4Mzc0MX0.fElqOnPQcXPoTHXUZHorPwakom5w__5Ydly68yJ9h5U';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSocials() {
  const { data, error } = await supabase.from('social_links').select('*');
  if (error) {
    console.error('Error fetching socials:', error.message);
  } else {
    console.log('Social links in database:', JSON.stringify(data));
  }
}

checkSocials();
