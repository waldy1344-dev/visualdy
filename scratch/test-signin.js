const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yepxaexatxpucjxmptvb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllcHhhZXhhdHhwdWNqeG1wdHZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MDc3NDEsImV4cCI6MjA5MTk4Mzc0MX0.fElqOnPQcXPoTHXUZHorPwakom5w__5Ydly68yJ9h5U';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSignin() {
  const username = 'admin';
  const email = `vd.${username}@gmail.com`;
  const password = 'password123';

  console.log(`Attempting sign-in for: ${email}`);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log('Sign-in status: FAILED');
    console.log('Error message:', error.message);
  } else {
    console.log('Sign-in status: SUCCESS');
    console.log('User ID:', data.user.id);
    console.log('User Email:', data.user.email);
    console.log('Confirmed At:', data.user.email_confirmed_at);
  }
}

testSignin();
