# Connecting Bookmaster with Trackmaster

## Overview

This guide explains how to connect TrackMaster with BookMaster using external IDs for seamless integration.

## Steps

1. **Update Database Schema**

   ```bash
   npx prisma migrate dev --name add_bookmaster_id
   ```

2. **Update Existing Client**

   ```bash
   npx prisma db seed
   ```

   This will update the client with ID '6795785555dcaaa39e3f5cb1' to include both omniGateway and BookMaster IDs.

3. **Verify Connection**
   - Check that the client has both IDs:
     - omniGatewayId: '67957d78172a3de27fd14a9a'
     - bookMasterId: '234'

## Integration Points

1. **Client Synchronization**

   - TrackMaster clients are linked to BookMaster via `bookMasterId`
   - When creating new clients, ensure both systems are updated

2. **Data Flow**

   - TrackMaster → OmniGateway → BookMaster
   - Use the external IDs for cross-referencing

3. **Error Handling**
   - If syncs fail, check external IDs match
   - Ensure both systems are accessible

## Testing Connection

1. **Verify Client Mapping**

   ```javascript
   const client = await prisma.client.findUnique({
     where: { id: "6795785555dcaaa39e3f5cb1" },
   });
   console.log(client.bookMasterId); // Should print "234"
   ```

2. **Test API Integration**
   - Ensure API calls include correct external IDs
   - Verify data flows correctly between systems

## Troubleshooting

1. **Missing External IDs**

   - Run seed script to update
   - Check database connections

2. **Sync Issues**
   - Verify both systems are online
   - Check API credentials
   - Validate external ID mapping
