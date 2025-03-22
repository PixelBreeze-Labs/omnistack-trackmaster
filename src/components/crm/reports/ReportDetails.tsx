"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAdminReports } from "@/hooks/useAdminReports";
import { AdminReport } from "@/app/api/external/omnigateway/types/admin-reports";
import ReportMetricsCard from "@/components/crm/reports/ReportMetricsCard";
import ReportCommentsList from "@/components/crm/reports/ReportCommentsList";
import ReportFlagsList from "@/components/crm/reports/ReportFlagsList";
import {
  RefreshCcw,
  ChevronLeft
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ReportDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoading, getReport, isInitialized } = useAdminReports();
  const [report, setReport] = useState<AdminReport | null>(null);
  const [activeTab, setActiveTab] = useState("comments");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Force render flags - increment these to force a re-render of components
  const [commentsKey, setCommentsKey] = useState(1);
  const [flagsKey, setFlagsKey] = useState(1);

  useEffect(() => {
    if (params.id && isInitialized) {
      fetchReport();
    }
  }, [params.id, isInitialized]);

  const fetchReport = async () => {
    setIsRefreshing(true);
    try {
      const reportData = await getReport(params.id as string);
      console.log('reportData', reportData);
      if (reportData) {
        setReport(reportData);
        
        // Force re-render of the current tab's component when report is refreshed
        if (activeTab === "comments") {
          setCommentsKey(prev => prev + 1);
        } else {
          setFlagsKey(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Force a re-render of the component when tab is changed
    if (value === "comments") {
      setCommentsKey(prev => prev + 1);
    } else if (value === "flags") {
      setFlagsKey(prev => prev + 1);
    }
  };

  const goBack = () => {
    router.back();
  };

  if (isLoading && !report) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Report Not Found</h1>
          <Button onClick={goBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={goBack} className="mr-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{report.title}</h1>
        </div>
        <Button onClick={fetchReport} variant="outline" disabled={isRefreshing}>
          <RefreshCcw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Metrics Card */}
      <ReportMetricsCard report={report} />

      {/* Tabs for Comments and Flags */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="comments">
            Comments {report.commentCount ? `(${report.commentCount})` : ''}
          </TabsTrigger>
          <TabsTrigger value="flags">
            Flags {report.flagsCount ? `(${report.flagsCount})` : ''}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="comments" className="mt-6">
          <ReportCommentsList 
            reportId={report._id} 
            onRefreshNeeded={fetchReport} 
            key={`comments-${report._id}-${commentsKey}`}
          />
        </TabsContent>
        
        <TabsContent value="flags" className="mt-6">
          <ReportFlagsList 
            reportId={report._id} 
            onRefreshNeeded={fetchReport} 
            key={`flags-${report._id}-${flagsKey}`}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}