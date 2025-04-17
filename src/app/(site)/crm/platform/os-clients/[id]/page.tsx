"use client";

import { useParams } from "next/navigation";

import ClientDetailsContent from "@/components/crm/clients-management/ClientDetailsContent"

export default function ClientDetailsPage() {

  const params = useParams();

  const clientId = params.id as string;

  

  return (

    <div className="flex-1 space-y-4 px-3">

      <ClientDetailsContent clientId={clientId} />

    </div>

  );

}