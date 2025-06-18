"use client";
import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Camera, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CategoryGroupCombobox } from "@/features/dashboard/components/addexpenseselect";
import { dataURLtoBlob } from "@/lib/utils";
import toast from "react-hot-toast";

export default function SnapUpload() {
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);
  const [hasCaptured, sethasCaptured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [category, setCategory] = useState("");
  const [categoryGroup, setCategoryGroup] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);

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
      const formData = new FormData();
      const blob = dataURLtoBlob(screenshot);
      formData.append("image", blob);
      formData.append("user_id", "123");

      const response = await fetch("http://localhost:8000/upload-snap", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        toast.error("Can't process the image");
        resetSnap();
        return;
      }

      console.log("Upload successful:", data);
      setAmount(data["amount"] || 0);
      setName(data["title"] || "");
      setIsLoading(false);
      setCategory(data["category"]);
      setCategoryGroup(data["categoryGroup"]);
    } catch (error) {
      console.error("Upload error:", error);
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
  };

  const handleSave = () => {
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

    console.log("Saving:", { name, amount, category, categoryGroup });
    toast.success("Expense saved successfully!");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Camera className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogTitle className="">📷 Snap</DialogTitle>

        {image && (
          <div className="mt-4">
            <img
              src={image}
              alt="Captured expense receipt"
              className="w-full rounded-lg"
            />
          </div>
        )}

        {!hasCaptured && (
          <div className="relative">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              width={500}
              videoConstraints={{ facingMode: "environment" }}
              className="rounded-lg"
            />

            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-4 border-2 border-white/30 border-dashed rounded-lg"></div>
            </div>
          </div>
        )}

        <DialogFooter className="!justify-center">
          {hasCaptured && !isUploading && (
            <Button onClick={resetSnap} className="gap-2" variant={"secondary"}>
              <RotateCcw className="w-4 h-4" />
              Retake
            </Button>
          )}
          {!hasCaptured && (
            <Button onClick={capture} className="gap-2" disabled={isUploading}>
              <Camera className="w-4 h-4" />
              {isUploading ? "Processing..." : "Capture"}
            </Button>
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
                <Label htmlFor="expense-name">Name</Label>
                <Input
                  type="text"
                  id="expense-name"
                  placeholder="Expense name"
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
                />
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
