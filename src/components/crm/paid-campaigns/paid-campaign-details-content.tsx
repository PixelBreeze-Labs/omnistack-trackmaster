"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RefreshCcw, TrendingDown, TrendingUp, Eye, ShoppingCart, DollarSign, Target } from 'lucide-react';
import { usePaidCampaigns } from '@/hooks/usePaidCampaigns';
import InputSelect from '@/components/Common/InputSelect';

const PaidCampaignDetailsComponent = () => {
  const { id } = useParams();
  const { isLoading, fetchCampaignDetails } = usePaidCampaigns();
  const [campaign, setCampaign] = useState(null);
  const [stats, setStats] = useState(null);
  const [timeframe, setTimeframe] = useState('7d');

  useEffect(() => {
    if (id) {
      loadCampaignDetails();
    }
  }, [id, timeframe]);

  const loadCampaignDetails = async () => {
    const data = await fetchCampaignDetails(id, { timeframe });
    setCampaign(data.campaign);
    setStats(data.stats);
  };

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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{campaign.utmCampaign}</h2>
          <p className="text-sm text-muted-foreground mt-2">
            {campaign.utmSource} • {campaign.utmMedium}
          </p>
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
          <Button variant="outline" size="sm" onClick={loadCampaignDetails}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.viewCount ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Add to Cart</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.cartCount ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Purchases</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.purchaseCount ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.revenue?.toLocaleString() ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Conversion Rate: {stats?.conversionRate ?? '0%'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Details */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Source</dt>
              <dd className="mt-1 text-sm">{campaign.utmSource}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Medium</dt>
              <dd className="mt-1 text-sm">{campaign.utmMedium}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Campaign Name</dt>
              <dd className="mt-1 text-sm">{campaign.utmCampaign}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Content</dt>
              <dd className="mt-1 text-sm">{campaign.utmContent || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Created At</dt>
              <dd className="mt-1 text-sm">{new Date(campaign.createdAt).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
              <dd className="mt-1 text-sm">{new Date(campaign.updatedAt).toLocaleDateString()}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaidCampaignDetailsComponent;