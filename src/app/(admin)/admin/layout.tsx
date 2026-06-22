import { AdminSidebar } from "@/components/shared/admin-sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-surface">
      <AdminSidebar />
      <div className="ml-64 flex flex-col min-h-screen">
        <main className="flex-1 p-8 max-w-7xl">{children}</main>
      </div>
    </div>
  );
}
