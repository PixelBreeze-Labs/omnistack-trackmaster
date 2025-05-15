
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/new-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import InputSelect from "@/components/Common/InputSelect";
import {
  BarChart2,
  PieChart,
  RefreshCcw,
  ThumbsUp,
  ThumbsDown,
  Download,
  Calendar,
  TrendingUp,
  AlertCircle,
  MessageSquare,
  FileText,
  Users,
  Activity,
  Eye,
} from "lucide-react";
import { useKnowledge } from "@/hooks/useKnowledge";
import { useRouter } from "next/navigation";

export default function KnowledgeBaseStatistics() {
  const router = useRouter();
  const { 
    isLoading, 
    statistics, 
    fetchStatistics,
    fetchDocuments,
    fetchQueryResponses,
    fetchUnrecognizedQueries,
    isInitialized 
  } = useKnowledge();
  const [timeframe, setTimeframe] = useState("month");
  const [additionalStats, setAdditionalStats] = useState({
    totalDocuments: 0,
    totalQueryResponses: 0,
    totalUnrecognizedQueries: 0,
  });

  // Timeframe options
  const timeframeOptions = [
    { value: "day", label: "Last 24 Hours" },
    { value: "week", label: "Last 7 Days" },
    { value: "month", label: "Last 30 Days" },
    { value: "year", label: "Last 12 Months" },
  ];

  // Load statistics when component mounts
  useEffect(() => {
    if (isInitialized) {
      fetchStatistics({ timeframe });
      // Fetch additional stats
      loadAdditionalStats();
    }
  }, [isInitialized, fetchStatistics, timeframe]);

  // Load additional statistics
  const loadAdditionalStats = async () => {
    try {
      // Get document count
      const documentsResponse = await fetchDocuments({ limit: 1 });
      const totalDocuments = documentsResponse?.total || 0;

      // Get query responses count
      const queryResponsesResponse = await fetchQueryResponses({ limit: 1 });
      const totalQueryResponses = queryResponsesResponse?.total || 0;

      // Get unrecognized queries count
      const unrecognizedResponse = await fetchUnrecognizedQueries({ limit: 1 });
      const totalUnrecognizedQueries = unrecognizedResponse?.total || 0;

      setAdditionalStats({
        totalDocuments,
        totalQueryResponses,
        totalUnrecognizedQueries,
      });
    } catch (error) {
      console.error("Error fetching additional stats:", error);
    }
  };

  // Helper functions
  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(1)}%`;
  };

  const handleExportStatistics = () => {
    // Create export data
    const exportData = {
      timeframe,
      summary: {
        totalResponses: statistics?.totalResponses || 0,
        helpfulResponses: statistics?.helpfulResponses || 0,
        helpfulPercentage: statistics?.helpfulPercentage || 0,
      },
      categories: statistics?.responsesByCategory || [],
      topPerformingResponses: statistics?.topPerformingResponses || [],
      knowledgeBaseHealth: {
        totalDocuments: additionalStats.totalDocuments,
        totalQueryResponses: additionalStats.totalQueryResponses,
        totalUnrecognizedQueries: additionalStats.totalUnrecognizedQueries,
        overallSuccessRate: calculateOverallSuccessRate(),
      },
      feedback: statistics?.feedbackBreakdown || {},
      exportedAt: new Date().toISOString(),
    };

    // Create and download CSV
    const csvContent = generateCSV(exportData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `knowledge-base-statistics-${timeframe}-${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateCSV = (data) => {
    let csv = 'Knowledge Base Statistics Export\n\n';
    csv += `Timeframe: ${timeframe}\n`;
    csv += `Exported At: ${new Date().toLocaleString()}\n\n`;
    
    // Summary
    csv += 'Summary\n';
    csv += 'Metric,Value\n';
    csv += `Total Responses,${data.summary.totalResponses}\n`;
    csv += `Helpful Responses,${data.summary.helpfulResponses}\n`;
    csv += `Helpful Percentage,${data.summary.helpfulPercentage}%\n\n`;
    
    // Feedback
    csv += 'Feedback Breakdown\n';
    csv += 'Metric,Value\n';
    csv += `Total Feedback,${data.feedback.totalFeedback || 0}\n`;
    csv += `Helpful Count,${data.feedback.helpfulCount || 0}\n`;
    csv += `Unhelpful Count,${data.feedback.unhelpfulCount || 0}\n\n`;
    
    // Categories
    csv += 'Category Performance\n';
    csv += 'Category,Count,Helpful Count,Unhelpful Count,Helpful Percentage\n';
    data.categories.forEach(cat => {
      csv += `"${cat.category}",${cat.count},${cat.helpfulCount},${cat.unhelpfulCount || 0},${cat.helpfulPercentage}%\n`;
    });
    
    // Top Responses
    csv += '\nTop Performing Responses\n';
    csv += 'Query,Success Rate,Use Count,Category\n';
    data.topPerformingResponses.forEach(resp => {
      csv += `"${resp.query}",${resp.successRate}%,${resp.useCount},"${resp.category || 'N/A'}"\n`;
    });
    
    return csv;
  };

  const calculateOverallSuccessRate = () => {
    if (!statistics?.topPerformingResponses || statistics.topPerformingResponses.length === 0) {
      return 0;
    }
    
    return statistics.overallSuccessRate || 0;
  };

  return (
    <div className="space-y-6">
      {/* Timeframe selector */}
      <div className="flex justify-end">
        <div className="w-48">
          <InputSelect
            name="timeframe"
            label="Timeframe"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            options={timeframeOptions}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <RefreshCcw className="h-12 w-12 animate-spin text-muted-foreground" />
        </div>
      ) : !statistics ? (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No statistics available</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
            Statistics will be generated as users interact with the knowledge base.
          </p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Query Responses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{statistics.totalResponses || 0}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Total query responses in the system
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Helpful Responses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {statistics.helpfulResponses || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Responses marked as helpful by users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Success Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {formatPercentage(statistics.helpfulPercentage)}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Percentage of helpful responses
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Response Feedback Breakdown */}
          {statistics.feedbackBreakdown && (
            <Card>
              <CardHeader>
                <CardTitle>Response Feedback</CardTitle>
                <CardDescription>
                  User feedback on chatbot responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Helpful vs. Unhelpful</h4>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                          <span className="text-sm">Helpful</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                          <span className="text-sm">Unhelpful</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-100 rounded-md h-8 w-full relative overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-green-500"
                        style={{
                          width: `${
                            statistics.feedbackBreakdown.totalFeedback > 0
                              ? ((statistics.feedbackBreakdown.helpfulCount) / 
                                 (statistics.feedbackBreakdown.totalFeedback)) * 100
                              : 0
                          }%`,
                        }}
                      ></div>
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                        <span className="text-xs font-medium z-10  text-white">
                          {statistics.feedbackBreakdown.helpfulCount} Helpful / {statistics.feedbackBreakdown.unhelpfulCount} Unhelpful
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium mb-2">Total Feedback</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-green-50 p-4 rounded-md text-center">
                        <div className="flex items-center justify-center mb-2">
                          <ThumbsUp className="h-5 w-5 text-green-600 mr-2" />
                          <span className="text-xl font-bold">{statistics.feedbackBreakdown.helpfulCount}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">Helpful</span>
                      </div>
                      <div className="flex-1 bg-red-50 p-4 rounded-md text-center">
                        <div className="flex items-center justify-center mb-2">
                          <ThumbsDown className="h-5 w-5 text-red-600 mr-2" />
                          <span className="text-xl font-bold">{statistics.feedbackBreakdown.unhelpfulCount}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">Unhelpful</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feedback over time */}
                {statistics.feedbackBreakdown.byTimeframe && statistics.feedbackBreakdown.byTimeframe.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-4">Feedback Trend</h4>
                    <div className="space-y-2">
                      {statistics.feedbackBreakdown.byTimeframe.slice(-7).map((item) => (
                        <div key={item.date} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                          <span className="text-sm">{new Date(item.date).toLocaleDateString()}</span>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center">
                              <ThumbsUp className="h-4 w-4 text-green-600 mr-1" />
                              <span className="text-sm">{item.helpful}</span>
                            </div>
                            <div className="flex items-center">
                              <ThumbsDown className="h-4 w-4 text-red-600 mr-1" />
                              <span className="text-sm">{item.unhelpful}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Response Performance by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
              <CardDescription>
                Response performance breakdown by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Total Responses</TableHead>
                      <TableHead>Helpful</TableHead>
                      <TableHead>Unhelpful</TableHead>
                      <TableHead>Success Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statistics.responsesByCategory && Array.isArray(statistics.responsesByCategory) && statistics.responsesByCategory.length > 0 ? (
                      statistics.responsesByCategory.map((category) => (
                        <TableRow key={category.category}>
                          <TableCell>
                            <Badge variant="outline">{category.category}</Badge>
                          </TableCell>
                          <TableCell>{category.count}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <ThumbsUp className="h-4 w-4 text-green-600 mr-2" />
                              <span>{category.helpfulCount}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <ThumbsDown className="h-4 w-4 text-red-600 mr-2" />
                              <span>{category.unhelpfulCount || 0}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
                              <span>{formatPercentage(category.helpfulPercentage)}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          <span className="text-muted-foreground">
                            No category data available
                          </span>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Responses */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Responses</CardTitle>
              <CardDescription>
                Most successful query-response pairs by success rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Query</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Success Rate</TableHead>
                      <TableHead>Use Count</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statistics.topPerformingResponses && Array.isArray(statistics.topPerformingResponses) && statistics.topPerformingResponses.length > 0 ? (
                      statistics.topPerformingResponses.map((response) => (
                        <TableRow key={response.id}>
                          <TableCell>
                            <div className="font-medium max-w-xs truncate">
                              {response.query}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {response.category || "Uncategorized"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className={`text-sm font-medium ${
                                response.successRate >= 50 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {formatPercentage(response.successRate)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {response.useCount} uses
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/crm/platform/knowledge/query-responses/${response.id}`)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          <span className="text-muted-foreground">
                            No performance data available yet
                          </span>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Recent Unrecognized Queries */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Unrecognized Queries</CardTitle>
              <CardDescription>
                Queries that the system couldn't answer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Query</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statistics.recentUnrecognizedQueries && Array.isArray(statistics.recentUnrecognizedQueries) && statistics.recentUnrecognizedQueries.length > 0 ? (
                      statistics.recentUnrecognizedQueries.map((query) => (
                        <TableRow key={query._id}>
                          <TableCell>
                            <div className="font-medium max-w-xs truncate">
                              {query.query}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(query.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={query.frequency > 1 ? "destructive" : "secondary"}>
                              {query.frequency || 1} {query.frequency === 1 ? "time" : "times"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/crm/platform/knowledge/unrecognized`)}
                            >
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Respond
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          <span className="text-muted-foreground">
                            No unrecognized queries found
                          </span>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Knowledge Base Health */}
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base Health</CardTitle>
              <CardDescription>
                Overall knowledge base status and metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-md flex flex-col items-center justify-center">
                  <FileText className="h-8 w-8 text-blue-600 mb-2" />
                  <div className="text-2xl font-bold mb-1">{statistics.totalDocuments || 0}</div>
                  <div className="text-sm text-muted-foreground text-center">Knowledge Documents</div>
                </div>

                <div className="bg-green-50 p-4 rounded-md flex flex-col items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-green-600 mb-2" />
                  <div className="text-2xl font-bold mb-1">{statistics.totalQueryResponses || 0}</div>
                  <div className="text-sm text-muted-foreground text-center">Query-Response Pairs</div>
                </div>

                <div className="bg-amber-50 p-4 rounded-md flex flex-col items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-amber-600 mb-2" />
                  <div className="text-2xl font-bold mb-1">{statistics.totalUnrecognizedQueries || 0}</div>
                  <div className="text-sm text-muted-foreground text-center">Unrecognized Queries</div>
                </div>

                <div className="bg-purple-50 p-4 rounded-md flex flex-col items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-purple-600 mb-2" />
                  <div className="text-2xl font-bold mb-1">{formatPercentage(statistics.overallSuccessRate || 0)}</div>
                  <div className="text-sm text-muted-foreground text-center">Overall Success Rate</div>
                </div>
              </div>

              {/* Export Data Button */}
              <div className="mt-6 flex justify-end">
                <Button variant="outline" onClick={handleExportStatistics}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Statistics
                </Button>
              </div>
            </CardContent>
          </Card>

        
        </>
      )}
    </div>
  );
}