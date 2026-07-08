import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://otqawphaipnjgpqokkea.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90cWF3cGhhaXBuamdwcW9ra2VhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzE1ODEwMSwiZXhwIjoyMDk4NzM0MTAxfQ.LyGtgCZiaC7QINtkLtMXz8lWWAMOUytOxugXpol3mKM';

const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
  const { data, error } = await supabaseAdmin.from('profiles').select('*');
  console.log(JSON.stringify(data, null, 2));
}

run();
