const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yepxaexatxpucjxmptvb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllcHhhZXhhdHhwdWNqeG1wdHZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MDc3NDEsImV4cCI6MjA5MTk4Mzc0MX0.fElqOnPQcXPoTHXUZHorPwakom5w__5Ydly68yJ9h5U';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  const portfolios = [
    {
      title: 'Modern E-Commerce Redesign',
      description: 'A complete redesign of an existing e-commerce platform focusing on user experience and conversion rates. Features include a streamlined checkout process and advanced product filtering.',
      image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop',
      category: 'Web Design'
    },
    {
      title: 'Fintech Mobile App',
      description: 'A sleek and secure mobile banking application that allows users to manage their finances, track expenses, and make instant transfers. Built with a focus on accessibility and security.',
      image_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2340&auto=format&fit=crop',
      category: 'App Development'
    },
    {
      title: 'Brand Identity for Eco-Startup',
      description: 'Comprehensive brand identity design for a sustainable packaging startup. Deliverables included logo design, color palette, typography guidelines, and marketing collateral.',
      image_url: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=2494&auto=format&fit=crop',
      category: 'Branding'
    },
    {
      title: 'Real Estate Dashboard',
      description: 'An intuitive admin dashboard for real estate agents to manage properties, leads, and client communications all in one place. Features real-time analytics and reporting.',
      image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2340&auto=format&fit=crop',
      category: 'UI/UX Design'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Jenkins',
      message: 'Visualdy transformed our outdated website into a modern masterpiece. The attention to detail and user-centric approach resulted in a 40% increase in user engagement.',
      photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop',
      rating: 5
    },
    {
      name: 'Michael Chen',
      message: 'Working with the team was an absolute pleasure. They delivered our mobile app ahead of schedule and the design exceeded our expectations. Highly recommended!',
      photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop',
      rating: 5
    },
    {
      name: 'Elena Rodriguez',
      message: 'The brand identity they created perfectly captures our company\'s mission and values. The comprehensive guidelines have made our marketing efforts so much more cohesive.',
      photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2340&auto=format&fit=crop',
      rating: 4
    }
  ];

  console.log('Inserting portfolios...');
  const { error: pError } = await supabase.from('portfolio').insert(portfolios);
  if (pError) console.error('Error inserting portfolios:', pError);
  else console.log('Portfolios inserted successfully.');

  console.log('Inserting testimonials...');
  const { error: tError } = await supabase.from('testimonials').insert(testimonials);
  if (tError) console.error('Error inserting testimonials:', tError);
  else console.log('Testimonials inserted successfully.');
}

seed();
