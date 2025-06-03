import { Target } from "@/lib/store"
import {differenceInMonths} from "date-fns"

type CategoryNeedParams = {
    target:Target,
    assign:number,
}

export function categoryNeedText({target,assign}:CategoryNeedParams){
    if(!target) return ""
    if(target.type==="monthly"){
        if(target.need>assign){
            return `$${target.need-assign} more needed by the ${target.on}th`  
        }
        return ""
    }

    if(target.type==="yearly"){
        if(target.need>assign){
        const monthDifference = differenceInMonths(target.date, new Date())
        return `$${target.need/monthDifference} more needed this month`
        }
    }

    return ""
}

