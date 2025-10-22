"use client";

import { NavMain } from "./nav-main";
import { useUserType } from "@/hooks/use-user-type";
import { Skeleton } from "@/components/ui/skeleton";

export function NavMainWrapper() {
    const { userType, loading } = useUserType();

    if (loading) {
        return (
            <div className="space-y-2 p-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
        );
    }

    return <NavMain userType={userType} />;
}