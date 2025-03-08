// components/crm/social/social-profiles/AllSocialProfiles.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSocialProfiles } from "@/hooks/useSocialProfiles";
import { useOperatingEntities } from "@/hooks/useOperatingEntities";
import { Badge } from "@/components/ui/badge";
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
import {
  Users,
  Search,
  Link,
  Download,
  RefreshCcw,
  Plus,
  MoreHorizontal,
  Building,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Video
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";
import { SocialProfileForm } from "./SocialProfileForm";
import { SocialProfile, SocialProfileType } from "@/app/api/external/omnigateway/types/social-profiles";
import { DeleteConfirmDialog } from "@/components/crm/social/DeleteConfirmDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function AllSocialProfiles() {
  const {
    isLoading,
    socialProfiles,
    totalItems,
    totalPages,
    fetchSocialProfiles,
    createSocialProfile,
    updateSocialProfile,
    deleteSocialProfile
  } = useSocialProfiles();

  const { operatingEntities, fetchOperatingEntities } = useOperatingEntities();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [typeFilter, setTypeFilter] = useState("all");
  const [operatingEntityFilter, setOperatingEntityFilter] = useState("all");
  
  const [profileFormOpen, setProfileFormOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<SocialProfile | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<SocialProfile | null>(null);

  useEffect(() => {
    fetchOperatingEntities();
  }, [fetchOperatingEntities]);

  useEffect(() => {
    fetchSocialProfiles({
      page,
      limit: pageSize,
      type: typeFilter !== 'all' ? typeFilter : undefined,
      operatingEntityId: operatingEntityFilter !== 'all' ? operatingEntityFilter : undefined,
      search: searchTerm
    });
  }, [fetchSocialProfiles, page, pageSize, typeFilter, operatingEntityFilter, searchTerm]);

  const handleRefresh = () => {
    fetchSocialProfiles({
      page,
      limit: pageSize,
      type: typeFilter !== 'all' ? typeFilter : undefined,
      operatingEntityId: operatingEntityFilter !== 'all' ? operatingEntityFilter : undefined,
      search: searchTerm
    });
  };

  const handleCreateProfile = async (data) => {
    await createSocialProfile(data);
    handleRefresh();
  };

  const handleUpdateProfile = async (data) => {
    if (selectedProfile) {
      await updateSocialProfile(selectedProfile._id, data);
      handleRefresh();
    }
  };

  const handleDeleteProfile = async () => {
    if (profileToDelete) {
      await deleteSocialProfile(profileToDelete._id);
      setDeleteDialogOpen(false);
      setProfileToDelete(null);
      handleRefresh();
    }
  };

  const getTypeIcon = (type: SocialProfileType) => {
    switch (type) {
      case SocialProfileType.FACEBOOK:
        return <Facebook className="h-4 w-4" />;
      case SocialProfileType.INSTAGRAM:
        return <Instagram className="h-4 w-4" />;
      case SocialProfileType.TIKTOK:
        return <Video className="h-4 w-4" />;
      case SocialProfileType.TWITTER:
        return <Twitter className="h-4 w-4" />;
      case SocialProfileType.LINKEDIN:
        return <Linkedin className="h-4 w-4" />;
      case SocialProfileType.YOUTUBE:
        return <Youtube className="h-4 w-4" />;
      default:
        return <Link className="h-4 w-4" />;
    }
  };

  const getTypeName = (type: SocialProfileType) => {
    switch (type) {
      case SocialProfileType.FACEBOOK:
        return "Facebook";
      case SocialProfileType.INSTAGRAM:
        return "Instagram";
      case SocialProfileType.TIKTOK:
        return "TikTok";
      case SocialProfileType.TWITTER:
        return "Twitter";
      case SocialProfileType.LINKEDIN:
        return "LinkedIn";
      case SocialProfileType.YOUTUBE:
        return "YouTube";
      default:
        return "Other";
    }
  };

  const getOperatingEntityName = (id: string) => {
    const entity = operatingEntities.find(e => e._id === id);
    return entity ? entity.name : "Unknown";
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Social Profiles</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Manage your social media profiles
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={() => {
              setSelectedProfile(null);
              setProfileFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Profile
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="mb-0">
            <h3 className="font-medium">Filter Profiles</h3>
            <p className="text-sm text-muted-foreground">
              Search and filter through your social media profiles
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-0 flex flex-col md:flex-row items-center gap-4">
            <div className="relative mt-2 flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or username..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full mt-1 md:w-48">
              <InputSelect
                name="type"
                label=""
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Platforms" },
                  { value: SocialProfileType.FACEBOOK, label: "Facebook" },
                  { value: SocialProfileType.INSTAGRAM, label: "Instagram" },
                  { value: SocialProfileType.TIKTOK, label: "TikTok" },
                  { value: SocialProfileType.TWITTER, label: "Twitter" },
                  { value: SocialProfileType.LINKEDIN, label: "LinkedIn" },
                  { value: SocialProfileType.YOUTUBE, label: "YouTube" },
                  { value: SocialProfileType.OTHER, label: "Other" }
                ]}
              />
            </div>
            <div className="w-full md:w-60 mt-2">
              <InputSelect
                name="operatingEntity"
                label=""
                value={operatingEntityFilter}
                onChange={(e) => setOperatingEntityFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Operating Entities" },
                  ...operatingEntities.map(entity => ({
                    value: entity._id,
                    label: entity.name
                  }))
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profiles Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Operating Entity</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Created</TableHead>
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
              ) : !socialProfiles || socialProfiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <Users className="h-12 w-12 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No Social Profiles Found</h3>
                      <p className="text-sm text-muted-foreground max-w-sm text-center">
                        {searchTerm || typeFilter !== 'all' || operatingEntityFilter !== 'all'
                          ? "No profiles match your search criteria. Try adjusting your filters."
                          : "Start by adding a social media profile for your organization."}
                      </p>
                      {!searchTerm && typeFilter === 'all' && operatingEntityFilter === 'all' && (
                        <Button
                          className="mt-4"
                          onClick={() => {
                            setSelectedProfile(null);
                            setProfileFormOpen(true);
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Profile
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                socialProfiles.map((profile) => (
                  <TableRow key={profile._id}>
                    <TableCell>
                      <div className="font-medium">{profile.accountName}</div>
                    </TableCell>
                    <TableCell>{profile.username}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        {getTypeIcon(profile.type as SocialProfileType)}
                        {getTypeName(profile.type as SocialProfileType)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Building className="h-3.5 w-3.5 text-muted-foreground" />
                        {profile.operatingEntity ? profile.operatingEntity.name : getOperatingEntityName(profile.operatingEntityId)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {profile.url ? (
                        <a 
                          href={profile.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:underline"
                        >
                          <Link className="h-3.5 w-3.5 mr-1" />
                          Visit
                        </a>
                      ) : (
                        <span className="text-muted-foreground">No URL provided</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedProfile(profile);
                                setProfileFormOpen(true);
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            {profile.url && (
                              <DropdownMenuItem 
                                onClick={() => window.open(profile.url, '_blank')}
                              >
                                Visit Profile
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => {
                                setProfileToDelete(profile);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {socialProfiles && socialProfiles.length > 0 && (
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
                  Showing <span className="font-medium">{socialProfiles.length}</span> of{" "}
                  <span className="font-medium">{totalItems}</span> profiles
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

       {/* Modals */}
     <SocialProfileForm
       open={profileFormOpen}
       onClose={() => {
         setProfileFormOpen(false);
         setSelectedProfile(null);
       }}
       onSubmit={selectedProfile ? handleUpdateProfile : handleCreateProfile}
       initialData={selectedProfile ? {
         type: selectedProfile.type as SocialProfileType,
         accountName: selectedProfile.accountName,
         username: selectedProfile.username,
         url: selectedProfile.url,
         operatingEntityId: selectedProfile.operatingEntityId
       } : undefined}
       title={selectedProfile ? 'Edit Social Profile' : 'Add Social Profile'}
     />

     <DeleteConfirmDialog
       open={deleteDialogOpen}
       onClose={() => {
         setDeleteDialogOpen(false);
         setProfileToDelete(null);
       }}
       onConfirm={handleDeleteProfile}
       title="Delete Social Profile"
       description={`Are you sure you want to delete "${profileToDelete?.accountName}"? This action cannot be undone.`}
     />
   </div>
 );
}

export default AllSocialProfiles;