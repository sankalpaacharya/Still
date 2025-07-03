import React from "react";
import MostExpenseContainer from "./most-expense-bar";
import { mostSpentCategoryWithBudget } from "../actions";

const TopSpentCategories = async () => {
  const data = await mostSpentCategoryWithBudget();
  return <MostExpenseContainer data={data} />;
};

export default TopSpentCategories;
