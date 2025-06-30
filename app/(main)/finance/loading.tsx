import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="min-h-screen text-white p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-6 w-6 rounded" />
          <div>
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-6 w-6 rounded" />
        </div>

        <div className="text-center">
          <Skeleton className="h-4 w-24 mb-2 mx-auto" />
          <Skeleton className="h-8 w-32 mx-auto" />
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="relative">
            <Skeleton className="h-2 w-2 rounded-full" />
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main content */}
        <div className="flex-1 space-y-6">
          {/* Savings section */}
          <div className="border border-zinc-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-4 w-4" />
            </div>

            <div className="grid grid-cols-4 gap-4 mb-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-4 items-center">
                <Skeleton className="h-4 w-20" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-2 flex-1" />
                </div>
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          </div>

          {/* Needs section */}
          <div className="border border-zinc-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-5 w-12" />
              </div>
              <Skeleton className="h-4 w-4" />
            </div>

            <div className="grid grid-cols-4 gap-4 mb-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-4 items-center">
                <Skeleton className="h-4 w-8" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-2 flex-1" />
                </div>
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-12" />
              </div>

              <div className="grid grid-cols-4 gap-4 items-center">
                <Skeleton className="h-4 w-16" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-2 flex-1" />
                </div>
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          </div>

          <div className="border border-zinc-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-4 w-4" />
            </div>

            <div className="grid grid-cols-4 gap-4 mb-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-4 items-center">
                <Skeleton className="h-4 w-10" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-2 flex-1" />
                </div>
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <div className="w-80 space-y-6">
          <div className="border border-zinc-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-5 w-32" />
            </div>

            <div className="text-center mb-6">
              <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
              <Skeleton className="h-4 w-24 mx-auto mb-2" />
              <Skeleton className="h-3 w-40 mx-auto" />
            </div>

            <Skeleton className="h-10 w-full" />
          </div>

          <div className="p-4">
            <div className="flex items-start gap-2">
              <Skeleton className="h-4 w-4 rounded-full mt-0.5" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
