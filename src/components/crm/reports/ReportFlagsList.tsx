import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  RefreshCcw, 
  CheckCircle, 
  XCircle, 
  Flag, 
  MoreHorizontal 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminReports } from "@/hooks/useAdminReports";
import { FlagStatus, FlagReason, ReportFlag } from "@/app/api/external/omnigateway/types/admin-reports";
import UpdateFlagStatusDialog from "./UpdateFlagStatusDialog";
import toast from "react-hot-toast";

interface ReportFlagsListProps {
  reportId: string;
  onRefreshNeeded?: () => void;
}

export function ReportFlagsList({ reportId, onRefreshNeeded }: ReportFlagsListProps) {
  const [flags, setFlags] = useState<ReportFlag[]>([]);
  const [selectedFlag, setSelectedFlag] = useState<ReportFlag | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isLoading: apiLoading, getReportFlags, updateFlagStatus, isInitialized } = useAdminReports();

  useEffect(() => {
    if (reportId && isInitialized) {
      fetchFlags();
    }
  }, [reportId, isInitialized]);

  const fetchFlags = async () => {
    if (!reportId) return;
    
    console.log("Fetching flags for reportId:", reportId);
    setLoading(true);
    
    try {
      // Use the admin flags endpoint instead of the regular one
      const response = await getReportFlags(reportId, true); // Use true flag to indicate admin view
      console.log("Flags response:", response);
      setFlags(response.data || []);
    } catch (error) {
      console.error("Error fetching flags:", error);
      toast.error("Failed to load flags");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status: FlagStatus) => {
    if (!selectedFlag) return false;
    
    const success = await updateFlagStatus(reportId, selectedFlag.id, status);
    
    if (success) {
      fetchFlags();
      setStatusDialogOpen(false);
      setSelectedFlag(null);
      
      if (onRefreshNeeded) {
        onRefreshNeeded();
      }
      
      toast.success(`Flag ${status === FlagStatus.REVIEWED ? 'marked as reviewed' : 'dismissed'} successfully`);
    }
    
    return success;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case FlagStatus.PENDING:
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600">Pending</Badge>;
      case FlagStatus.REVIEWED:
        return <Badge variant="outline" className="bg-green-500/10 text-green-600">Reviewed</Badge>;
      case FlagStatus.DISMISSED:
        return <Badge variant="outline" className="bg-red-500/10 text-red-600">Dismissed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getReasonBadge = (reason: string) => {
    const colors: { [key: string]: string } = {
      [FlagReason.INAPPROPRIATE]: "bg-red-100 text-red-700",
      [FlagReason.SPAM]: "bg-orange-100 text-orange-700",
      [FlagReason.MISINFORMATION]: "bg-yellow-100 text-yellow-700",
      [FlagReason.DUPLICATE]: "bg-blue-100 text-blue-700",
      [FlagReason.OTHER]: "bg-gray-100 text-gray-700",
    };
    
    const colorClass = colors[reason] || "bg-gray-100 text-gray-700";
    
    return (
      <Badge variant="secondary" className={`${colorClass}`}>
        {reason.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    );
  };

  const isLoadingFlags = loading || apiLoading;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">Flags</CardTitle>
          <Button variant="outline" size="sm" onClick={fetchFlags} disabled={isLoadingFlags}>
            <RefreshCcw className={`mr-2 h-4 w-4 ${isLoadingFlags ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {isLoadingFlags ? (
            <div className="flex justify-center py-8">
              <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : flags.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Flag className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No Flags Yet</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                This report hasn't been flagged by any users.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reason</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flags.map((flag) => (
                  <TableRow key={flag.id}>
                    <TableCell>{getReasonBadge(flag.reason)}</TableCell>
                    <TableCell className="max-w-xs truncate">{flag.comment || "—"}</TableCell>
                    <TableCell>
                      {flag.user ? (
                        <span>{flag.user.name || flag.user.email}</span>
                      ) : (
                        <span className="text-muted-foreground">Anonymous</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(flag.status)}</TableCell>
                    <TableCell>{formatDate(flag.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {flag.status !== FlagStatus.REVIEWED && (
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedFlag(flag);
                                setStatusDialogOpen(true);
                              }}
                              className="text-green-600"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark as Reviewed
                            </DropdownMenuItem>
                          )}
                          {flag.status !== FlagStatus.DISMISSED && (
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedFlag(flag);
                                setStatusDialogOpen(true);
                              }}
                              className="text-red-600"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Dismiss Flag
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Status Update Dialog */}
      {selectedFlag && (
        <UpdateFlagStatusDialog
          open={statusDialogOpen}
          onClose={() => {
            setStatusDialogOpen(false);
            setSelectedFlag(null);
          }}
          onStatusChange={handleStatusChange}
          currentStatus={selectedFlag.status}
          flagReason={selectedFlag.reason}
          flagComment={selectedFlag.comment}
        />
      )}
    </>
  );
}

export default ReportFlagsList;