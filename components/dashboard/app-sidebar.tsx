import * as React from "react";
import { NavMainWrapper } from "@/components/dashboard/nav-main-wrapper";
import { NavUserServer } from "@/components/dashboard/nav-user-server";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "./team-switcher";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <TeamSwitcher />
            </SidebarHeader>
            <SidebarContent>
                <NavMainWrapper />
            </SidebarContent>
            <SidebarFooter>
                <NavUserServer />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
