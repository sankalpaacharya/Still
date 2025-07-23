"use client";
import React, { useState } from "react";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormItem,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TransactionForm() {
  const form = useForm({
    defaultValues: {
      type: "",
      description: "",
      category: "",
    },
  });
  const [step, setStep] = useState(1);

  const totalSteps = 3;

  function renderStep(step: number) {
    switch (step) {
      case 1:
        return (
          <FormField
            control={form.control}
            name="type"
            rules={{ maxLength: 5, required: "Amount is required" }}
            render={({ field }) => (
              <FormItem className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-3">
                  <FormLabel className="text-4xl font-bold text-white">
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
                      className="bg-transparent w-[200px] text-4xl font-bold text-white text-center border-b-2 border-white/30 focus:border-white/50 transition-colors duration-200 focus:outline-none focus:ring-0 placeholder:text-white/30"
                    />
                  </FormControl>
                </div>
                <FormMessage className="text-sm text-red-400" />
              </FormItem>
            )}
          />
        );

      case 2:
        return (
          <FormField
            control={form.control}
            name="description"
            rules={{ maxLength: 50, required: "Description is required" }}
            render={({ field }) => (
              <FormItem className="w-full max-w-md space-y-3">
                <FormLabel className="text-white text-lg font-medium">
                  Description
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Coffee at Starbucks"
                    {...field}
                    className="bg-white/5 border-white/10 text-white placeholder-white/40 rounded-md py-3 transition-all duration-200 focus:ring-2 focus:ring-white/30 focus:border-white/30"
                  />
                </FormControl>
                <FormDescription className="text-sm text-white/50">
                  Add a short note about your expense (max 50 characters).
                </FormDescription>
                <FormMessage className="text-sm text-red-400" />
              </FormItem>
            )}
          />
        );

      case 3:
        return (
          <FormField
            control={form.control}
            name="category"
            rules={{ required: "Category is required" }}
            render={({ field }) => (
              <FormItem className="w-full max-w-md space-y-3">
                <FormLabel className="text-white text-lg font-medium">
                  Category
                </FormLabel>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Transportation",
                    "Food & Dining",
                    "Bottle",
                    "Entertainment",
                  ].map((cat) => (
                    <Button
                      key={cat}
                      variant={field.value === cat ? "default" : "secondary"}
                      onClick={() => field.onChange(cat)}
                      className={`${
                        field.value === cat
                          ? "bg-white/20 text-white"
                          : "bg-white/10 text-white/80 hover:bg-white/20"
                      } py-6 transition-all duration-200`}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
                <FormDescription className="text-sm text-white/50">
                  Select a category for this expense
                </FormDescription>
                <FormMessage className="text-sm text-red-400" />
              </FormItem>
            )}
          />
        );

      default:
        return null;
    }
  }

  const handleNext = () => {
    if (step < totalSteps) {
      form.trigger().then((isValid) => {
        if (isValid) setStep((prev) => prev + 1);
      });
    } else {
      form.handleSubmit((data) => {
        console.log("Form submitted:", data);
        form.reset();
        setStep(1);
      })();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  return (
    <Form {...form}>
      <div className="h-full w-full max-w-xl mx-auto px-4 py-6 flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChevronLeft
              onClick={handleBack}
              className={`${
                step === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              } text-white w-6 h-6`}
            />
            <h1 className="text-white text-xl font-semibold">Create Expense</h1>
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i + 1 <= step ? "bg-white" : "bg-white/30"
                } transition-colors duration-200`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-grow flex items-center justify-center"
          >
            {renderStep(step)}
          </motion.div>
        </AnimatePresence>

        <div className="pt-4 flex gap-3">
          {step > 1 && (
            <Button
              onClick={handleBack}
              variant="outline"
              className="w-1/2 border-white/20 text-white hover:bg-white/10"
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="w-full text-white font-medium bg-white/20 hover:bg-white/30"
            variant="secondary"
          >
            {step === totalSteps ? (
              "Submit"
            ) : (
              <>
                Next <ChevronRight className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </Form>
  );
}
