const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yepxaexatxpucjxmptvb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllcHhhZXhhdHhwdWNqeG1wdHZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MDc3NDEsImV4cCI6MjA5MTk4Mzc0MX0.fElqOnPQcXPoTHXUZHorPwakom5w__5Ydly68yJ9h5U';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSelect() {
  try {
    const { data, error } = await supabase.from('portfolio').select('*');
    if (error) {
      console.log('Error fetching portfolio:', error.message || error);
    } else {
      console.log('Portfolio data:', JSON.stringify(data));
    }
  } catch(e) {
      console.log('Exception portfolio', e.message);
  }

  try {
    const { data: tData, error: tError } = await supabase.from('testimonials').select('*');
    if (tError) {
      console.log('Error fetching testimonials:', tError.message || tError);
    } else {
      console.log('Testimonials data:', JSON.stringify(tData));
    }
  } catch(e) {
      console.log('Exception testimonials', e.message);
  }
}

testSelect();
