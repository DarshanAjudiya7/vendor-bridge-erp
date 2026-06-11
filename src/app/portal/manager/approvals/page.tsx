import React from "react";
import { getApprovals } from "@/lib/actions/approval";
import { ApprovalsClient } from "./_components/ApprovalsClient";

export default async function ApprovalsPage() {
  const approvalsList = await getApprovals();

  return <ApprovalsClient initialApprovals={approvalsList} />;
}
