"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { clienteNavItems, operacionNavItems, NavItem } from "./nav-config";

function NavItemComponent({ item, pathname }: { item: NavItem; pathname: string }) {
    // Si el item tiene subitems, renderizar como colapsible
    if (item.items && item.items.length > 0) {
        // Verificar si algún subitem está activo para abrir por defecto
        const hasActiveSubitem = item.items.some(subItem => subItem.url === pathname);

        return (
            <Collapsible
                defaultOpen={hasActiveSubitem}
                className="group/collapsible"
            >
                <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                            tooltip={item.disabled ? `${item.title} (Próximamente)` : item.title}
                            disabled={item.disabled}
                        >
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenuSub>
                            {item.items.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton
                                        asChild={!subItem.disabled}
                                        isActive={pathname === subItem.url}
                                    >
                                        {subItem.disabled ? (
                                            <div className="flex items-center gap-2 opacity-50 cursor-not-allowed">
                                                {subItem.icon && <subItem.icon />}
                                                <span>{subItem.title}</span>
                                            </div>
                                        ) : (
                                            <Link href={subItem.url!}>
                                                {subItem.icon && <subItem.icon />}
                                                <span>{subItem.title}</span>
                                            </Link>
                                        )}
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            ))}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>
        );
    }

    // Item simple sin subitems
    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild={!item.disabled}
                tooltip={item.disabled ? `${item.title} (Próximamente)` : item.title}
                isActive={pathname === item.url}
            >
                {item.disabled ? (
                    <div className="flex items-center gap-2 opacity-50 cursor-not-allowed">
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                    </div>
                ) : (
                    <Link href={item.url!}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                    </Link>
                )}
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

export function NavMain({ userType }: { userType: string }) {
    const items = userType === "cliente" ? clienteNavItems : operacionNavItems;
    const pathname = usePathname();

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <NavItemComponent key={item.title} item={item} pathname={pathname} />
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
