import { Target, useBudgetStore } from "@/lib/store"
import { endOfMonth, startOfMonth, eachWeekOfInterval, Day } from "date-fns"

type CategoryNeedParams = {
    target: Target,
    assign: number,
    selectedMonth: string
}

export function getMonthlyNeedAmount(target: Target): number {
    if (!target) return 0
    
    if (target.type === "monthly") {
        return target.need
    }
    
    if (target.type === "yearly") {
        let monthDifference = 0
        const targetMonth = new Date(target.date).getMonth()
        const todaysMonth = new Date().getMonth()
        
        if (targetMonth > todaysMonth) {
            monthDifference = targetMonth - todaysMonth + 1
        } else {
            monthDifference = 12 - todaysMonth + targetMonth + 1
        }
        
        return target.need / monthDifference
    }
    
    return 0
}

export function categoryNeedText({ target, assign,selectedMonth }: CategoryNeedParams): string {
    if (!target) return ""
    
    const monthlyAmount = getMonthlyNeedAmount(target)
    
    
    if (target.type === "monthly") {
        if (target.need > assign) {
            return `$${target.need - assign} more needed by the ${target.on}th`
        }
        return ""
    }
    
    if (target.type === "yearly") {
        if (target.need > assign) {
            if (assign === monthlyAmount) {
                return "on track"
            }
            return `$${(monthlyAmount-assign).toFixed(2)} more needed this month`
        }
    }

    if(target.type==="weekly"){
            const dayNumber = getDayNumber(target.every)
            const date =  new Date(selectedMonth)
            const numberofWeeks = getWeeksInMonth(date.getFullYear(),date.getMonth(),dayNumber || 0)
            return `$${numberofWeeks*target.need-assign} need more this month`
    }
    return ""
}




export function getWeeksInMonth(year:number,month:number, weekStartsOn:Day):number{
   const start = startOfMonth(new Date(year, month))  
   const end = endOfMonth(start)
   const weeks = eachWeekOfInterval({start,end},{weekStartsOn})
   return weeks.length

}


export function getDayNumber(dayName: string): Day | undefined {
    const daysMap: Record<string,  Day> = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6
    };
  
    return daysMap[dayName.toLowerCase()];
  }