import React from "react";
import MostExpenseContainer from "./most-expense-bar";
import { mostSpentCategory } from "../actions";

const TopSpentCategories = async () => {
  const data = await mostSpentCategory();

  return (
    <div>
      <MostExpenseContainer data={data} />
    </div>
  );
};

export default TopSpentCategories;
