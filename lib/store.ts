import {create} from 'zustand'


export type  MonthlyTarget = {
    price:number
}

export type Category = {
    name: string,
    target: number,
    assign: number
    activity: number
    available: number
}

export type CategoryGroup = {
    name: string,
    categories: Category[]
}

export type Budget = {
    totalAmount: number,
    groups: CategoryGroup[]
}

export type Actions = {
   addCategoryGroup: (name: string) => void
   addCategory: (categoryGroupName: string, categoryName: string) => void
   updateCategoryGroup: (categoryGroupName: string, name: string) => void
   updateCategory: (categoryGroupName: string, categoryName: string, updatedCategory: Partial<Category>) => void
   deleteCategoryGroup: (name: string) => void
   deleteCategory: (categoryGroupName: string, categoryName: string) => void
   updateTotalAmount: (amount: number) => void
}

export const useBudgetStore = create<Budget & Actions>((set) => ({
    totalAmount: 0,
    groups: [],
    
    addCategoryGroup: (name: string) => set((state) => ({
        ...state,
        groups: [
            ...state.groups,
            {name, categories: []}
        ] 
    })),
    
    addCategory: (categoryGroupName: string, categoryName: string) => set((state) => ({
        ...state,
        groups: state.groups.map((group) => {
           if(group.name === categoryGroupName) {
               return {
                   ...group, 
                   categories: [
                       ...group.categories, 
                       {
                           name: categoryName,
                           activity: 0,
                           target: 0,
                           assign: 0,
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
            if(group.name === categoryGroupName) {
                return {...group, name}
            }
            return group
        })
    })),
    
    updateCategory: (categoryGroupName: string, categoryName: string, updatedCategory: Partial<Category>) => set((state) => ({
        ...state,
        groups: state.groups.map((group) => {
            if(group.name === categoryGroupName) {
                return {
                    ...group,
                    categories: group.categories.map((category) => {
                        if(category.name === categoryName) {
                            return {...category, ...updatedCategory}
                        }
                        return category
                    })
                }
            }
            return group
        })
    })),
    
    deleteCategoryGroup: (name: string) => set((state) => ({
        ...state,
        groups: state.groups.filter((group) => group.name !== name)
    })),
    
    deleteCategory: (categoryGroupName: string, categoryName: string) => set((state) => ({
        ...state,
        groups: state.groups.map((group) => {
            if(group.name === categoryGroupName) {
                return {
                    ...group,
                    categories: group.categories.filter((category) => category.name !== categoryName)
                }
            }
            return group
        })
    })),
    
    updateTotalAmount: (amount: number) => set((state) => ({
        ...state,
        totalAmount: amount
    }))
}))