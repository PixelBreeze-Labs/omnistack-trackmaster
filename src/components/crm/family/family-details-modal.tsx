// components/family/family-details-modal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Users,
  Heart,
  Clock,
  ShoppingBag,
  MoreVertical,
  UserMinus,
  History,
  Settings,
  Loader2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useFamilyAccounts } from "@/hooks/useFamilyAccounts";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { toast } from "react-hot-toast";
import {FamilyMember } from "@/app/api/external/omnigateway/types/family-account";

interface FamilyDetailsModalProps {
  familyId: string;
  isOpen: boolean;
  onClose: () => void;
  onUnlinkMember: (memberId: string) => Promise<void>;
}

interface MemberCardProps {
  member: FamilyMember;
  onUnlink: (memberId: string) => void;
  isUnlinking: boolean;
}

const MemberCard = ({ member, onUnlink, isUnlinking }: MemberCardProps) => {
  const [showUnlinkConfirm, setShowUnlinkConfirm] = useState(false);

  return (
    <>
      <Card key={member.id}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={member.avatar} />
                <AvatarFallback>
                  {member.firstName[0]}{member.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">
                  {member.firstName} {member.lastName}
                </div>
                <div className="text-sm text-muted-foreground">
                  {member.relationship}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">
                    Joined {formatRelativeTime(new Date(member.joinDate))}
                  </Badge>
                  <Badge 
                    variant={member.status === 'ACTIVE' ? 'success' : 'secondary'}
                  >
                    {member.status}
                  </Badge>
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toast.error('Coming soon')}>
                  <History className="h-4 w-4 mr-2" />
                  View History
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.error('Coming soon')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Member
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={() => setShowUnlinkConfirm(true)}
                  disabled={isUnlinking}
                >
                  <UserMinus className="h-4 w-4 mr-2" />
                  {isUnlinking ? 'Unlinking...' : 'Unlink Member'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showUnlinkConfirm} onOpenChange={setShowUnlinkConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unlink Family Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unlink {member.firstName} {member.lastName} from this family account?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onUnlink(member.id);
                setShowUnlinkConfirm(false);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Unlink Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export function FamilyDetailsModal({
  familyId,
  isOpen,
  onClose,
  onUnlinkMember
}: FamilyDetailsModalProps) {
  const { 
    getFamilyDetails, 
    getFamilyStats, 
    selectedFamily, 
    familyStats, 
    isLoading 
  } = useFamilyAccounts();

  const [unlinkingMemberId, setUnlinkingMemberId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (isOpen && familyId) {
      getFamilyDetails(familyId);
      getFamilyStats(familyId);
    }
  }, [isOpen, familyId, getFamilyDetails, getFamilyStats]);

  const handleUnlinkMember = async (memberId: string) => {
    try {
      setUnlinkingMemberId(memberId);
      await onUnlinkMember(memberId);
      toast.success("Member unlinked successfully");
    } catch (error) {
      toast.error("Failed to unlink member");
    } finally {
      setUnlinkingMemberId(null);
    }
  };

  const handleClose = () => {
    setActiveTab("overview");
    onClose();
  };

  if (!selectedFamily || !familyStats) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Family Account Details</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">
              Members ({selectedFamily?.members?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="benefits">
              Benefits ({selectedFamily?.sharedBenefits?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="activity">
              Activity ({familyStats?.recentActivities?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-4">
              {/* Main Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Main Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedFamily.mainCustomerId?.avatar} />
                      <AvatarFallback>
                        {selectedFamily.mainCustomerId?.firstName[0]}
                        {selectedFamily.mainCustomerId?.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {selectedFamily.mainCustomerId?.firstName} {selectedFamily.mainCustomerId?.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedFamily.mainCustomerId?.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">Main Account</Badge>
                        <Badge 
                          variant={selectedFamily.status === 'ACTIVE' ? 'success' : 'secondary'}
                        >
                          {selectedFamily.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Spent</p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(familyStats.totalSpent)}
                        </p>
                      </div>
                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-muted-foreground">Members</p>
                        <p className="text-2xl font-bold">{familyStats.memberCount}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Family since {formatRelativeTime(new Date(familyStats.joinedDate))}
                        </p>
                      </div>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Benefits Usage */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Benefits Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  {familyStats.benefitsUsage.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No benefits usage yet
                    </div>
                  ) : (
                    <ScrollArea className="h-[200px]">
                      {familyStats.benefitsUsage.map((benefit, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-2 border-b last:border-0"
                        >
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{benefit.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Used {benefit.usageCount} times
                              </p>
                            </div>
                          </div>
                          <Badge variant={benefit.savings > 0 ? 'success' : 'outline'}>
                            {benefit.savings > 0 ? `Saved ${formatCurrency(benefit.savings)}` : 'No savings'}
                          </Badge>
                        </div>
                      ))}
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="members">
            <div className="space-y-4">
              {selectedFamily.members.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  onUnlink={handleUnlinkMember}
                  isUnlinking={unlinkingMemberId === member.id}
                />
              ))}

              {selectedFamily.members.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No family members yet
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="benefits">
            <Card>
              <CardContent className="p-4">
                {selectedFamily.sharedBenefits.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No shared benefits yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedFamily.sharedBenefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Heart className="h-5 w-5 text-red-500" />
                          <div>
                            <p className="font-medium">{benefit.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {benefit.description}
                            </p>
                          </div>
                        </div>
                        <Badge>Active</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardContent className="p-4">
                {familyStats.recentActivities.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent activities
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    {familyStats.recentActivities.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 py-4 border-b last:border-0"
                      >
                        <div className="mt-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                        <p className="font-medium">{activity.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-muted-foreground">
                              {formatRelativeTime(new Date(activity.date))}
                            </p>
                            <Badge variant="outline">{activity.type}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}