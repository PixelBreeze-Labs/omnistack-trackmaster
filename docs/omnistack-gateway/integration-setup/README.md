# OmniStack Gateway Integration Guide

## Overview

This guide explains how to integrate the OmniStack Gateway with your application. The gateway provides essential services like user management, family accounts, and staff app access features.

## Prerequisites

- Access to OmniStack Gateway Admin Panel
- Your application's client ID
- Prisma CLI installed (`npm install -g prisma`)

## Gateway Credentials

Each client in your application needs to be linked with OmniStack Gateway credentials:

- `omniGatewayId`: Unique identifier in the gateway system
- `omniGatewayApiKey`: Secret key for API authentication

## Configuration Steps

### 1. Get Gateway Credentials

First, obtain your credentials from the OmniStack Gateway admin panel. You'll need:

```plaintext
Gateway Client ID: e.g., '679cd85f2468feb16f7c57ba'
Gateway API Key: e.g., 'sk_73f7fe6f22aec03511b02415a72ee75ea746a60980b69ac9f3dfba9241b17b91'
```

### 2. Link Credentials

Create a script to link your client with the gateway credentials:

```javascript
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.client.update({
    where: {
      id: "YOUR_CLIENT_ID", // Replace with your client ID
    },
    data: {
      omniGatewayId: "YOUR_GATEWAY_CLIENT_ID",
      omniGatewayApiKey: "YOUR_GATEWAY_API_KEY",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### 3. Verify Configuration

Check if the configuration was successful:

```javascript
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function verifyGatewayConfig() {
  const client = await prisma.client.findUnique({
    where: { id: "YOUR_CLIENT_ID" },
    select: {
      id: true,
      omniGatewayId: true,
      omniGatewayApiKey: true,
    },
  });

  if (!client?.omniGatewayId || !client?.omniGatewayApiKey) {
    console.error("⚠️ Gateway configuration missing");
    return false;
  }

  console.log("✅ Gateway configuration verified");
  return true;
}
```

## Dependent Features

The following features require proper gateway configuration:

1. **Staff App Access**

   - Sales associate app registration
   - User authentication
   - Permission management

2. **User Synchronization**

   - Account creation
   - Profile updates
   - Status synchronization

3. **Family Accounts**
   - Member linking
   - Benefits sharing
   - Account management

## Security Considerations

### API Key Protection

- Never commit API keys to version control
- Store keys in environment variables
- Use secret management in production
- Rotate keys periodically

### Environment Setup

Your `.env` file should include:

```plaintext
OMNISTACK_GATEWAY_URL=https://api.gateway.example.com
OMNISTACK_GATEWAY_KEY=your_api_key_here
```

## Troubleshooting

### Common Issues

1. **Missing Configuration**

   ```javascript
   // Check if client has gateway configuration
   const hasConfig = await prisma.client.findMany({
     where: {
       OR: [{ omniGatewayId: null }, { omniGatewayApiKey: null }],
     },
   });
   ```

2. **Invalid Credentials**

   - Verify credentials in gateway admin panel
   - Ensure API key hasn't expired
   - Check for proper key format

3. **Feature Not Working**
   - Confirm client linkage
   - Verify API permissions
   - Check error logs

### Support

If you encounter issues:

1. Check the configuration
2. Verify credentials
3. Review error logs
4. Contact gateway support with your client ID

## API Usage Example

After configuration, you can use the gateway API:

```typescript
import { createOmniGateway } from "./api/external/omnigateway";

export const createOmniStackUser = async (apiKey: string, userData: any) => {
  const api = createOmniGateway(apiKey);

  try {
    const response = await api.post("/users", userData);
    return response.data;
  } catch (error) {
    console.error("Failed to create OmniStack user:", error);
    throw error;
  }
};
```

## Maintenance

Regular maintenance tasks:

- Verify gateway connection monthly
- Update API keys quarterly
- Monitor usage and quotas
- Keep client information synchronized

Remember to always test gateway features in a staging environment before deploying to production.
