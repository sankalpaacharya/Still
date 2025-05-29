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

export type Category = {
    name: string
    target: Target
    assign: number
    activity: number
    available: number
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



const initialState: Budget = {
    totalAmount: 5000,
    readyToAssign: 2000,
    selectedCategory: null,
    selectedGroup: null,
    groups: [
      {
        name: 'Essentials',
        categories: [
          {
            name: 'Groceries',
            target: null,
            assign: 1000,
            activity: -200, 
            available: 800
          },
          {
            name: 'Transport',
            target: {
              type: 'monthly',
              need: 1000,
              on: 1 
            },
            assign: 500,
            activity: -100,
            available: 400
          }
        ]
      },
      {
        name: 'Savings',
        categories: [
          {
            name: 'Emergency Fund',
            target: {
              type: 'yearly',
              need: 12000,
              date: new Date('2025-12-31')
            },
            assign: 500,
            activity: 0,
            available: 500
          }
        ]
      }
    ]
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
    totalAmount: 5000,
    groups: initialState.groups,
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
                            available: 0
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
                                    available: newAssign + category.activity
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

