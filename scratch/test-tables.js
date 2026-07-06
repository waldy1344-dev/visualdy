const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yepxaexatxpucjxmptvb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllcHhhZXhhdHhwdWNqeG1wdHZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MDc3NDEsImV4cCI6MjA5MTk4Mzc0MX0.fElqOnPQcXPoTHXUZHorPwakom5w__5Ydly68yJ9h5U';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
  const tables = ['admin', 'admins', 'users', 'settings', 'profiles'];
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.log(`Table '${table}' error:`, error.message);
      } else {
        console.log(`Table '${table}' exists. Columns:`, data.length > 0 ? Object.keys(data[0]) : 'empty');
      }
    } catch (e) {
      console.log(`Table '${table}' exception:`, e.message);
    }
  }
}

checkTables();
