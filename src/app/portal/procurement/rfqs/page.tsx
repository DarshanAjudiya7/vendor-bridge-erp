import React from "react";
import { getRfqs } from "@/lib/actions/rfq";
import { RfqsClient } from "./_components/RfqsClient";

export default async function RFQsPage() {
  const rfqsList = await getRfqs();
  return <RfqsClient initialRfqs={rfqsList} />;
}
