// prisma/venueboost-seed.ts
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
    // Uncomment the line below when you want to create the Supabase user
    // const supabaseUser = await createSupabaseUser('contact@venueboost.io', 'VenueBoost2025!x!')

    // Create the client
    const client = await prisma.client.create({
      data: {
        name: 'VenueBoost',
        type: 'VENUEBOOST',
        industry: 'Hospitality & Event Management',
        website: 'https://venueboost.io',
        description: 'Complete venue management platform for hospitality, entertainment, and events',
        status: 'ACTIVE',
        // These would need to be generated in your actual gateway service
        omniGatewayId: '67cc3620af1d976ffdf3e314',
        omniGatewayApiKey: 'sk_f54d35fb2b526fc5d8e504be5b4f20751e3a48bc49c03ae4f8c588c6565fbd96'
      }
    })

    // Create the admin user in Prisma
    // For production use, generate a unique supabaseId from the created user
    const hashedPassword = await bcrypt.hash('VenueBoost2025!x!', 12)
    const user = await prisma.user.create({
      data: {
        email: 'contact@venueboost.io',
        name: 'VenueBoost Admin',
        password: hashedPassword,
        // Replace with the actual ID when you uncomment the createSupabaseUser line
        supabaseId: '611eb6c1-b912-4003-adef-a2a126dd022c', 
        role: 'ADMIN',
        clientId: client.id,
      }
    })

    

    console.log('VenueBoost seed data created successfully')

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