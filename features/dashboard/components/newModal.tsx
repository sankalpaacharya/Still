"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategoryGroupCombobox } from "./addexpenseselect";
import {
  Plus,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  DollarSign,
  Tag,
  CreditCard,
  FileText,
} from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { addExpenseAction } from "../actions";
import { useBudgetStore } from "@/lib/store";
import toast from "react-hot-toast";
import { AccountSelect } from "./account-select";

export default function NewAddExpenseModalButton() {
  const { addActivity } = useBudgetStore((state) => state);
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [categoryGroup, setCategoryGroup] = useState("");
  const [categoryChange, setCategoryChange] = useState<any>({});
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [account, setAccount] = useState("");
  const [type, setType] = useState("");

  const totalSteps = 5;

  const resetForm = () => {
    setCurrentStep(1);
    setDescription("");
    setAmount("");
    setCategory("");
    setCategoryGroup("");
    setCategoryChange({});
    setDate(new Date().toISOString().split("T")[0]);
    setAccount("");
    setType("");
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return type !== "";
      case 2:
        return amount !== "" && parseFloat(amount) > 0;
      case 3:
        return category !== "";
      case 4:
        return account !== "";
      case 5:
        return description !== "";
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!description || !amount || !category || !type) {
      toast.error("Fill all details");
      return;
    }

    const result = await addExpenseAction({
      category,
      categoryGroup,
      amount: parseInt(amount),
      description,
      date,
      categoryId: categoryChange.categoryID,
      accountID: account,
      type: type,
    });

    if (result.error) {
      toast.error(result.message);
      return;
    }

    if (type === "expense") {
      addActivity(categoryGroup, category, parseInt(amount));
    } else {
      addActivity(categoryGroup, category, -parseInt(amount));
    }

    toast.success(
      `${type === "expense" ? "Expense" : "Income"} added successfully!`,
    );

    setIsOpen(false);
    resetForm();
  };

  const handleDialogClose = () => {
    setIsOpen(false);
    resetForm();
  };

  const getStepIcon = (step: number) => {
    const icons: any = {
      1: <Tag className="w-5 h-5" />,
      2: <DollarSign className="w-5 h-5" />,
      3: <Tag className="w-5 h-5" />,
      4: <CreditCard className="w-5 h-5" />,
      5: <FileText className="w-5 h-5" />,
    };
    return icons[step] || <Tag className="w-5 h-5" />;
  };

  const getStepTitle = () => {
    const titles: any = {
      1: "Transaction Type",
      2: "Amount",
      3: "Category",
      4: "Account & Date",
      5: "Description",
    };
    return titles[currentStep] || "";
  };

  const getStepDescription = () => {
    const descriptions: any = {
      1: "Choose whether this is an expense or income",
      2: `How much did you ${type === "expense" ? "spend" : "earn"}?`,
      3: `What category does this ${type} belong to?`,
      4: "Select account and date for this transaction",
      5: `Add a description for this ${type}`,
    };
    return descriptions[currentStep] || "";
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setType("expense")}
                className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                  type === "expense"
                    ? "border-red-500 bg-red-50 shadow-lg scale-105"
                    : "border-gray-200 hover:border-red-300 hover:bg-gray-50"
                }`}
              >
                <div className="text-center space-y-2">
                  <div className="text-3xl">💸</div>
                  <div className="font-semibold text-gray-800">Expense</div>
                  <div className="text-sm text-gray-600">Money going out</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setType("income")}
                className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                  type === "income"
                    ? "border-green-500 bg-green-50 shadow-lg scale-105"
                    : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                }`}
              >
                <div className="text-center space-y-2">
                  <div className="text-3xl">💰</div>
                  <div className="font-semibold text-gray-800">Income</div>
                  <div className="text-sm text-gray-600">Money coming in</div>
                </div>
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 text-2xl h-16 text-center bg-white/5"
                autoFocus
              />
            </div>
            <div className="text-center text-sm text-gray-600">
              Enter the amount for this {type}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <CategoryGroupCombobox
              selectedCategory={category}
              onChange={setCategoryChange}
              setCategoryGroup={setCategoryGroup}
              setSelectedCategory={setCategory}
            />
            <div className="text-center text-sm text-gray-600">
              Choose a category that best describes this {type}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="account" className="text-sm font-medium">
                Account
              </Label>
              <AccountSelect selected={account} setSelected={setAccount} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">
                Date
              </Label>
              <DatePicker />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <textarea
                placeholder={
                  type === "income"
                    ? "e.g., Freelance project payment, Salary, etc."
                    : "e.g., Grocery shopping, Gas, Coffee, etc."
                }
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full pl-10 pt-3 pb-3 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-white/5"
                rows={3}
                autoFocus
              />
            </div>
            <div className="text-center text-sm text-gray-600">
              Add a brief description to help you remember this {type}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="mt-4 md:mt-0 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
          onClick={() => setIsOpen(true)}
        >
          <Plus size={16} className="mr-2" />
          Add Transaction
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[500px] p-0"
        onInteractOutside={handleDialogClose}
      >
        <div className="p-6">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  type === "income"
                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                    : "bg-gradient-to-r from-purple-500 to-blue-500"
                }`}
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Header */}
          <DialogHeader className="text-center mb-6">
            <div
              className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                type === "income"
                  ? "bg-green-100 text-green-600"
                  : "bg-purple-100 text-purple-600"
              }`}
            >
              {getStepIcon(currentStep)}
            </div>
            <DialogTitle className="text-xl font-semibold">
              {getStepTitle()}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {getStepDescription()}
            </DialogDescription>
          </DialogHeader>

          {/* Content */}
          <div className="mb-8">{renderStepContent()}</div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={currentStep === 1 ? handleDialogClose : handlePrevious}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {currentStep === 1 ? "Cancel" : "Previous"}
            </Button>

            {currentStep === totalSteps ? (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className={`flex items-center ${
                  type === "income"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Add {type === "expense" ? "Expense" : "Income"}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`flex items-center ${
                  type === "income"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
