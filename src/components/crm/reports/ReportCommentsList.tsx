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
  MessageSquare
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";
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
  const [loading, setLoading] = useState(true);
  const { isLoading: apiLoading, getReportComments, updateCommentStatus, deleteComment, isInitialized } = useAdminReports();

  useEffect(() => {
    if (reportId && isInitialized) {
      fetchComments();
    }
  }, [reportId, isInitialized]);

  const fetchComments = async () => {
    if (!reportId) return;
    
    console.log("Fetching comments for reportId:", reportId);
    setLoading(true);
    
    try {
      // Use the endpoint for admin comments instead of the normal one to see all comments
      const response = await getReportComments(reportId, true); // Use true flag to indicate admin view
      console.log("Comments response:", response);
      setComments(response.data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
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
      
      toast.success(`Comment ${status === CommentStatus.APPROVED ? 'approved' : 'rejected'} successfully`);
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
      
      toast.success("Comment deleted successfully");
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

  const isLoadingComments = loading || apiLoading;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">Comments</CardTitle>
          <Button variant="outline" size="sm" onClick={fetchComments} disabled={isLoadingComments}>
            <RefreshCcw className={`mr-2 h-4 w-4 ${isLoadingComments ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {isLoadingComments ? (
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
                    <TableCell>
                      <div className="flex justify-end">
                        <InputSelect
                          name={`comment-action-${comment.id}`}
                          label=""
                          value=""
                          onChange={(e) => {
                            switch(e.target.value) {
                              case "approve":
                                if (comment.status !== CommentStatus.APPROVED) {
                                  setSelectedComment(comment);
                                  setStatusDialogOpen(true);
                                }
                                break;
                              case "reject":
                                if (comment.status !== CommentStatus.REJECTED) {
                                  setSelectedComment(comment);
                                  setStatusDialogOpen(true);
                                }
                                break;
                            //   case "delete":
                            //     setSelectedComment(comment);
                            //     setDeleteDialogOpen(true);
                            //     break;
                            }
                          }}
                          options={[
                            { value: "", label: "Actions" },
                            ...(comment.status !== CommentStatus.APPROVED ? [{ value: "approve", label: "Approve" }] : []),
                            ...(comment.status !== CommentStatus.REJECTED ? [{ value: "reject", label: "Reject" }] : []),
                            // { value: "delete", label: "Delete" }
                          ]}
                        />
                      </div>
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