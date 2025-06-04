import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export type WeeklyTarget = {
    type: 'weekly'
    need: number
    every: string 
}

export type MonthlyTarget = {
    type: 'monthly'
    need: number
    on: number
}

export type YearlyTarget = {
    type: 'yearly'
    need: number
    date: Date
}

export type Target = WeeklyTarget | MonthlyTarget | YearlyTarget | null

export type MonthlyBudget = {
    [month: string]: { // "2025-3"
      assign: string;
      activity: string;
    };
  };
 
export type Category = {
    name: string
    target: Target
    assign: number
    activity: number
}

export type CategoryGroup = {
    name: string
    categories: Category[]
}

export type Budget = {
    totalAmount: number
    groups: CategoryGroup[]
    readyToAssign: number 
    selectedCategory: string | null
    selectedGroup: string | null
}

export type Actions = {
    addCategoryGroup: (name: string) => void
    addCategory: (categoryGroupName: string, categoryName: string) => void
    updateCategoryGroup: (categoryGroupName: string, name: string) => void
    updateCategory: (categoryGroupName: string, categoryName: string, updatedCategory: Partial<Category>) => void
    updateCategoryTarget: (categoryGroupName: string, categoryName: string, target: Target) => void
    assignMoney: (categoryGroupName: string, categoryName: string, amount: number) => void
    addActivity: (categoryGroupName: string, categoryName: string, amount: number) => void
    deleteCategoryGroup: (name: string) => void
    deleteCategory: (categoryGroupName: string, categoryName: string) => void
    updateTotalAmount: (amount: number) => void
    calculateReadyToAssign: () => void
    setSelectedCategory: (categoryName: string | null, groupName: string | null) => void
}


export const useBudgetStore = create<Budget & Actions>()(
    subscribeWithSelector((set, get) => ({
    totalAmount: 0,
    groups: [],
    readyToAssign: 0,
    selectedCategory: null,
    selectedGroup: null,
    
    addCategoryGroup: (name: string) => set((state) => ({
        ...state,
        groups: [
            ...state.groups,
            { name, categories: [] }
        ] 
    })),
    
    addCategory: (categoryGroupName: string, categoryName: string) => set((state) => ({
        ...state,
        groups: state.groups.map((group) => {
            if (group.name === categoryGroupName) {
                return {
                    ...group, 
                    categories: [
                        ...group.categories, 
                        {
                            name: categoryName,
                            target: null,
                            assign: 0,
                            activity: 0,
                        }
                    ]
                }
            }
            return group
        })
    })),
    
    updateCategoryGroup: (categoryGroupName: string, name: string) => set((state) => ({
        ...state,
        groups: state.groups.map((group) => {
            if (group.name === categoryGroupName) {
                return { ...group, name }
            }
            return group
        })
    })),
    
    updateCategory: (categoryGroupName: string, categoryName: string, updatedCategory: Partial<Category>) => set((state) => ({
        ...state,
        groups: state.groups.map((group) => {
            if (group.name === categoryGroupName) {
                return {
                    ...group,
                    categories: group.categories.map((category) => {
                        if (category.name === categoryName) {
                            return { ...category, ...updatedCategory }
                        }
                        return category
                    })
                }
            }
            return group
        })
    })),
    
    updateCategoryTarget: (categoryGroupName: string, categoryName: string, target: Target) => set((state) => ({
        ...state,
        groups: state.groups.map((group) => {
            if (group.name === categoryGroupName) {
                return {
                    ...group,
                    categories: group.categories.map((category) => {
                        if (category.name === categoryName) {
                            return { ...category, target }
                        }
                        return category
                    })
                }
            }
            return group
        })
    })),
    
    assignMoney: (categoryGroupName: string, categoryName: string, amount: number) => {
        set((state) => ({
            ...state,
            groups: state.groups.map((group) => {
                if (group.name === categoryGroupName) {
                    return {
                        ...group,
                        categories: group.categories.map((category) => {
                            if (category.name === categoryName) {
                                const newAssign = category.assign + amount
                                return { 
                                    ...category, 
                                    assign: newAssign,
                                }
                            }
                            return category
                        })
                    }
                }
                return group
            })
        }))
        get().calculateReadyToAssign()
    },
    
    addActivity: (categoryGroupName: string, categoryName: string, amount: number) => {
        set((state) => ({
            ...state,
            groups: state.groups.map((group) => {
                if (group.name === categoryGroupName) {
                    return {
                        ...group,
                        categories: group.categories.map((category) => {
                            if (category.name === categoryName) {
                                const newActivity = category.activity + amount
                                return { 
                                    ...category, 
                                    activity: newActivity,
                                    available: category.assign + newActivity
                                }
                            }
                            return category
                        })
                    }
                }
                return group
            })
        }))
    },
    
    deleteCategoryGroup: (name: string) => {
        set((state) => ({
            ...state,
            groups: state.groups.filter((group) => group.name !== name)
        }))
        get().calculateReadyToAssign()
    },
    
    deleteCategory: (categoryGroupName: string, categoryName: string) => {
        set((state) => ({
            ...state,
            groups: state.groups.map((group) => {
                if (group.name === categoryGroupName) {
                    return {
                        ...group,
                        categories: group.categories.filter((category) => category.name !== categoryName)
                    }
                }
                return group
            })
        }))
        get().calculateReadyToAssign()
    },
    
    updateTotalAmount: (amount: number) => {
        set((state) => ({
            ...state,
            totalAmount: amount
        }))
        get().calculateReadyToAssign()
    },
    
    calculateReadyToAssign: () => {
        const totalAssigned = get().groups.reduce((total, group) => {
            return total + group.categories.reduce((groupTotal, category) => {
                return groupTotal + category.assign
            }, 0)
        }, 0)
        
        set((state) => ({
            ...state,
            readyToAssign: state.totalAmount - totalAssigned
        }))
    },
    
    setSelectedCategory: (categoryName: string | null, groupName: string | null) => {
        set((state) => ({
            ...state,
            selectedCategory: categoryName,
            selectedGroup: groupName
        }))
    }
}))
)

