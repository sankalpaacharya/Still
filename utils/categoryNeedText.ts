import { Target } from "@/lib/store"

type CategoryNeedParams = {
    target: Target,
    assign: number,
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

export function categoryNeedText({ target, assign }: CategoryNeedParams): string {
    if (!target) return ""
    
    const monthlyAmount = getMonthlyNeedAmount(target)
    
    if (assign === target.need) {
        return "on track"
    }
    
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
    
    return ""
}