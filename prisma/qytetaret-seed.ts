// prisma/qytetaret-seed.ts
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
    const supabaseUser = await createSupabaseUser('admin@qytetaret.al', 'Qytetaret2025!x!')

    // Create the client
    const client = await prisma.client.create({
      data: {
        name: 'Qytetaret',
        type: 'QYTETARET',
        industry: 'Community Services & Local Government',
        website: 'https://qytetaret.al',
        description: 'Community reporting platform for citizen engagement and public issue tracking',
        status: 'ACTIVE',
        // These would need to be generated in your actual gateway service
        omniGatewayId: '67d1490fda40caa565077c90',
        omniGatewayApiKey: 'sk_f8e5eb3bc59431cf36c48d64298dc321bc0f95f96e4e1fcdab0beb9f08c00ae9'
      }
    })

    // Create the admin user in Prisma
    // For production use, generate a unique supabaseId from the created user
    const hashedPassword = await bcrypt.hash('Qytetaret2025!x!', 12)
    const user = await prisma.user.create({
      data: {
        email: 'admin@qytetaret.al',
        name: 'Qytetaret Admin',
        password: hashedPassword,
        // Replace with the actual ID when you uncomment the createSupabaseUser line
        supabaseId: supabaseUser.id, 
        role: 'ADMIN',
        clientId: client.id,
      }
    })

    console.log('Qytetaret seed data created successfully')

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