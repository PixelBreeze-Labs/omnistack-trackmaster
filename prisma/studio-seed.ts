// prisma/studio-seed.ts
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
    // const supabaseUser = await createSupabaseUser('contact@studio.omnistackhub.xyz', 'S3ST-DIO!-2026x!')

    // Create the client
    const client = await prisma.client.create({
      data: {
        name: 'Studio OmniStack',
        type: 'STUDIO',
        industry: 'STUDIO',
        website: 'https://studio.omnistackhub.xyz',
        description: 'Studio OmniStack Hub',
        status: 'ACTIVE',
        omniGatewayId: '67feacd0d5060f88345d005a',
        omniGatewayApiKey: 'sk_9eb6fc3eba013f372447a16d84eb66a0744b4796ec6b28f183d6e5d1faf90825'
      }
    })


    // Create the admin user in Prisma
    const hashedPassword = await bcrypt.hash('S3ST-DIO!-2026x!', 12)
    const user = await prisma.user.create({
      data: {
        email: 'contact@studio.omnistackhub.xyz',
        name: 'Studio OS Admin',
        password: hashedPassword,
        supabaseId: 'ef34fe92-ab3e-4cb7-89ac-18003ab8a29b', // Using the ID from newly created Supabase user
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