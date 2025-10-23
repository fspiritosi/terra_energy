"use client";

import { LogOut, User, Sun, Moon, Laptop } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ProfileModal } from "@/components/profile";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { User as TypeUser } from "@supabase/supabase-js";

export function NavUser({
    user,
}: {
    user: TypeUser | null
}) {
    const { isMobile } = useSidebar();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/auth/login");
    };

    // Extraer datos del usuario con fallbacks seguros
    const userName = user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.email?.split('@')[0] ||
        'Usuario';

    const userEmail = user?.email || '';

    const userAvatar = user?.user_metadata?.avatar_url ||
        user?.user_metadata?.picture ||
        '';

    const getThemeIcon = () => {
        switch (theme) {
            case "light":
                return <Sun className="mr-2 h-4 w-4" />;
            case "dark":
                return <Moon className="mr-2 h-4 w-4" />;
            default:
                return <Laptop className="mr-2 h-4 w-4" />;
        }
    };

    const getThemeLabel = () => {
        switch (theme) {
            case "light":
                return "Claro";
            case "dark":
                return "Oscuro";
            default:
                return "Sistema";
        }
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={userAvatar} alt={userName} />
                                <AvatarFallback className="rounded-lg">
                                    {userName.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{userName}</span>
                                <span className="truncate text-xs">{userEmail}</span>
                            </div>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={userAvatar} alt={userName} />
                                    <AvatarFallback className="rounded-lg">
                                        {userName.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{userName}</span>
                                    <span className="truncate text-xs">{userEmail}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setIsProfileModalOpen(true)}>
                            <User />
                            Mi Cuenta
                        </DropdownMenuItem>

                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                {getThemeIcon()}
                                Tema ({getThemeLabel()})
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={() => setTheme("light")}>
                                    <Sun className="mr-2 h-4 w-4" />
                                    Claro
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("dark")}>
                                    <Moon className="mr-2 h-4 w-4" />
                                    Oscuro
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("system")}>
                                    <Laptop className="mr-2 h-4 w-4" />
                                    Sistema
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut />
                            Cerrar Sesión
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>

            <ProfileModal
                user={user}
                open={isProfileModalOpen}
                onOpenChange={setIsProfileModalOpen}
            />
        </SidebarMenu>
    );
}
