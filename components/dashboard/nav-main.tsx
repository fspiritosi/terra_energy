"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { clienteNavItems, operacionNavItems } from "./nav-config";

export function NavMain({ userType }: { userType: string }) {
    const items = userType === "cliente" ? clienteNavItems : operacionNavItems;
    const pathname = usePathname();

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild={!item.disabled}
                            tooltip={item.disabled ? `${item.title} (Próximamente)` : item.title}
                            isActive={pathname === item.url}
                            disabled={item.disabled}
                        >
                            {item.disabled ? (
                                <div className="flex items-center gap-2 opacity-50 cursor-not-allowed">
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </div>
                            ) : (
                                <Link href={item.url}>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            )}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
