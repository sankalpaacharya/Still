import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

const Loading = () => {
  return (
    <div className="min-h-screen  text-white p-6">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-3">
          <Skeleton className="h-10 w-48 mb-2 " />
          <Skeleton className="h-4 w-64 " />
        </div>

        {/* Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add New Account Card */}
        </div>

        {/* Optional: Additional skeleton cards for more accounts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[...Array(1)].map((_, index) => (
            <Card key={index} className=" 0">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Skeleton className="h-3 w-20 mb-2 " />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 " />
                      <Skeleton className="h-5 w-24 " />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-20  rounded-full" />
                </div>

                <div className="mb-4">
                  <Skeleton className="h-4 w-24 mb-2 " />
                  <Skeleton className="h-6 w-12 " />
                </div>

                <div>
                  <Skeleton className="h-3 w-16 mb-2 " />
                  <Skeleton className="h-8 w-20 " />
                </div>
              </CardContent>
            </Card>
          ))}
          <Card className="border-2 border-dashed border-gray-700 bg-transparent hover:border-gray-600 transition-colors cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[200px] text-gray-400">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Add New Account
              </h3>
              <p className="text-sm text-center">
                Track another financial account
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Loading;
