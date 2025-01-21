// prisma/seed.ts
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
    // // First create the user in Supabase
    // const supabaseUser = await createSupabaseUser('crm@metroshop.al', 'C3M-Mshop!-2025x')
    // console.log('Created Supabase user:', supabaseUser)

    // Create the client
    const client = await prisma.client.create({
      data: {
        name: 'Metroshop.al',
        type: 'ECOMMERCE',
        industry: 'Retail',
        website: 'https://metroshop.al',
        description: 'Leading ecommerce platform in Albania',
        status: 'ACTIVE',
      }
    })
    console.log('Created client:', client)

    // Create the CRM admin user
    const hashedPassword = await bcrypt.hash('C3M-Mshop!-2025x', 12)
    const user = await prisma.user.create({
      data: {
        email: 'crm@metroshop.al',
        name: 'Metroshop CRM Admin',
        password: hashedPassword,
        // supabaseId: supabaseUser.id,
        supabaseId: '72a4c59d-7d66-44ea-9da2-54fddd274b96',
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