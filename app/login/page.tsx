import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-primary/10 p-3 rounded-full">
              <span className="text-2xl">💸</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gradient">
            fixyourspend
          </CardTitle>
          <CardDescription className="mt-2">
            Track your spending, build better habits
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-center mb-6">
            <p className="text-muted-foreground">
              Sign in to track expenses, set budgets, and connect with friends
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-3 py-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 186.69 190.5"
            >
              <g transform="translate(1184.583 765.171)">
                <path
                  d="M-1089.333-687.239v36.888h51.262c-2.251 11.863-9.006 21.908-19.137 28.662l30.913 23.986c18.011-16.625 28.402-41.044 28.402-70.052 0-6.754-.606-13.249-1.732-19.483z"
                  fill="#4285f4"
                />
                <path
                  d="M-1142.714-651.791l-6.972 5.337-24.679 19.223h0c15.673 31.086 47.796 52.561 85.03 52.561 25.717 0 47.278-8.486 63.038-23.033l-30.913-23.986c-8.486 5.715-19.31 9.179-32.125 9.179-24.765 0-45.806-16.712-53.34-39.226z"
                  fill="#34a853"
                />
                <path
                  d="M-1174.365-712.61c-6.494 12.815-10.217 27.276-10.217 42.689s3.723 29.874 10.217 42.689c0 .086 31.695-24.592 31.695-24.592-1.905-5.715-3.031-11.776-3.031-18.098s1.126-12.383 3.031-18.098z"
                  fill="#fbbc05"
                />
                <path
                  d="M-1089.333-727.244c14.028 0 26.497 4.849 36.455 14.201l27.276-27.276c-16.539-15.413-38.013-24.852-63.731-24.852-37.234 0-69.359 21.388-85.032 52.561l31.692 24.592c7.533-22.514 28.575-39.226 53.34-39.226z"
                  fill="#ea4335"
                />
              </g>
            </svg>
            Continue with Google
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col text-center text-xs text-muted-foreground">
          <p>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
          <p className="mt-4">
            © {new Date().getFullYear()} fixyourspend. All rights reserved.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
