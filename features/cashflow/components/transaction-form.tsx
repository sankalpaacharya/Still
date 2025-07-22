"use client";
import React, { useState } from "react";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormDescription,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

export default function TransactionForm() {
  const form = useForm({
    defaultValues: {
      type: "",
    },
  });
  const [step, setStep] = useState(0);
  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="type"
        rules={{ maxLength: 5 }}
        render={({ field }) => (
          <FormItem className="flex">
            <FormLabel className="text-5xl font-bold">NPR</FormLabel>
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
                  fontSize: "4rem",
                  height: "5rem",
                  backgroundColor: "transparent",
                }}
                className="outline-none text-xl border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none bg-none"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
}
