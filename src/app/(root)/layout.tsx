"use client";
import Sidebar from "@/components/Sidebar";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PageLoading from "./loading";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const session = useSession();
  console.log(session)

  useEffect(() => {
    if (session.status === "unauthenticated") {
        console.log("unauthenticated")
      window.location.pathname = "/login";
    } else if (session.status === "authenticated") setAuthenticated(true);
  }, [pathname, session]);
  return authenticated ? (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-4 overflow-auto">{children}</main>
    </div>
  ) : (
    <PageLoading />
  );
}
