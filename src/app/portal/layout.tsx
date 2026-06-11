import { PortalLayoutClient } from "@/components/layout/portal-layout-client";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const role = (session.user as any)?.role;

  return (
    <PortalLayoutClient role={role} user={session.user}>
      {children}
    </PortalLayoutClient>
  );
}
