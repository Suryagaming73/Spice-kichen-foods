import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://otqawphaipnjgpqokkea.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90cWF3cGhhaXBuamdwcW9ra2VhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzE1ODEwMSwiZXhwIjoyMDk4NzM0MTAxfQ.LyGtgCZiaC7QINtkLtMXz8lWWAMOUytOxugXpol3mKM'; // SERVICE ROLE KEY

const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function test() {
  console.log("Testing user creation...");
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: 'test' + Date.now() + '@example.com',
    password: 'password123',
    email_confirm: true,
  });

  if (error) {
    console.error("Error creating user:", error);
    return;
  }
  
  console.log("User created successfully:", data.user.id);

  console.log("Checking if profile was created by trigger...");
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();
    
  if (profileError) {
    console.error("Error fetching profile (Trigger failed?):", profileError);
  } else {
    console.log("Profile created successfully:", profile);
  }
  
  // Cleanup
  await supabaseAdmin.auth.admin.deleteUser(data.user.id);
  console.log("Test user deleted.");
}

test();
