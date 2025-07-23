"use client";
import React, { useState } from "react";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function TransactionForm() {
  const form = useForm({
    defaultValues: {
      type: "",
    },
  });
  const [step, setStep] = useState(0);

  return (
    <Form {...form}>
      <div className="h-full flex space-y-5 flex-col w-md">
        <div>
          <p className="text-lg mb flex gap-2 items-center">
            <ChevronLeft className="cursor-pointer" />
            Create Expense
          </p>
        </div>
        <div className="flex-grow border flex items-center justify-center">
          <FormField
            control={form.control}
            name="type"
            rules={{ maxLength: 5 }}
            render={({ field }) => (
              <div className="flex justify-center items-center">
                <FormItem className="flex gap-2 items-center">
                  <FormLabel className="text-5xl font-bold text-white flex-grow">
                    NPR
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      maxLength={5}
                      value={field.value}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d{0,5}$/.test(value)) {
                          field.onChange(value);
                        }
                      }}
                      style={{
                        backgroundColor: "transparent",
                        width: "200px",
                        fontSize: "3rem",
                        height: "auto",
                      }}
                      className="leading-8 font-bold  w-auto min-w-[2ch] max-w-[6ch] text-white outline-0 bg-transparent border-none text-center focus:outline-none focus:ring-0 focus-visible:ring-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
            )}
          />
        </div>
        <div>
          <Button className="w-full" variant={"secondary"}>
            Next
          </Button>
        </div>
      </div>
    </Form>
  );
}
