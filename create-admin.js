/* eslint-env node */
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SECRET_KEY
)

async function createAdmin() {
  const email = 'admin@spicekitchen.com'
  const password = 'AdminPassword123!'

  console.log('Creating admin user...')

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true
  })

  if (error) {
    if (error.message.includes('already exists')) {
      console.log('Admin user already exists. Updating role...')
      const { data: users } = await supabaseAdmin.auth.admin.listUsers()
      const existingUser = users.users.find(u => u.email === email)
      
      if (existingUser) {
        await supabaseAdmin
          .from('profiles')
          .update({ role: 'admin', full_name: 'Hotel Admin' })
          .eq('id', existingUser.id)
        console.log('Successfully set existing user as admin!')
        console.log(`Email: ${email}\nPassword: ${password}`)
      }
      return
    }
    console.error('Error creating user:', error.message)
    return
  }

  console.log('User created:', data.user.id)

  // Wait a few seconds for the trigger to create the profile
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Update role to admin
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({ role: 'admin', full_name: 'Hotel Admin' })
    .eq('id', data.user.id)

  if (profileError) {
    console.error('Error updating profile to admin:', profileError.message)
  } else {
    console.log('Successfully set user as admin!')
    console.log(`Email: ${email}\nPassword: ${password}`)
  }
}

createAdmin()
