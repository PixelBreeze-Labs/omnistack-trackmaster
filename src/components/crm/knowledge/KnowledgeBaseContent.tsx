"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  FileText,
  MessageSquare,
  AlertCircle,
  BarChart2,
  Plus,
  RefreshCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import KnowledgeDocumentsList from "./KnowledgeDocumentsList";
import QueryResponsesList from "./QueryResponsesList";
import UnrecognizedQueriesList from "./UnrecognizedQueriesList";
import KnowledgeBaseStatistics from "./KnowledgeBaseStatistics";

export default function KnowledgeBaseContent() {
  const [activeTab, setActiveTab] = useState("documents");
  const router = useRouter();

  const handleNewDocument = () => {
    router.push("/crm/platform/knowledge/documents/new");
  };

  const handleNewQueryResponse = () => {
    router.push("/crm/platform/knowledge/query-responses/new");
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Knowledge Base Management</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Manage knowledge documents, query responses, and unrecognized queries
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === "documents" && (
            <Button onClick={handleNewDocument}>
              <Plus className="mr-2 h-4 w-4" />
              New Document
            </Button>
          )}
          {activeTab === "queries" && (
            <Button onClick={handleNewQueryResponse}>
              <Plus className="mr-2 h-4 w-4" />
              New Query-Response
            </Button>
          )}
          <Button variant="outline" size="icon" onClick={() => window.location.reload()}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="documents" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="documents">
            <FileText className="mr-2 h-4 w-4" />
            Knowledge Documents
          </TabsTrigger>
          <TabsTrigger value="queries">
            <MessageSquare className="mr-2 h-4 w-4" />
            Query Responses
          </TabsTrigger>
          <TabsTrigger value="unrecognized">
            <AlertCircle className="mr-2 h-4 w-4" />
            Unrecognized Queries
          </TabsTrigger>
          <TabsTrigger value="statistics">
            <BarChart2 className="mr-2 h-4 w-4" />
            Statistics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="mt-6">
          <KnowledgeDocumentsList />
        </TabsContent>

        <TabsContent value="queries" className="mt-6">
          <QueryResponsesList />
        </TabsContent>

        <TabsContent value="unrecognized" className="mt-6">
          <UnrecognizedQueriesList />
        </TabsContent>

        <TabsContent value="statistics" className="mt-6">
          <KnowledgeBaseStatistics />
        </TabsContent>
      </Tabs>
    </div>
  );
}