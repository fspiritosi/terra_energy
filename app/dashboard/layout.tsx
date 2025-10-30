import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { PageHeader } from "@/components/dashboard/page-header";
import { PasswordAlertProvider } from "@/components/providers/password-alert-provider";
import { getCurrentUser } from "@/components/dashboard/user-actions";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = await getCurrentUser();

    return (
        <PasswordAlertProvider initialUser={user}>
            <SidebarProvider >
                <AppSidebar />
                <SidebarInset >
                    <PageHeader />
                    <div className="flex-1 overflow-auto p-4">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </PasswordAlertProvider>
    );
}
