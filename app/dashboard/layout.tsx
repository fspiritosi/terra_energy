import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { PageHeader } from "@/components/dashboard/page-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider >
            <AppSidebar />
            <SidebarInset >
                <PageHeader />
                <div className="flex-1 overflow-auto p-4">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
