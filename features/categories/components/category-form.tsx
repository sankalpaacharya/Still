"use client";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  Form,
  FormField,
  FormControl,
  FormDescription,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
} from "@/components/ui/emoji-picker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { HslStringColorPicker } from "react-colorful";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export enum CategoryType {
  Income = "income",
  Expense = "expense",
}

const categoryFormSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be atleast 2 characters.",
  }),
  color: z.string().min(1, {
    message: "Please pick a color.",
  }),
  budget: z.number().min(100).max(6000),
  icon: z.string().min(1, {
    message: "Please pick an emoji.",
  }),
});

export type CategoryFormType = z.infer<typeof categoryFormSchema>;

type Props = {
  onFormSubmit: (data: any, id: string) => { error: boolean; message: string };
  defaultValues: CategoryFormType;
  className?: string;
  id?: string;
  type: string;
  closeSheet: Dispatch<SetStateAction<boolean>>;
  setWatchValues: Dispatch<
    SetStateAction<Partial<CategoryFormType> | undefined>
  >;
};

export default function CategoryForm({
  onFormSubmit,
  defaultValues,
  className,
  id,
  closeSheet,
  type,
  setWatchValues,
}: Props) {
  const form = useForm({
    resolver: zodResolver(categoryFormSchema),
    defaultValues,
  });

  useEffect(() => {
    console.log("is there some error", form.formState.errors);
  }, [form.formState.errors]);

  const watchedValues = useWatch({ control: form.control });

  useEffect(() => {
    setWatchValues(watchedValues);
  }, [watchedValues, setWatchValues]);

  const submitCategoryForm = async (data: CategoryFormType) => {
    console.log("form is okay");
    const result = await onFormSubmit(data, id || "");
    if (result.error) {
      return toast.error(result.message);
    }
    closeSheet(false);
    return toast.success(result.message);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => submitCategoryForm(data))}
        className={cn("space-y-6 w-2xl", className)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Food & Dining, Transportation"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Choose a descriptive name for your category
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Budget */}
        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    type="number"
                    placeholder="1500"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="pl-8"
                  />
                </div>
              </FormControl>
              <FormDescription>
                Set your budget limit (₹100 - ₹6,000)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <HslStringColorPicker
                        color={field.value}
                        onChange={field.onChange}
                        className="!w-48 !h-48"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: field.value }}
                      />
                      <Input
                        value={field.value}
                        onChange={field.onChange}
                        className="font-mono text-sm"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </FormControl>
                <FormDescription>Pick a category color</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem className="border">
                <FormLabel>Icon</FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    <EmojiPicker
                      className="h-[200px] rounded-lg border"
                      onClick={(e) => e.preventDefault()}
                      onEmojiSelect={({ emoji }) => field.onChange(emoji)}
                    >
                      <EmojiPickerSearch />
                      <EmojiPickerContent className="w-full" />
                    </EmojiPicker>
                    {field.value && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-lg">{field.value}</span>
                        <span className="text-muted-foreground">
                          Selected emoji
                        </span>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Pick an emoji for this category
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button className="w-full">Submit</Button>
      </form>
    </Form>
  );
}
