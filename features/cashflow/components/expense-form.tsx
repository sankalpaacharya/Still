"use client";
import React, { useEffect, useState } from "react";
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
import { addExpenseAction } from "../actions";
import { getAllCategories } from "@/features/categories/actions";
import toast from "react-hot-toast";
import { DatePicker } from "@/components/ui/date-picker";

export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  user_id: string;
}

export default function ExpenseForm({ onSubmit }: { onSubmit: () => any }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  useEffect(() => {
    const fetchCategories = async () => {
      const cats = await getAllCategories();
      setCategories(cats);
    };
    fetchCategories();
  }, []);
  const form = useForm({
    defaultValues: {
      amount: "",
      description: "",
      category: "",
      date: new Date(),
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
            name="amount"
            rules={{ required: "Amount is required" }}
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
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          field.value &&
                          field.value.length > 0
                        ) {
                          handleNext();
                        }
                      }}
                      style={{
                        fontSize: "3rem",
                        height: "auto",
                        backgroundColor: "transparent",
                      }}
                      autoFocus
                      className="bg-transparent w-[200px] text-4xl font-bold text-white text-center border-none focus:outline-none focus:ring-0 placeholder:text-white/30"
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
          <div className="flex flex-col space-y-10">
            <FormField
              control={form.control}
              name="description"
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <FormItem className="w-full max-w-md space-y-3">
                  <FormLabel className="text-white text-lg font-medium">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Input
                      autoFocus
                      placeholder="e.g. Coffee at Starbucks"
                      {...field}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          field.value &&
                          field.value.length > 0
                        ) {
                          handleNext();
                        }
                      }}
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
            <FormField
              control={form.control}
              name="date"
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <FormItem className="w-full max-w-md space-y-3">
                  <FormLabel className="text-white text-lg font-medium">
                    Date
                  </FormLabel>
                  <FormControl>
                    <DatePicker date={field.value} setDate={field.onChange} />
                  </FormControl>
                  <FormDescription className="text-sm text-white/50">
                    Date of your expense
                  </FormDescription>
                  <FormMessage className="text-sm text-red-400" />
                </FormItem>
              )}
            />
          </div>
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
                  {categories.map((cat) => (
                    <Button
                      key={cat.id}
                      variant={field.value === cat.id ? "default" : "secondary"}
                      onClick={() => field.onChange(cat.id)}
                      className={`py-6 transition-all duration-200`}
                    >
                      {cat.name}
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

  const validateCurrentStep = () => {
    const values = form.getValues();

    switch (step) {
      case 1:
        return values.amount && values.amount.length > 0;
      case 2:
        return values.description && values.description.length > 0;
      case 3:
        return values.category && values.category.length > 0;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (step < totalSteps) {
      if (validateCurrentStep()) {
        setStep((prev) => prev + 1);
      } else {
        const currentField =
          step === 1 ? "amount" : step === 2 ? "description" : "category";
        form.trigger(currentField);
      }
    } else {
      form.handleSubmit(async (data: any) => {
        setButtonDisabled(true);
        const response = await addExpenseAction(data);
        if (response.error) toast.error(response.message);
        if (!response.error) toast.success(response.message);
        setButtonDisabled(false);
        onSubmit();
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
            disabled={isButtonDisabled}
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
