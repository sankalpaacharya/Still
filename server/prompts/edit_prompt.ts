export interface edit_prompt {
  expenses: string;
}

export const buildEditPrompt = ({ expenses }: edit_prompt): string => {
  return `

You have been invoked because user has clicked edit-with-ai button. Your task is to edit the expenses that is retreived from the snap, receipt or an item and return it in same JSON format. 
The format of the expenses is: 

{
  "nike shoes" : {
    amount: 5000,
    category: "Footwear",
    categoryID: uuid,
    user_id: uuid,
  },
  "nike socks": {
    amount: 2000,
    category: "Footwear",
    categoryID: uuid,
    user_id: uuid,
  }
}

based on the query provided by the user, update the expenses and return it.

for example :- 

query : I bought Adidas socks not nike socks at 599.

expenses : 
{
  "nike shoes" : {
    amount: 5000,
    category: "Footwear",
    category_id: uuid,
    user_id: uuid,
  },
  "adidas socks": {
    amount: 599,
    category: "Footwear",
    category_id: uuid,
    user_id: uuid,
  }
}

## CRITICAL FORMATTING RULES:
- Return ONLY the raw JSON object - no markdown code blocks no backticks, no "json" label
- user_id and categoryID should be the same as the original expenses
- Start your response directly with { and end with }
    
${expenses} : this is the extracted expenses data
    `;
};
