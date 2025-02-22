// prisma/staffluent-seed.ts
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
    // const supabaseUser = await createSupabaseUser('contact@staffluent.co', 'S3L-LUENT!-2025x!')
    // console.log('Created Supabase user:', supabaseUser)

    // Create the client
    const client = await prisma.client.create({
      data: {
        name: 'Staffluent',
        type: 'SAAS',
        industry: 'SAAS',
        website: 'https://staffluent.co',
        description: 'Workforce Solutions Platform',
        status: 'ACTIVE',
        omniGatewayId: '67b7f5562f3f468744d19336',
        omniGatewayApiKey: 'sk_2462670fcf9d668a3ce8e98d5845b3154ee13aa100e4f00e3103b054e9a0bacf'
      }
    })
    console.log('Created client:', client)

    // Create the admin user in Prisma
    const hashedPassword = await bcrypt.hash('S3L-LUENT!-2025x!', 12)
    const user = await prisma.user.create({
      data: {
        email: 'contact@staffluent.co',
        name: 'Staffluent Admin',
        password: hashedPassword,
        supabaseId: 'c2c4dca7-f690-44c1-92dd-aab7ed7edc4a', // Using the ID from newly created Supabase user
        role: 'ADMIN',
        clientId: client.id,
      }
    })
    console.log('Created Prisma user:', user)

    console.log('Seeding completed successfully!')
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