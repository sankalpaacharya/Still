import { useState, useEffect } from 'react';
import { useBudgetStore } from '@/lib/store';
import { Target } from '@/lib/store';
import toast from 'react-hot-toast';

export type TargetFormData = {
    weekly: { amount: number; schedule: string };
    monthly: { amount: number; schedule: string };
    yearly: { amount: number; schedule: string };
  };

export function useTargetForm() {
  const { selectedCategory, selectedGroup, updateCategoryTarget, groups } = 
    useBudgetStore((state) => state);

  const currentCategory = groups
    .find((grp) => grp.name === selectedGroup)
    ?.categories.find((category) => category.name === selectedCategory);
  const [error,setError] = useState(false)
  const [formData, setFormData] = useState<TargetFormData>({
    weekly: { amount: 0, schedule: '' },
    monthly: { amount: 0, schedule: '' },
    yearly: { amount: 0, schedule: '' }
  });

  useEffect(() => {
    if (currentCategory?.target) {
      const target = currentCategory.target;
      
      const newFormData = { ...formData };
      
      if (target.type === 'weekly') {
        newFormData.weekly = { amount: target.need, schedule: target.every };
      } else if (target.type === 'monthly') {
        newFormData.monthly = { amount: target.need, schedule: target.on.toString() };
      } else if (target.type === 'yearly') {
        newFormData.yearly = { 
          amount: target.need, 
          schedule: new Date(target.date).toISOString().split('T')[0] 
        };
      }
      
      setFormData(newFormData);
    } else {
      setFormData({
        weekly: { amount: 0, schedule: '' },
        monthly: { amount: 0, schedule: '' },
        yearly: { amount: 0, schedule: '' }
      });
    }
  }, [currentCategory]);

  const updateFormData = (
    type: keyof TargetFormData, 
    field: 'amount' | 'schedule', 
    value: string | number
  ) => {
    setFormData(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value }
    }));
  };

  const saveTarget = (targetType: keyof TargetFormData) => {
    if (!selectedCategory || !selectedGroup) return;

    const data = formData[targetType];
    
    if (!data.schedule) {
      toast.error(`Please select a ${targetType} schedule`);
      setError(true);
      return;
    }

    let target: Target = null;

    if (targetType === 'weekly') {
      target = { type: 'weekly', need: data.amount, every: data.schedule };
    } else if (targetType === 'monthly') {
      target = { type: 'monthly', need: data.amount, on: Number(data.schedule) };
    } else if (targetType === 'yearly') {
      target = { type: 'yearly', need: data.amount, date: new Date(data.schedule) };
    }

    updateCategoryTarget(selectedGroup, selectedCategory, target);
    toast.success('Target saved successfully');
    setError(false)
  };

  const deleteTarget = () => {
    if (selectedCategory && selectedGroup) {
      updateCategoryTarget(selectedGroup, selectedCategory, null);
      setError(false)
      toast.success('Target deleted');
    }
  };

  const resetForm = (targetType: keyof TargetFormData) => {
    setFormData(prev => ({
      ...prev,
      [targetType]: { amount: 0, schedule: '' }
    }));
  };

  return {
    formData,
    currentCategory,
    updateFormData,
    saveTarget,
    deleteTarget,
    resetForm,
    error,
    canSave: Boolean(selectedCategory && selectedGroup)
  };
}