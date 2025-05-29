"use client";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useBudgetStore } from "@/lib/store";

type props = {
  setSelectedCategory: Dispatch<SetStateAction<string>>;
  setCategoryGroup: Dispatch<SetStateAction<string>>;
  selectedCategory: string;
};

export function CategoryGroupCombobox({
  selectedCategory,
  setSelectedCategory,
  setCategoryGroup,
}: props) {
  const [open, setOpen] = useState(false);
  const { groups } = useBudgetStore((state) => state);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCategory || "Select category..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search categories..." className="h-9" />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            {groups.map((group) => (
              <CommandGroup key={group.name} heading={group.name}>
                {group.categories.map((category) => (
                  <CommandItem
                    key={category.name}
                    value={category.name}
                    onSelect={(currentValue) => {
                      setSelectedCategory(
                        currentValue === selectedCategory ? "" : currentValue
                      );
                      setOpen(false);
                      setCategoryGroup(group.name);
                    }}
                  >
                    {category.name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedCategory === category.name
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
