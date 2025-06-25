import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Individual skeleton for a single expense group
export function ExpenseGroupSkeleton() {
  return (
    <div className="space-y-4">
      {/* Group Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Group name skeleton */}
          <Skeleton className="h-7 w-32" />
          {/* Badge skeleton */}
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="text-right">
          {/* Amount skeleton */}
          <Skeleton className="h-5 w-24" />
        </div>
      </div>

      {/* Table Container Skeleton */}
      <div className="bg-white w-full dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
        <div className="p-6">
          {/* Table Header Skeleton */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-700">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Table Rows Skeleton */}
          <div className="space-y-3 mt-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3"
              >
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DisplaySkeletonGroup() {
  return (
    <div className="space-y-8">
      {[...Array(3)].map((_, index) => (
        <ExpenseGroupSkeleton key={index} />
      ))}
    </div>
  );
}

// Alternative: More detailed skeleton matching your exact structure
export function DetailedDisplayTableSkeleton() {
  return (
    <div className="space-y-8">
      {[...Array(2)].map((_, groupIndex) => (
        <div key={groupIndex} className="space-y-4">
          {/* Group Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-6 w-24" /> {/* Group name */}
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800">
                <Skeleton className="h-3 w-16 rounded-full" />{" "}
                {/* Badge text */}
              </div>
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-20" /> {/* Group total */}
            </div>
          </div>

          {/* Expense Table */}
          <div className="bg-white w-full dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
            <div className="p-6 space-y-4">
              {/* Table content skeleton */}
              <div className="space-y-3">
                {[...Array(4)].map((_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3 last:border-b-0"
                  >
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" /> {/* Description */}
                      <Skeleton className="h-3 w-20" /> {/* Category */}
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-4 w-16" /> {/* Amount */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Compact skeleton for faster loading appearance
export function CompactDisplayTableSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="space-y-3">
          {/* Group header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Simplified table */}
          <div className="bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <div className="space-y-3">
              {[...Array(2)].map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex justify-between items-center"
                >
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
