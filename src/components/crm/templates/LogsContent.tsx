"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/new-card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import InputSelect from "@/components/Common/InputSelect";
// import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { format, subDays } from 'date-fns';
import { 
  ActivityIcon, 
  RefreshCcw, 
  Clock, 
  Calendar, 
  Search,
  AlertCircle,
  CheckCircle,
  Info,
  Filter,
  Download,
  ImageIcon,
  FileText,
  Link2,
  Trash2,
  BarChart3,
  PieChart,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { LogType } from "@/app/api/external/omnigateway/types/logs";
import { useImageLogs } from "@/hooks/useImageLogs";


export default function LogsContent() {
  const [currentTab, setCurrentTab] = useState("overview");
  
  // Filter and pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date()
  });
  
  // Selected session for detailed view
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [sessionLogs, setSessionLogs] = useState<any[]>([]);
  
  const router = useRouter();
  
  // Initialize the logs hook
  const { 
    isLoading,
    logs,
    totalItems,
    totalPages,
    stats,
    fetchLogs,
    fetchLogStats,
    getSessionLogs,
    isInitialized
  } = useImageLogs();

  // Fetch logs when component loads
  useEffect(() => {
    if (isInitialized) {
      fetchLogs({
        page,
        limit: pageSize,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        actionType: actionFilter !== 'all' ? actionFilter : undefined,
        startDate: dateRange?.from,
        endDate: dateRange?.to
      });
      
      // Also fetch stats
      fetchLogStats();
    }
  }, [isInitialized, fetchLogs, fetchLogStats, page, pageSize, typeFilter, actionFilter, dateRange]);

  // Refresh data
  const handleRefresh = () => {
    if (isInitialized) {
      fetchLogs({
        page,
        limit: pageSize,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        actionType: actionFilter !== 'all' ? actionFilter : undefined,
        startDate: dateRange?.from,
        endDate: dateRange?.to
      });
      fetchLogStats();
    }
  };

  // FIXED: View session details now ensures the tab is visible and active
  const handleViewSession = async (sessionId: string) => {
    if (isInitialized) {
      try {
        // First, get the session logs
        const logs = await getSessionLogs(sessionId);
        
        // Then update state and set the tab all at once to avoid React batching issues
        setSessionLogs(logs);
        setSelectedSession(sessionId);
        
        // Force change to session tab - must happen in this sequence
        // to ensure the tab is active when it becomes visible
        setTimeout(() => {
          // Force React to render by using a new state update in the next tick
          setCurrentTab("session");
        }, 10);
      } catch (error) {
        console.error("Error fetching session logs:", error);
        toast.error("Failed to fetch session logs");
      }
    }
  };

  // Close session view
  const handleCloseSessionView = () => {
    setSelectedSession(null);
    setSessionLogs([]);
    setCurrentTab("logs");
  };

  // Format date
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format date with time
  const formatDateTime = (date: string | Date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get badge variant based on log type
  const getLogTypeBadgeVariant = (type: LogType) => {
    switch (type) {
      case LogType.SUCCESS:
        return "success";
      case LogType.ERROR:
        return "destructive";
      case LogType.INFO:
      default:
        return "outline";
    }
  };

  // Get icon based on log type
  const getLogTypeIcon = (type: LogType) => {
    switch (type) {
      case LogType.SUCCESS:
        return <CheckCircle className="mr-1 h-3 w-3" />;
      case LogType.ERROR:
        return <AlertCircle className="mr-1 h-3 w-3" />;
      case LogType.INFO:
      default:
        return <Info className="mr-1 h-3 w-3" />;
    }
  };

  // Get icon based on action type
  const getActionTypeIcon = (actionType: string) => {
    switch (actionType) {
      case 'FORM_SUBMISSION':
        return <FileText className="mr-1 h-3 w-3" />;
      case 'IMAGE_GENERATION_SUCCESS':
        return <ImageIcon className="mr-1 h-3 w-3" />;
      case 'IMAGE_GENERATION_ERROR':
        return <AlertCircle className="mr-1 h-3 w-3" />;
      case 'IMAGE_DOWNLOAD':
        return <Download className="mr-1 h-3 w-3" />;
      case 'IMAGE_LOAD_ERROR':
        return <AlertCircle className="mr-1 h-3 w-3" />;
      default:
        return <ActivityIcon className="mr-1 h-3 w-3" />;
    }
  };

  // Group logs by session ID for easier navigation
  const groupedLogs = useMemo(() => {
    const groups = new Map();
    logs.forEach(log => {
      if (!groups.has(log.sessionId)) {
        groups.set(log.sessionId, []);
      }
      groups.get(log.sessionId).push(log);
    });
    return groups;
  }, [logs]);

  // Prepare action type options for filter dropdown
  const actionTypeOptions = useMemo(() => {
    const actionTypes = new Set();
    logs.forEach(log => {
      if (log.actionType) {
        actionTypes.add(log.actionType);
      }
    });
    
    return [
      { value: "all", label: "All Actions" },
      ...Array.from(actionTypes).map(type => ({
        value: type as string,
        label: (type as string).replace(/_/g, ' ').split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ')
      }))
    ];
  }, [logs]);

  return (
    <div className="space-y-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">All PixelBreeze Logs</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Track and monitor the image generation process
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* IMPORTANT: Re-create the Tabs component on selectedSession change 
          by using a key to force React to completely re-render it.
          This ensures the tab state is reset when selectedSession changes. */}
      <Tabs 
        key={`tabs-${selectedSession ? 'with-session' : 'no-session'}`} 
        defaultValue={selectedSession ? "session" : "overview"} 
        onValueChange={setCurrentTab} 
        value={currentTab}
      >
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="logs">
            <ActivityIcon className="mr-2 h-4 w-4" />
            All Logs
          </TabsTrigger>
          {selectedSession && (
            <TabsTrigger value="session">
              <FileText className="mr-2 h-4 w-4" />
              Session Details
            </TabsTrigger>
          )}
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.total || 0}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Events tracked in the system
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Error Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.errorRate?.toFixed(1) || 0}%</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Percentage of logs with errors
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{groupedLogs.size}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Unique generation sessions
                </p>
              </CardContent>
            </Card>
          </div>


          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
              <CardDescription>
                Latest image generation sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : groupedLogs.size === 0 ? (
                <div className="text-center py-8">
                  <ActivityIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No Sessions Found</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                    No image generation sessions have been recorded yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Array.from(groupedLogs.entries()).slice(0, 5).map(([sessionId, logs]) => {
                    const firstLog = logs[0];
                    const hasErrors = logs.some(log => log.type === LogType.ERROR);
                    const completedSuccessfully = logs.some(log => log.actionType === 'IMAGE_GENERATION_SUCCESS');
                    const hasDownloaded = logs.some(log => log.actionType === 'IMAGE_DOWNLOAD');
                    
                    return (
                      <div key={sessionId} className="flex items-center justify-between border-b pb-4">
                        <div>
                          <p className="text-sm font-medium">Session: {sessionId}</p>
                          <p className="text-xs text-muted-foreground">
                            Started: {formatDateTime(firstLog.createdAt)}
                          </p>
                          <div className="flex items-center mt-1">
                            {hasErrors && (
                              <Badge variant="destructive" className="flex items-center mr-2">
                                <AlertCircle className="mr-1 h-3 w-3" />
                                Errors
                              </Badge>
                            )}
                            {completedSuccessfully && (
                              <Badge variant="success" className="flex items-center mr-2">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Generated
                              </Badge>
                            )}
                            {hasDownloaded && (
                              <Badge variant="outline" className="flex items-center">
                                <Download className="mr-1 h-3 w-3" />
                                Downloaded
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewSession(sessionId)}
                        >
                          View Details
                        </Button>
                      </div>
                    );
                  })}
                  
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs Tab Content */}
        <TabsContent value="logs">
          {/* Search and Filters */}
          <Card className="mb-6">
            <CardHeader>
              <div className="mb-0">
                <h3 className="font-medium">Filter Logs</h3>
                <p className="text-sm text-muted-foreground">
                  Search and filter through log entries
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-0 flex flex-col md:flex-row items-center gap-4">
                <div className="relative mt-2 flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs by message or session ID..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-36 mt-1">
                  <InputSelect
                    name="type"
                    label=""
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    options={[
                      { value: "all", label: "All Types" },
                      { value: LogType.INFO, label: "Info" },
                      { value: LogType.SUCCESS, label: "Success" },
                      { value: LogType.ERROR, label: "Error" }
                    ]}
                  />
                </div>
                <div className="w-48 mt-1">
                  <InputSelect
                    name="action"
                    label=""
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                    options={actionTypeOptions}
                  />
                </div>
                {/* <div className="mt-1">
                  <DatePickerWithRange 
                    date={dateRange} 
                    setDate={setDateRange} 
                  />
                  </div> */}
              </div>
            </CardContent>
          </Card>

          {/* Logs Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Session ID</TableHead>
                    <TableHead>Image ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <RefreshCcw className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center gap-3">
                          <ActivityIcon className="h-12 w-12 text-muted-foreground" />
                          <h3 className="text-lg font-medium">No Logs Found</h3>
                          <p className="text-sm text-muted-foreground max-w-sm text-center">
                            {searchTerm || typeFilter !== 'all' || actionFilter !== 'all' || dateRange
                              ? "No logs match your search criteria. Try adjusting your filters."
                              : "No image generation logs have been recorded yet."}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs
                      .filter(log => 
                        searchTerm === "" || 
                        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        log.sessionId.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((log) => (
                        <TableRow key={log._id}>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(log.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                {new Date(log.createdAt).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getLogTypeBadgeVariant(log.type)}>
                              {getLogTypeIcon(log.type)}
                              {log.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="flex items-center">
                              {getActionTypeIcon(log.actionType)}
                              {log.actionType?.replace(/_/g, ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{log.message}</div>
                            {log.details && (
                              <Button 
                                variant="link" 
                                className="p-0 h-auto text-xs text-muted-foreground hover:text-blue-500"
                                onClick={() => {
                                  toast.custom((t) => (
                                    <div 
                                      className={`${
                                        t.visible ? 'animate-enter' : 'animate-leave'
                                      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                                    >
                                      <div className="flex-1 w-0 p-4">
                                        <div className="flex items-start">
                                          <div className="ml-3 flex-1">
                                            <p className="text-sm font-medium text-gray-900">Log Details</p>
                                            <pre className="mt-1 text-xs text-gray-500 overflow-auto max-h-60">
                                              {JSON.stringify(log.details, null, 2)}
                                            </pre>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex border-l border-gray-200">
                                        <button
                                          onClick={() => toast.dismiss(t.id)}
                                          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
                                        >
                                          Close
                                        </button>
                                      </div>
                                    </div>
                                  ));
                                }}
                              >
                                View Details
                              </Button>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="link"
                              className="p-0 h-auto text-xs text-muted-foreground hover:text-blue-500"
                              onClick={() => handleViewSession(log.sessionId)}
                            >
                              {log.sessionId}
                            </Button>
                          </TableCell>
                          <TableCell>
                            {log.imageId ? (
                              <div className="text-xs">{log.imageId}</div>
                            ) : (
                              <span className="text-xs text-muted-foreground">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleViewSession(log.sessionId)}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {logs.length > 0 && (
                <div className="border-t px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                  <InputSelect
                      name="pageSize"
                      label=""
                      value={pageSize.toString()}
                      onChange={(e) => setPageSize(parseInt(e.target.value))}
                      options={[
                        { value: "10", label: "10 rows" },
                        { value: "20", label: "20 rows" },
                        { value: "50", label: "50 rows" }
                      ]}
                    />
                    
                    <div className="flex-1 flex items-center justify-center">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => setPage(p => Math.max(1, p - 1))}
                              disabled={page === 1} 
                            />
                          </PaginationItem>
                          
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
                            <PaginationItem key={i + 1}>
                              <PaginationLink
                                isActive={page === i + 1}
                                onClick={() => setPage(i + 1)}
                              >
                                {i + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}

                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                              disabled={page === totalPages}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>

                    <p className="text-sm text-muted-foreground min-w-[180px] text-right">
                      Showing <span className="font-medium">{logs.length}</span> of{" "}
                      <span className="font-medium">{totalItems}</span> logs
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Session Detail Tab Content */}
        <TabsContent value="session">
          {selectedSession && (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="pr-4 pl-4 pt-4">
                  <h3 className="text-lg font-medium">Session Detail: {selectedSession}</h3>
                  <p className="text-sm text-muted-foreground">
                    All logs for this image generation session
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCloseSessionView}
                >
                  Back to All Logs
                </Button>
              </div>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Session Timeline</CardTitle>
                  <CardDescription>
                    Chronological event sequence
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : sessionLogs.length === 0 ? (
                    <div className="text-center py-8">
                      <ActivityIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="mt-4 text-sm text-muted-foreground">No logs found for this session</p>
                    </div>
                  ) : (
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-2.5 top-0 bottom-0 w-px bg-gray-200"></div>
                      
                      {/* Timeline events */}
                      <div className="space-y-6">
                        {sessionLogs.map((log, index) => (
                          <div key={log._id} className="flex relative">
                            {/* Timeline dot */}
                            <div className={`w-5 h-5 rounded-full flex-shrink-0 z-10 ${
                              log.type === LogType.SUCCESS ? 'bg-green-500' : 
                              log.type === LogType.ERROR ? 'bg-red-500' : 'bg-blue-500'
                            }`}></div>
                            
                            {/* Content */}
                            <div className="ml-4">
                              <div className="flex items-center">
                                <p className="text-sm font-medium">
                                  {formatDateTime(log.createdAt)}
                                </p>
                                <Badge variant={getLogTypeBadgeVariant(log.type)} className="ml-2">
                                  {getLogTypeIcon(log.type)}
                                  {log.type}
                                </Badge>
                              </div>
                              
                              <p className="text-sm mt-1">{log.message}</p>
                              
                              {log.actionType && (
                                <Badge variant="outline" className="flex items-center mt-2 mb-2">
                                  {getActionTypeIcon(log.actionType)}
                                  {log.actionType?.replace(/_/g, ' ')}
                                </Badge>
                              )}
                              
                              {log.details && (
                                <Accordion type="single" collapsible className="mt-2">
                                  <AccordionItem value="details">
                                    <AccordionTrigger className="text-xs text-muted-foreground">
                                      View Details
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      <pre className="text-xs bg-slate-50 p-2 rounded-md overflow-auto max-h-60">
                                        {JSON.stringify(log.details, null, 2)}
                                      </pre>
                                    </AccordionContent>
                                  </AccordionItem>
                                </Accordion>
                              )}
                              
                              {log.imageId && (
                                <div className="text-xs mt-2">
                                  <span className="text-muted-foreground">Image ID: </span>
                                  {log.imageId}
                                </div>
                              )}
                              
                              {/* Show connectors between events except for the last one */}
                              {index < sessionLogs.length - 1 && (
                                <div className="border-l-2 border-dashed border-gray-200 h-6 ml-[-24px] mt-2"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Session Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Session Summary</CardTitle>
                  <CardDescription>
                    Overview of session activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : sessionLogs.length === 0 ? (
                    <div className="text-center py-8">
                      <ActivityIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="mt-4 text-sm text-muted-foreground">No data available</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Template Type */}
                      <div className="flex justify-between">
                        <div className="text-sm text-muted-foreground">Template Type:</div>
                        <div className="text-sm font-medium">
                          {sessionLogs.find(log => log.details?.template_type)?.details?.template_type || "Unknown"}
                        </div>
                      </div>
                      
                      {/* Start Time */}
                      <div className="flex justify-between">
                        <div className="text-sm text-muted-foreground">Started At:</div>
                        <div className="text-sm font-medium">
                          {formatDateTime(sessionLogs[0]?.createdAt)}
                        </div>
                      </div>
                      
                      {/* Duration */}
                      <div className="flex justify-between">
                        <div className="text-sm text-muted-foreground">Session Duration:</div>
                        <div className="text-sm font-medium">
                          {sessionLogs.length > 1 ? 
                            `${Math.round((new Date(sessionLogs[sessionLogs.length - 1].createdAt).getTime() - 
                              new Date(sessionLogs[0].createdAt).getTime()) / 1000)} seconds` : 
                            "N/A"}
                        </div>
                      </div>
                      
                      {/* Status */}
                      <div className="flex justify-between">
                        <div className="text-sm text-muted-foreground">Final Status:</div>
                        <div className="text-sm font-medium">
                          {sessionLogs.some(log => log.type === LogType.ERROR) ? (
                            <Badge variant="destructive" className="flex items-center">
                              <AlertCircle className="mr-1 h-3 w-3" />
                              Failed
                            </Badge>
                          ) : sessionLogs.some(log => log.actionType === 'IMAGE_DOWNLOAD') ? (
                            <Badge variant="success" className="flex items-center">
                              <Download className="mr-1 h-3 w-3" />
                              Downloaded
                            </Badge>
                          ) : sessionLogs.some(log => log.actionType === 'IMAGE_GENERATION_SUCCESS') ? (
                            <Badge variant="success" className="flex items-center">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Generated
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="flex items-center">
                              <Info className="mr-1 h-3 w-3" />
                              In Progress
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Total Events */}
                      <div className="flex justify-between">
                        <div className="text-sm text-muted-foreground">Total Events:</div>
                        <div className="text-sm font-medium">
                          {sessionLogs.length}
                        </div>
                      </div>
                      
                      {/* Error Count */}
                      <div className="flex justify-between">
                        <div className="text-sm text-muted-foreground">Error Count:</div>
                        <div className="text-sm font-medium">
                          {sessionLogs.filter(log => log.type === LogType.ERROR).length}
                        </div>
                      </div>
                      
                      {/* Image ID */}
                      {sessionLogs.some(log => log.imageId) && (
                        <div className="flex justify-between">
                          <div className="text-sm text-muted-foreground">Image ID:</div>
                          <div className="text-sm font-medium">
                            {sessionLogs.find(log => log.imageId)?.imageId}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Add bottom spacing */}
      <div className="h-4"></div>
    </div>
  );
}