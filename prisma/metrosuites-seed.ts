// prisma/metrosuites-seed.ts
const { PrismaClient } = require('@prisma/client')
const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

// Check environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error('Required environment variables:', {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Present' : 'Missing',
    key: process.env.SUPABASE_SERVICE_KEY ? 'Present' : 'Missing'
  })
  throw new Error('Missing required Supabase environment variables')
}

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

async function createSupabaseUser(email: string, password: string) {
  const { data: user, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  })

  if (error) {
    throw new Error(`Failed to create Supabase user: ${error.message}`)
  }

  return user.user
}

async function main() {
  try {
    // First create the user in Supabase
    // const supabaseUser = await createSupabaseUser('admin@metrosuites.al', 'Metro2025!x!')

    // Create the client
    const client = await prisma.client.create({
      data: {
        name: 'Metrosuites',
        type: 'BOOKING',
        industry: 'Hospitality',
        website: 'https://metrosuites.al',
        description: 'Premium Booking Platform for Albania',
        status: 'ACTIVE',
        omniGatewayId: '67c98d0d9ff7cc87063adf68',
        omniGatewayApiKey: 'sk_126bba1c665b8c9a1cfeee2a407f24d304e550f015dca13a8f55197cb7076c52'
      }
    })

    // Create the admin user in Prisma
    const hashedPassword = await bcrypt.hash('Metro2025!x!', 12)
    const user = await prisma.user.create({
      data: {
        email: 'admin@metrosuites.al',
        name: 'Metrosuites Admin',
        password: hashedPassword,
        supabaseId: '38d2823f-519d-455c-87b0-b37b4a605cbc', // Using the ID from newly created Supabase user
        role: 'ADMIN',
        clientId: client.id,
      }
    })

  } catch (error) {
    console.error('Error during seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })