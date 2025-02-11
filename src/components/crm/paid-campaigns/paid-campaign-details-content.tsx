"use client";
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCcw, TrendingUp, Eye, ShoppingCart, DollarSign, Target, Receipt, Calendar, Package } from 'lucide-react';
import { usePaidCampaigns } from '@/hooks/usePaidCampaigns';
import InputSelect from '@/components/Common/InputSelect';
import { CampaignEvent, PaidCampaign } from '@/app/api/external/omnigateway/types/paid-campaigns';
import { PaidCampaignStats } from '@/app/api/external/omnigateway/types/paid-campaigns';

const MetricCard = ({ title, value, subValue, icon: Icon, color = "text-foreground" }) => (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
        {subValue && (
          <p className="text-xs text-muted-foreground mt-1">{subValue}</p>
        )}
      </CardContent>
    </Card>
  );

  const EventsTable = ({ events, type }: { events: CampaignEvent[], type: string }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{type} Events</CardTitle>
      </CardHeader>
      <CardContent>
      {events.length === 0 ? (
       <div className="py-12 flex flex-col items-center justify-center text-center border rounded-lg">
         <Receipt className="h-8 w-8 text-muted-foreground mb-3" />
         <p className="text-sm text-muted-foreground">No {type.toLowerCase()} events recorded yet</p>
       </div>
     ) : (
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b">
                <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                {type === 'Purchase' && <th className="h-12 px-4 text-left align-middle font-medium">Order ID</th>}
                {type !== 'Purchase' && <th className="h-12 px-4 text-left align-middle font-medium">Product ID</th>}
                {type === 'Add to Cart' && (
                  <>
                    <th className="h-12 px-4 text-left align-middle font-medium">Quantity</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Price</th>
                  </>
                )}
                {type === 'Purchase' && <th className="h-12 px-4 text-left align-middle font-medium">Total</th>}
                <th className="h-12 px-4 text-left align-middle font-medium">Currency</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="border-b">
                  <td className="p-4">{new Date(event.createdAt).toLocaleString()}</td>
                  {type === 'Purchase' && <td className="p-4">{event.external_order_ids?.venueBoostId}</td>}
                  {type !== 'Purchase' && <td className="p-4">{event.external_product_ids?.venueBoostId}</td>}
                  {type === 'Add to Cart' && (
                    <>
                      <td className="p-4">{event.eventData.quantity}</td>
                      <td className="p-4">{event.eventData.price}</td>
                    </>
                  )}
                  {type === 'Purchase' && <td className="p-4">{event.eventData.total}</td>}
                  <td className="p-4">{event.eventData?.currency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </CardContent>
    </Card>
  );

  
const PaidCampaignDetailsComponent = () => {
 const params = useParams();
 const id = params?.id as string;
 const { isLoading, fetchCampaignDetails } = usePaidCampaigns();
 const [campaign, setCampaign] = useState<PaidCampaign | null>(null);
 const [stats, setStats] = useState<PaidCampaignStats | null>(null);
 const [timeframe, setTimeframe] = useState('7d');

 const loadCampaignDetails = useCallback(async () => {
   try {
     const data = await fetchCampaignDetails(id, { timeframe });
     if (!data) return;
     setCampaign(data.campaign);
     setStats(data.stats);
   } catch (error) {
     console.error('Error:', error);
   }
 }, [id, timeframe, fetchCampaignDetails]);

 useEffect(() => {
   if (!id) return;
   loadCampaignDetails();
 }, [id, timeframe, loadCampaignDetails]);

 if (isLoading) {
   return (
     <div className="flex items-center justify-center h-96">
       <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
     </div>
   );
 }

 if (!campaign) {
   return (
     <div className="flex flex-col items-center justify-center h-96 space-y-4">
       <Target className="h-16 w-16 text-muted-foreground" />
       <h3 className="text-lg font-medium">Campaign Not Found</h3>
       <p className="text-sm text-muted-foreground text-center max-w-md">
         The campaign you're looking for doesn't exist or you don't have permission to view it.
       </p>
     </div>
   );
 }

 return (
   <div className="space-y-6 mb-8">
     {/* Header */}
     <div className="flex justify-between items-center">
 <div>
   <h2 className="text-2xl font-bold tracking-tight">
     {campaign.utmCampaign}
   </h2>
   <div className="flex items-center gap-2 mt-2">
     <Badge variant="outline">{campaign.utmSource}</Badge>
     <Badge variant="secondary">{campaign.utmMedium}</Badge>
     <span className="text-sm text-muted-foreground">
       Created {new Date(campaign.createdAt).toLocaleDateString()}
     </span>
   </div>
 </div>
 <div className="flex items-center gap-2">
   <InputSelect
     name="timeframe"
     label=""
     value={timeframe}
     onChange={(e) => setTimeframe(e.target.value)}
     options={[
       { value: "7d", label: "Last 7 days" },
       { value: "30d", label: "Last 30 days" },
       { value: "90d", label: "Last 90 days" }
     ]}
   />
   <Button variant="secondary" size="sm" className='mt-2' onClick={loadCampaignDetails}>
     <RefreshCcw className="mr-2 h-4 w-4" />
     Refresh
   </Button>
 </div>
</div>

     {/* Primary Stats */}
     <div className="grid gap-6">
     <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance Overview</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-4 gap-4">
            <MetricCard
              title="Revenue"
              value={`$${stats?.revenue?.toLocaleString() ?? 0}`}
              subValue={`Conv. Rate: ${stats?.conversionRate ?? '0%'}`}
              icon={DollarSign}
              color="text-green-600"
            />
            <MetricCard
              title="Add to Cart"
              value={stats?.cartCount ?? 0}
              subValue={`Total Value: $${(stats?.cartCount * 100)?.toLocaleString() ?? 0}`}
              icon={ShoppingCart}
              color="text-blue-600"
            />
            <MetricCard
              title="Purchases"
              value={stats?.purchaseCount ?? 0}
              subValue={`Avg Order: $${(stats?.revenue / (stats?.purchaseCount || 1))?.toFixed(2) ?? 0}`}
              icon={Receipt}
            />
            <MetricCard
              title="Product Views"
              value={stats?.viewCount ?? 0}
              subValue="Unique Views"
              icon={Eye}
            />
          </CardContent>
        </Card>

        <Card>
        <CardHeader>
        <div className="flex items-center gap-2">
            <CardTitle>Campaign Information</CardTitle>
        </div>
        </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Created At</dt>
                <dd className="mt-1 text-sm font-medium">
                  {new Date(campaign.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Source</dt>
                <dd className="mt-1 text-sm font-medium">{campaign.utmSource}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Target className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Medium</dt>
                <dd className="mt-1 text-sm font-medium">{campaign.utmMedium}</dd>
              </div>
            </div>
            {campaign.utmContent && (
              <div className="flex items-start gap-2">
                <Receipt className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Content</dt>
                  <dd className="mt-1 text-sm font-medium">{campaign.utmContent}</dd>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
    
     </div>

     <div className="grid gap-6">
  <EventsTable 
    events={stats?.events.filter(e => e.eventType === 'view_product') || []} 
    type="Product View" 
  />
  <EventsTable 
    events={stats?.events.filter(e => e.eventType === 'add_to_cart') || []} 
    type="Add to Cart" 
  />
  <EventsTable 
    events={stats?.events.filter(e => e.eventType === 'purchase') || []} 
    type="Purchase" 
  />
</div>
     <div className="h-8"></div>
   </div>
 );
};

export default PaidCampaignDetailsComponent;