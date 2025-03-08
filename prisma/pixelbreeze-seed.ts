// prisma/pixelbreeze-seed.ts
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
    // const supabaseUser = await createSupabaseUser('admin@pixelbreeze.xyz', 'PixelBreeze2025!x!')

    // Create the client
    const client = await prisma.client.create({
      data: {
        name: 'PixelBreeze',
        type: 'PIXELBREEZE',
        industry: 'Social Media & Marketing',
        website: 'https://pixelbreeze.xyz',
        description: 'AI-powered social media image generation platform',
        status: 'ACTIVE',
        // These would need to be generated in your actual gateway service
        omniGatewayId: '67cc3e32af1d976ffdf3e336',
        omniGatewayApiKey: 'sk_3480857184b9d691aa6cb46e40466d5f80b525d0f660370b0b57120d5d6105d8'
      }
    })

    // Create the admin user in Prisma
    // For production use, generate a unique supabaseId from the created user
    const hashedPassword = await bcrypt.hash('PixelBreeze2025!x!', 12)
    const user = await prisma.user.create({
      data: {
        email: 'admin@pixelbreeze.xyz',
        name: 'PixelBreeze Admin',
        password: hashedPassword,
        // Replace with the actual ID when you uncomment the createSupabaseUser line
        supabaseId: '41575af2-6e43-45d7-85d4-bc4338f962e4', 
        role: 'ADMIN',
        clientId: client.id,
      }
    })

    // Create some sample product templates
    // You might need to create additional models for templates, media, etc.
    
    console.log('PixelBreeze seed data created successfully')

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