"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    // Redirigir si se requiere admin y no lo es
    if (adminOnly && session?.user?.role !== "admin") {
      router.push("/");
    }
  }, [session, status, router, adminOnly]);

  if (status === "loading") return <div>Cargando...</div>;

  return <>{children}</>;
}