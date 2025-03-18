// components/crm/citizens/ActiveReporters.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Search,
  RefreshCcw,
  Download,
  Users,
  User,
  MailIcon,
  PhoneIcon,
  CalendarCheck,
  FileTextIcon
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";
import { useCitizens } from "@/hooks/useCitizens";
import { Badge } from "@/components/ui/badge";

export function ActiveReporters() {
  const {
    isLoading,
    citizens,
    totalItems,
    currentPage,
    totalPages,
    fetchCitizens,
    isInitialized
  } = useCitizens('active');

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [minReports, setMinReports] = useState(2);

  useEffect(() => {
    if (isInitialized) {
      fetchCitizens({
        page,
        limit: pageSize,
        search: searchTerm,
        sortBy,
        sortOrder,
        minReports
      });
    }
  }, [fetchCitizens, page, pageSize, searchTerm, sortBy, sortOrder, minReports, isInitialized]);

  const handleRefresh = () => {
    if (isInitialized) {
      fetchCitizens({
        page,
        limit: pageSize,
        search: searchTerm,
        sortBy,
        sortOrder,
        minReports
      });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Active Reporters</h2>
          <p className="text-sm text-muted-foreground mt-2">
            View citizens who have submitted multiple reports
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
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="mb-0">
            <h3 className="font-medium">Search Active Reporters</h3>
            <p className="text-sm text-muted-foreground">
              Search through citizens with multiple active reports
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-0 flex items-center gap-4">
            <div className="relative mt-2 flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="mt-2 w-48">
              <InputSelect
                name="minReports"
                label=""
                value={minReports.toString()}
                onChange={(e) => setMinReports(parseInt(e.target.value))}
                options={[
                  { value: "2", label: "Min 2 Reports" },
                  { value: "3", label: "Min 3 Reports" },
                  { value: "5", label: "Min 5 Reports" },
                  { value: "10", label: "Min 10 Reports" }
                ]}
              />
            </div>
            <div className="mt-2">
              <InputSelect
                name="sortOrder"
                label=""
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                options={[
                  { value: "desc", label: "Newest First" },
                  { value: "asc", label: "Oldest First" }
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Reporters Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact Information</TableHead>
                <TableHead>Reports Count</TableHead>
                <TableHead>Registration</TableHead>
                <TableHead>Joined Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <RefreshCcw className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : !citizens || citizens.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <FileTextIcon className="h-12 w-12 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No Active Reporters Found</h3>
                      <p className="text-sm text-muted-foreground max-w-sm text-center">
                        {searchTerm
                          ? "No reporters match your search criteria. Try adjusting your filters."
                          : `There are no citizens with ${minReports} or more active reports.`}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                citizens.map((citizen) => (
                  <TableRow key={citizen._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-8 w-8 text-muted-foreground p-1.5 bg-muted rounded-full" />
                        <div>
                          <div className="font-medium">{citizen.name} {citizen.surname}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center text-sm">
                          <MailIcon className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                          <a href={`mailto:${citizen.email}`} className="text-blue-600 hover:underline">
                            {citizen.email}
                          </a>
                        </div>
                        {citizen.phone && (
                          <div className="flex items-center text-sm">
                            <PhoneIcon className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                            <a href={`tel:${citizen.phone}`} className="text-blue-600 hover:underline">
                              {citizen.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-primary text-primary-foreground">
                        <FileTextIcon className="h-3.5 w-3.5 mr-1.5" />
                        {citizen.reportCount || 0} Reports
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {citizen.registrationSource}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <CalendarCheck className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{formatDate(citizen.createdAt)}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
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
                Showing <span className="font-medium">{citizens?.length}</span> of{" "}
                <span className="font-medium">{totalItems}</span> reporters
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Add bottom spacing */}
      <div className="h-4"></div>
    </div>
  );
}

export default ActiveReporters;