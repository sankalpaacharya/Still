import { Skeleton } from "@/components/ui/skeleton";

export default function ExpensesSkeleton() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <Skeleton className="h-8 w-32 mb-2 bg-gray-800" />
          <Skeleton className="h-4 w-48 bg-gray-800" />
        </div>

        {/* Category and Total Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-16 bg-gray-800" />
            <Skeleton className="h-6 w-20 rounded-full bg-gray-800" />
          </div>
          <Skeleton className="h-6 w-32 bg-gray-800" />
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-4 gap-4 mb-4 pb-2 border-b border-gray-800">
          <Skeleton className="h-4 w-12 bg-gray-800" />
          <Skeleton className="h-4 w-24 bg-gray-800" />
          <Skeleton className="h-4 w-20 bg-gray-800" />
          <Skeleton className="h-4 w-16 bg-gray-800" />
        </div>

        {/* Expense Rows */}
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-4 gap-4 items-center py-4 border-b border-gray-900/50"
            >
              {/* Date */}
              <Skeleton className="h-4 w-16 bg-gray-800" />

              {/* Description with icon */}
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full bg-blue-600/20" />
                <Skeleton className="h-4 w-24 bg-gray-800" />
              </div>

              {/* Category */}
              <Skeleton className="h-4 w-20 bg-gray-800" />

              {/* Amount */}
              <div className="text-right">
                <Skeleton className="h-4 w-24 bg-gray-800 ml-auto" />
              </div>
            </div>
          ))}
        </div>

        {/* Loading more indicator */}
        <div className="mt-8 text-center">
          <Skeleton className="h-4 w-32 bg-gray-800 mx-auto" />
        </div>
      </div>
    </div>
  );
}
