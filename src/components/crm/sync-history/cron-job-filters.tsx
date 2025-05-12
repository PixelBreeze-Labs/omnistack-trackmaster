"use client";

import { useState } from "react";
import {
  Search,
  RefreshCcw,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import InputSelect from "@/components/Common/InputSelect";

interface CronJobFiltersProps {
  statusFilter: string;
  jobTypeFilter: string;
  businessFilter: string;
  onStatusChange: (value: string) => void;
  onJobTypeChange: (value: string) => void;
  onBusinessFilterChange: (value: string) => void;
  onSearch: () => void;
}

export default function CronJobFilters({
  statusFilter,
  jobTypeFilter,
  businessFilter,
  onStatusChange,
  onJobTypeChange,
  onBusinessFilterChange,
  onSearch
}: CronJobFiltersProps) {
  const [businessId, setBusinessId] = useState(businessFilter);

  const handleBusinessIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessId(e.target.value);
  };

  const handleSearch = () => {
    onBusinessFilterChange(businessId);
    onSearch();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearFilters = () => {
    onStatusChange("all");
    onJobTypeChange("all");
    setBusinessId("");
    onBusinessFilterChange("");
    onSearch();
  };

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by business ID"
              className="pl-8"
              value={businessId}
              onChange={handleBusinessIdChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="flex gap-2">
            <div className="w-36">
              <InputSelect
                name="status-filter"
                label=""
                value={statusFilter}
                onChange={onStatusChange}
                options={[
                  { value: "all", label: "All Statuses" },
                  { value: "completed", label: "Completed" },
                  { value: "failed", label: "Failed" },
                  { value: "started", label: "In Progress" }
                ]}
              />
            </div>
            <div className="w-48">
              <InputSelect
                name="job-type-filter"
                label=""
                value={jobTypeFilter}
                onChange={onJobTypeChange}
                options={[
                  { value: "all", label: "All Job Types" },
                  { value: "scheduledEmployeeSync", label: "Employee Sync" },
                  { value: "scheduledTaskSync", label: "Task Sync" },
                  { value: "processUnassignedTasks", label: "Process Unassigned Tasks" },
                  { value: "businessAutoAssign", label: "Business Auto Assignment" },
                  { value: "findOptimalAssigneeForVenueBoostTask", label: "Find Optimal Assignee" },
                  { value: "manuallyTriggeredAutoAssign", label: "Manual Auto Assignment" },
                  { value: "manuallyApproveAssignment", label: "Manual Approve Assignment" },
                  { value: "manuallyRejectAssignment", label: "Manual Reject Assignment" }
                ]}
              />
            </div>
            <Button onClick={handleSearch}>
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}