import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  return (
    <div className="min-h-screen text-white p-6">
      <div className="mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>

        {/* Category and Total Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-6 w-32" />
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-4 gap-4 mb-4 pb-2 border-b ">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Expense Rows */}
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-4 gap-4 items-center py-4 border-b "
            >
              {/* Date */}
              <Skeleton className="h-4 w-16" />

              {/* Description with icon */}
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full " />
                <Skeleton className="h-4 w-24 " />
              </div>

              {/* Category */}
              <Skeleton className="h-4 w-20 " />

              {/* Amount */}
              <div className="text-right">
                <Skeleton className="h-4 w-24 ml-auto" />
              </div>
            </div>
          ))}
        </div>

        {/* Loading more indicator */}
        <div className="mt-8 text-center">
          <Skeleton className="h-4 w-32  mx-auto" />
        </div>
      </div>
    </div>
  );
}
