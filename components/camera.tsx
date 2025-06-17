"use client";
import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Camera, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CategoryGroupCombobox } from "@/features/dashboard/components/addexpenseselect";

export default function SnapUpload() {
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);
  const [hasCaptured, sethasCaptured] = useState(false);
  const [category, setCategory] = useState("");
  const [categoryGroup, setCategoryGroup] = useState("");

  const capture = async () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (!screenshot) return;
    setImage(screenshot);
    sethasCaptured(true);
  };

  const resetSnap = () => {
    setImage(null);
    sethasCaptured(false);
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
            <img src={image} alt="Captured" className="w-full rounded-lg" />
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
          {hasCaptured && (
            <Button onClick={resetSnap} className="gap-2" variant={"secondary"}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
          {!hasCaptured && (
            <Button onClick={capture} className="gap-2">
              <Camera className="w-4 h-4" />
              Capture
            </Button>
          )}
        </DialogFooter>
        <Card>
          <CardContent className="space-y-3">
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="email">Name</Label>
              <Input type="text" id="text" placeholder="Name" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="email">Amount</Label>
              <Input type="number" id="text" placeholder="Name" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="email">Category</Label>
              <CategoryGroupCombobox
                selectedCategory={category}
                setSelectedCategory={setCategory}
                setCategoryGroup={setCategoryGroup}
              />
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
