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
} from "lucide-react";
import { useKnowledge } from "@/hooks/useKnowledge";
import { useRouter } from "next/navigation";

export default function KnowledgeBaseStatistics() {
  const router = useRouter();
  const { isLoading, statistics, fetchStatistics, isInitialized } = useKnowledge();
  const [timeframe, setTimeframe] = useState("month");

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
    }
  }, [isInitialized, fetchStatistics, timeframe]);

  // Helper functions
  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const handleViewQueryResponse = (queryResponseId) => {
    router.push(`/crm/platform/knowledge/query-responses/${queryResponseId}`);
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
                  Total Queries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{statistics.totalQueries || 0}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Total queries handled during this period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Response Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {formatPercentage(statistics.responseRate || 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Percentage of queries that received a response
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Helpful Response Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {formatPercentage(statistics.helpfulResponseRate || 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Percentage of responses marked as helpful
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Query Response Feedback */}
          <Card>
            <CardHeader>
              <CardTitle>Response Feedback</CardTitle>
              <CardDescription>
                Feedback on query responses from users
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
                          ((statistics.helpfulCount || 0) /
                            ((statistics.helpfulCount || 0) + (statistics.unhelpfulCount || 0)) || 0) *
                          100
                        }%`,
                      }}
                    ></div>
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                      <span className="text-xs font-medium z-10">
                        {statistics.helpfulCount || 0} Helpful / {statistics.unhelpfulCount || 0} Unhelpful
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <h4 className="font-medium mb-2">Total Feedback</h4>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-slate-100 p-4 rounded-md text-center">
                      <div className="flex items-center justify-center mb-2">
                        <ThumbsUp className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-xl font-bold">{statistics.helpfulCount || 0}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Helpful</span>
                    </div>
                    <div className="flex-1 bg-slate-100 p-4 rounded-md text-center">
                      <div className="flex items-center justify-center mb-2">
                        <ThumbsDown className="h-5 w-5 text-red-600 mr-2" />
                        <span className="text-xl font-bold">{statistics.unhelpfulCount || 0}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Unhelpful</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
              <CardDescription>
                Response performance by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Queries</TableHead>
                      <TableHead>Response Rate</TableHead>
                      <TableHead>Helpful Rate</TableHead>
                      <TableHead>Unhelpful Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statistics.categoryPerformance && Array.isArray(statistics.categoryPerformance) && statistics.categoryPerformance.length > 0 ? (
                      statistics.categoryPerformance.map((category) => (
                        <TableRow key={category.category}>
                          <TableCell>
                            <Badge variant="outline">{category.category}</Badge>
                          </TableCell>
                          <TableCell>{category.queries}</TableCell>
                          <TableCell>{formatPercentage(category.responseRate)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <ThumbsUp className="h-4 w-4 text-green-600 mr-2" />
                              <span>{formatPercentage(category.helpfulRate)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <ThumbsDown className="h-4 w-4 text-red-600 mr-2" />
                              <span>{formatPercentage(category.unhelpfulRate)}</span>
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
                Most helpful query responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Query</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Helpful</TableHead>
                      <TableHead>Unhelpful</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statistics.topResponses && Array.isArray(statistics.topResponses) && statistics.topResponses.length > 0 ? (
                      statistics.topResponses.map((response) => (
                        <TableRow key={response._id}>
                          <TableCell>
                            <div className="font-medium truncate max-w-xs">
                              {response.query}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {response.category || "Uncategorized"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-green-600">
                              <ThumbsUp className="h-4 w-4 mr-2" />
                              <span>{response.helpfulCount}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-red-600">
                              <ThumbsDown className="h-4 w-4 mr-2" />
                              <span>{response.unhelpfulCount}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewQueryResponse(response._id)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          <span className="text-muted-foreground">
                            No response data available
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
                            <div className="font-medium truncate max-w-xs">
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
                            <Badge variant="secondary">
                              {query.frequency || 1} {query.frequency === 1 ? "time" : "times"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/crm/platform/knowledge/unrecognized`)}
                            >
                              Respond
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          <span className="text-muted-foreground">
                            No unrecognized queries available
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-md flex flex-col items-center justify-center">
                  <FileText className="h-8 w-8 text-blue-600 mb-2" />
                  <div className="text-2xl font-bold mb-1">{statistics.documentCount || 0}</div>
                  <div className="text-sm text-muted-foreground text-center">Knowledge Documents</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-md flex flex-col items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-green-600 mb-2" />
                  <div className="text-2xl font-bold mb-1">{statistics.queryResponseCount || 0}</div>
                  <div className="text-sm text-muted-foreground text-center">Query-Response Pairs</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-md flex flex-col items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-amber-600 mb-2" />
                  <div className="text-2xl font-bold mb-1">{formatPercentage(statistics.overallSuccessRate || 0)}</div>
                  <div className="text-sm text-muted-foreground text-center">Overall Success Rate</div>
                </div>
              </div>

              {/* Export Data Button */}
              <div className="mt-6 flex justify-end">
                <Button variant="outline">
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