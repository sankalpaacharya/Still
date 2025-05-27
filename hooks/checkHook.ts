import { useBudgetStore } from "@/lib/store";
import { WeeklyTarget,MonthlyTarget,YearlyTarget } from "@/lib/store";
import { useState } from "react";

/*
this hook will provide, functionality
to update the amount, to update the scheudle
*/


function useTargetForm(){

const {selectedGroup,selectedCategory,updateCategoryTarget,groups} = useBudgetStore(state=>state)
const [weeklyAmount, setWeeklyAmount] = useState<number>(0);
const [weeklySchedule, setWeeklySchedule] = useState<string>("");

const [monthlyAmount, setMonthlyAmount] = useState<number>(0);
const [monthlySchedule, setMonthlySchedule] = useState<string>("");

const [yearlyAmount, setYearlyAmount] = useState<number>(0);
const [yearlySchedule, setYearlySchedule] = useState<string>("");

let form = {

}


const selectedTarget = groups
.find((grp) => grp.name === selectedGroup)
?.categories.find((category) => category.name === selectedCategory);



return  {
    selectedTarget
}





}