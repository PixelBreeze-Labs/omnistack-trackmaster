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
  MessageSquare, 
  Trash2, 
  MoreHorizontal 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminReports } from "@/hooks/useAdminReports";
import { CommentStatus, ReportComment } from "@/app/api/external/omnigateway/types/admin-reports";
import UpdateCommentStatusDialog from "./UpdateCommentStatusDialog";
import DeleteCommentDialog from "./DeleteCommentDialog";
import toast from "react-hot-toast";

interface ReportCommentsListProps {
    reportId: string;
    onRefreshNeeded?: () => void;
  }
  
  export function ReportCommentsList({ reportId, onRefreshNeeded }: ReportCommentsListProps) {
    const [comments, setComments] = useState<ReportComment[]>([]);
    const [selectedComment, setSelectedComment] = useState<ReportComment | null>(null);
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const { isLoading, getReportComments, updateCommentStatus, deleteComment } = useAdminReports();
  
    useEffect(() => {
      if (reportId) {
        fetchComments();
      }
    }, [reportId]);
  
    const fetchComments = async () => {
      const response = await getReportComments(reportId);
      setComments(response.data || []);
    };
  
    const handleStatusChange = async (status: CommentStatus) => {
      if (!selectedComment) return false;
      
      const success = await updateCommentStatus(reportId, selectedComment.id, status);
      
      if (success) {
        fetchComments();
        setStatusDialogOpen(false);
        setSelectedComment(null);
        
        if (onRefreshNeeded) {
          onRefreshNeeded();
        }
      }
      
      return success;
    };
    
    const handleDelete = async () => {
      if (!selectedComment) return;
      
      const success = await deleteComment(reportId, selectedComment.id);
      
      if (success) {
        fetchComments();
        setDeleteDialogOpen(false);
        setSelectedComment(null);
        
        if (onRefreshNeeded) {
          onRefreshNeeded();
        }
      }
    };
  
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleString();
    };
  
    const getStatusBadge = (status: string) => {
      switch (status) {
        case CommentStatus.PENDING_REVIEW:
          return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600">Pending Review</Badge>;
        case CommentStatus.APPROVED:
          return <Badge variant="outline" className="bg-green-500/10 text-green-600">Approved</Badge>;
        case CommentStatus.REJECTED:
          return <Badge variant="outline" className="bg-red-500/10 text-red-600">Rejected</Badge>;
        default:
          return <Badge variant="outline">Unknown</Badge>;
      }
    };
  
    return (
      <>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">Comments</CardTitle>
            <Button variant="outline" size="sm" onClick={fetchComments} disabled={isLoading}>
              <RefreshCcw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No Comments Yet</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                  There are no comments on this report yet.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Comment</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comments.map((comment) => (
                    <TableRow key={comment.id}>
                      <TableCell className="max-w-xs truncate">{comment.content}</TableCell>
                      <TableCell>
                        {comment.author ? (
                          <span>{comment.author.name}</span>
                        ) : (
                          <span className="text-muted-foreground">Anonymous</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(comment.status)}</TableCell>
                      <TableCell>{formatDate(comment.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {comment.status !== CommentStatus.APPROVED && (
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedComment(comment);
                                  setStatusDialogOpen(true);
                                }}
                                className="text-green-600"
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                            )}
                            {comment.status !== CommentStatus.REJECTED && (
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedComment(comment);
                                  setStatusDialogOpen(true);
                                }}
                                className="text-amber-600"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedComment(comment);
                                setDeleteDialogOpen(true);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
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
        
        {/* Status Change Dialog */}
        {selectedComment && (
          <UpdateCommentStatusDialog
            open={statusDialogOpen}
            onClose={() => {
              setStatusDialogOpen(false);
              setSelectedComment(null);
            }}
            onStatusChange={handleStatusChange}
            currentStatus={selectedComment.status as CommentStatus}
            commentContent={selectedComment.content}
          />
        )}
        
        {/* Delete Dialog */}
        {selectedComment && (
          <DeleteCommentDialog
            open={deleteDialogOpen}
            onClose={() => {
              setDeleteDialogOpen(false);
              setSelectedComment(null);
            }}
            onConfirm={handleDelete}
            commentContent={selectedComment.content}
          />
        )}
      </>
    );
  }
  
  export default ReportCommentsList;