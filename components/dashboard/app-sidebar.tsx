import * as React from "react";
import { NavMainWrapper } from "@/components/dashboard/nav-main-wrapper";
import { NavUserServer } from "@/components/dashboard/nav-user-server";
import { TeamSwitcherWrapper } from "@/components/dashboard/team-switcher-wrapper";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <TeamSwitcherWrapper />
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
