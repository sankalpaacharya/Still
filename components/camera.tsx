"use client";
import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { Camera, RotateCcw, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { addExpenseAction } from "@/features/dashboard/actions";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CategoryGroupCombobox } from "@/features/dashboard/components/addexpenseselect";
import { AccountSelect } from "@/features/dashboard/components/account-select";
import { dataURLtoBlob } from "@/lib/utils";
import toast from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";
import { uploadImageSnap } from "@/lib/image-utils";

type CategoryChange = {
  categoryID: string;
};

export default function SnapUpload() {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [hasCaptured, sethasCaptured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [category, setCategory] = useState("");
  const [categoryGroup, setCategoryGroup] = useState("");
  const [account, setAccount] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<unknown>();
  const [CategoryChange, setCategoryChange] = useState<CategoryChange>({
    categoryID: "",
  });

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
      const file = new File([blob], "capture.png", { type: "image/png" });

      const data = await uploadImageSnap(file);

      console.log("Upload successful:", data);
      setAmount(data["amount"] || 0);
      setName(data["title"] || "");
      setIsLoading(false);
      setCategory(data["category"]);
      setCategoryGroup(data["categoryGroup"]);
      setCategoryChange({ categoryID: data["categoryID"] });
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

      const data = await uploadImageSnap(file);

      console.log("Upload successful:", data);
      setAmount(data["amount"] || 0);
      setName(data["title"] || "");
      setIsLoading(false);
      setCategory(data["category"]);
      setCategoryGroup(data["categoryGroup"]);
      setCategoryChange({ categoryID: data["categoryID"] });
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
    setName("");
    setAmount(0);
    setCategory("");
    setCategoryGroup("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please enter a name");
      return;
    }

    if (amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!category) {
      toast.error("Please select a category");
      return;
    }

    const result = await addExpenseAction({
      amount: amount,
      description: name,
      category: category,
      categoryGroup: categoryGroup,
      categoryId: CategoryChange.categoryID,
      accountID: account,
      type: "expense",
    });
    if (result?.error) return toast.error(result.message);
    setIsOpen(false);
    return toast.success(result.message);
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
              <p className="text-sm font-medium truncate">Receipt captured</p>
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

        {!isLoading && !isUploading && (
          <Card>
            <CardContent className="space-y-3 pt-6">
              <div className="grid w-full items-center gap-3">
                <Label htmlFor="expense-name">Description</Label>
                <Input
                  type="text"
                  id="expense-name"
                  placeholder="Description"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid w-full items-center gap-3">
                <Label htmlFor="expense-amount">Amount</Label>
                <Input
                  type="number"
                  id="expense-amount"
                  placeholder="0.00"
                  value={amount || ""}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="grid w-full items-center gap-3">
                <Label htmlFor="expense-category">Category</Label>
                <CategoryGroupCombobox
                  selectedCategory={category}
                  setSelectedCategory={setCategory}
                  setCategoryGroup={setCategoryGroup}
                  onChange={setCategoryChange}
                />
              </div>
              <div className="grid w-full items-center gap-3">
                <Label htmlFor="expense-category">Account</Label>
                <AccountSelect selected={account} setSelected={setAccount} />
              </div>
            </CardContent>
            <CardFooter className="flex">
              <Button onClick={handleSave} className="w-full">
                Save Expense
              </Button>
            </CardFooter>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}
