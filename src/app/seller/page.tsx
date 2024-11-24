import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import SellerDashboard from "./_components/SellerDashboard";

async function SellerPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }
  return <SellerDashboard />;
}

export default SellerPage;
