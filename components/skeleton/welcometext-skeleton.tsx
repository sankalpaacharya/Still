import { Skeleton } from "@/components/ui/skeleton";

export function WelcomeTextSkeleton() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-[180px] rounded-md" />
        <span className="text-3xl animate-pulse">👋</span>
      </div>
      <Skeleton className="mt-2 h-4 w-[260px] rounded-md" />
    </div>
  );
}
