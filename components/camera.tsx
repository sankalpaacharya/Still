"use client";
import { EditWithAIButton } from "@/features/dashboard/components/edit-with-ai-button";
import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { Camera, RotateCcw, Upload, Edit, Trash2, Save } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  NewAddExpenseAction,
  renameImageFile,
} from "@/features/dashboard/actions";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { dataURLtoBlob } from "@/lib/utils";
import toast from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";
import { uploadImageSnap } from "@/features/dashboard/actions/image-utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type ExtractedItem = {
  name: string;
  amount: number;
  category: string;
  category_id: string;
  user_id: string;
  date: string;
  isEditing?: boolean;
  transactionId?: string;
};

type details = {
  amount: number;
  category: string;
  category_id: string;
  user_id: string;
  date: string;
};

interface transaction {
  amount: number;
  category: string;
  category_id: string;
  user_id: string;
  date: string;
}

interface transactionItem {
  [key: string]: transaction;
}

export default function SnapUpload() {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [hasCaptured, sethasCaptured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [extractedItems, setExtractedItems] = useState<ExtractedItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<unknown>();
  const [tempImageFilename, setTempImageFilename] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const getUser = async () => {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error getting user:", error);
        return;
      }
      setUser(data.user);
    };
    getUser();
  }, []);

  const capture = async () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (!screenshot) {
      toast.error("Failed to capture image");
      return;
    }
    setImage(screenshot);
    sethasCaptured(true);
    setIsUploading(true);

    try {
      const blob = dataURLtoBlob(screenshot);
      const tempFilename = `temp_${uuidv4()}`;
      const file = new File([blob], `${tempFilename}.png`, {
        type: "image/png",
      });
      setTempImageFilename(tempFilename);

      const data = await uploadImageSnap(file);

      console.log("Upload successful:", data);

      // Handle error case
      if (data.error) {
        toast.error(data.error);
        resetSnap();
        return;
      }

      // Convert the response data to ExtractedItem format
      const items: ExtractedItem[] = Object.entries(data).map(
        ([name, details]) => ({
          name,
          amount: (details as details).amount || 0,
          category: (details as details).category || "",
          category_id: (details as details).category_id || "",
          user_id: (details as details).user_id || "",
          date:
            (details as details).date || new Date().toISOString().split("T")[0],
          isEditing: false,
        }),
      );

      if (items.length === 0) {
        toast.error(
          "No items could be extracted from the image. Please try a clearer image.",
        );
        resetSnap();
        return;
      }

      setExtractedItems(items);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to upload image. Please try again.");
      resetSnap();
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setIsUploading(true);
    sethasCaptured(true);

    try {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);

      const tempFilename = `temp_${uuidv4()}`;
      const renamedFile = new File([file], `${tempFilename}.png`, {
        type: file.type,
      });
      setTempImageFilename(tempFilename);

      const data = await uploadImageSnap(renamedFile);

      console.log("Upload successful:", data);

      if (data.error) {
        toast.error(data.error);
        resetSnap();
        return;
      }

      const items: ExtractedItem[] = Object.entries(data).map(
        ([name, details]) => ({
          name,
          amount: (details as details).amount || 0,
          category: (details as details).category || "",
          category_id: (details as details).category_id || "",
          user_id: (details as details).user_id || "",
          date:
            (details as details).date || new Date().toISOString().split("T")[0],
          isEditing: false,
        }),
      );

      if (items.length === 0) {
        toast.error(
          "No items could be extracted from the image. Please try a clearer image.",
        );
        resetSnap();
        return;
      }

      setExtractedItems(items);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to upload image. Please try again.");
      resetSnap();
    } finally {
      setIsUploading(false);
    }
  };

  const resetSnap = () => {
    setImage(null);
    sethasCaptured(false);
    setIsLoading(true);
    setIsUploading(false);
    setExtractedItems([]);
    setTempImageFilename(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const toggleItemEditing = (index: number) => {
    setExtractedItems((items) =>
      items.map((item, i) =>
        i === index ? { ...item, isEditing: !item.isEditing } : item,
      ),
    );
  };

  const updateItem = (
    index: number,
    field: keyof Omit<ExtractedItem, "isEditing">,
    value: string | number,
  ) => {
    setExtractedItems((items) =>
      items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const deleteItem = (index: number) => {
    setExtractedItems((items) => items.filter((_, i) => i !== index));
  };

  const handleSaveAll = async () => {
    if (extractedItems.length === 0) {
      toast.error("No items to save");
      return;
    }

    try {
      for (let i = 0; i < extractedItems.length; i++) {
        const item = extractedItems[i];
        if (!item.name.trim()) {
          toast.error(`Item ${i + 1}: Name is required`);
          return;
        }
        if (item.amount <= 0) {
          toast.error(`Item ${i + 1}: Amount must be greater than 0`);
          return;
        }
      }

      const transactionData: transactionItem = {};
      extractedItems.forEach((item: ExtractedItem) => {
        transactionData[item.name] = {
          amount: item.amount,
          category_id: item.category_id,
          user_id: item.user_id,
          category: item.category,
          date: item.date,
        };
      });

      const result = await NewAddExpenseAction(transactionData);

      if (!result.error && result.data) {
        if (tempImageFilename && result.data.length > 0) {
          try {
            const firstTransactionId = result.data[0].id;
            await renameImageFile(tempImageFilename, firstTransactionId);
          } catch (renameError) {
            console.error("Failed to rename image:", renameError);
          }
        }

        toast.success(`Successfully saved ${extractedItems.length} expenses!`);
        resetSnap();
      } else {
        toast.error(result.message || "Failed to save expenses");
      }
    } catch (error) {
      console.error("Error saving expenses:", error);
      toast.error("Failed to save expenses. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          disabled={!user}
        >
          <Camera className="w-4 h-4" />
          Snap
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl overflow-y-scroll max-h-screen">
        <DialogTitle className="">📷 Snap</DialogTitle>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {image && (
          <div className="mt-4 bg-secondary p-3 rounded-lg flex gap-2">
            <img
              src={image}
              alt="Captured expense receipt"
              className="w-20 h-20 rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Image captured</p>
              <p className="text-xs text-muted-foreground">
                Details extracted automatically
              </p>
            </div>
          </div>
        )}

        {!hasCaptured && (
          <div className="relative">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              width={600}
              videoConstraints={{ facingMode: "environment" }}
              className="rounded-lg"
            />

            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-4 border-2 border-white/30 border-dashed rounded-lg"></div>
            </div>
          </div>
        )}

        <DialogFooter className="!justify-center gap-2">
          {hasCaptured && !isUploading && (
            <Button onClick={resetSnap} className="gap-2" variant={"secondary"}>
              <RotateCcw className="w-4 h-4" />
              Retake
            </Button>
          )}
          {!hasCaptured && (
            <>
              <Button
                onClick={capture}
                className="gap-2"
                disabled={isUploading || !user}
              >
                <Camera className="w-4 h-4" />
                {isUploading ? "Processing..." : "Capture"}
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
                variant="outline"
                disabled={isUploading || !user}
              >
                <Upload className="w-4 h-4" />
                Upload
              </Button>
            </>
          )}
        </DialogFooter>

        {isUploading && (
          <div className="flex items-center justify-center py-4">
            <div className="text-sm text-muted-foreground">
              Processing image...
            </div>
          </div>
        )}

        {!isLoading && !isUploading && extractedItems.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                Extracted Items ({extractedItems.length})
              </h3>
              <div className="flex gap-2">
                <EditWithAIButton
                  expenses={extractedItems}
                  onEdit={(editedExpenses) => setExtractedItems(editedExpenses)}
                />
                <Button
                  onClick={handleSaveAll}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save All
                </Button>
              </div>
            </div>

            <Accordion type="multiple" className="w-full">
              {extractedItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <div className="flex items-center justify-between w-full">
                    <AccordionTrigger className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-muted-foreground">
                          ₹{item.amount.toFixed(2)} - {item.category} -{" "}
                          {item.date}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <div className="flex items-center gap-2 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleItemEditing(index)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteItem(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <AccordionContent>
                    <div className="space-y-3 pt-3">
                      <div className="grid w-full items-center gap-3">
                        <Label htmlFor={`item-name-${index}`}>
                          Description
                        </Label>
                        <Input
                          type="text"
                          id={`item-name-${index}`}
                          placeholder="Description"
                          value={item.name}
                          onChange={(e) =>
                            updateItem(index, "name", e.target.value)
                          }
                          disabled={!item.isEditing}
                        />
                      </div>
                      <div className="grid w-full items-center gap-3">
                        <Label htmlFor={`item-amount-${index}`}>Amount</Label>
                        <Input
                          type="number"
                          id={`item-amount-${index}`}
                          placeholder="0.00"
                          value={item.amount || ""}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "amount",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          min="0"
                          step="0.01"
                          disabled={!item.isEditing}
                        />
                      </div>
                      <div className="grid w-full items-center gap-3">
                        <Label htmlFor={`item-category-${index}`}>
                          Category
                        </Label>
                        <Input
                          type="text"
                          id={`item-category-${index}`}
                          placeholder="Category"
                          value={item.category}
                          onChange={(e) =>
                            updateItem(index, "category", e.target.value)
                          }
                          disabled={!item.isEditing}
                        />
                      </div>
                      <div className="grid w-full items-center gap-3">
                        <Label htmlFor={`item-date-${index}`}>Date</Label>
                        <Input
                          type="date"
                          id={`item-date-${index}`}
                          value={item.date}
                          onChange={(e) =>
                            updateItem(index, "date", e.target.value)
                          }
                          disabled={!item.isEditing}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
