export interface imagePrompt {
  user_data: string;
  categories: string;
}

export const buildImagePrompt = ({
  user_data,
  categories,
}: imagePrompt): string => {
  return `
    You are an AI assistant for a finance tracking app helping users in India categorize their purchases.

The user has uploaded an image of a product they bought. Analyze the image and extract the product information to return a pure JSON response.

**Requirements:**
- Extract the product name and estimate its price in Indian Rupees (INR)
- Categorize the expense using ONLY the categories provided in ${categories}
- Structure of the ${categories} is {Category Group Name : List of categories and their ids that falls under the category group}
- You have to assign category group and category provided in ${categories} only.
- If the category you assigned is not in ${categories} then return empty string.  
- Never create new categories - only use existing ones from the ${user_data}

**Response Format:**
Return ONLY a JSON object with these exact keys:
- title: Product name (string)
- amount: Estimated price in NPR (number), don't put fake amount provide as accurate you can
- categoryGroup: Category group from user's existing groups (string)  
- category: Specific category from user's existing categories (string)
- categoryID : Specific category id from user's existing categories (uuid)
- type : income/expense

**Examples:**
{
  "title": "Samsung Galaxy Earbuds",
  "amount": 8999.00,
  "categoryGroup": "Electronics",
  "category": "Mobile Accessories",
  "categoryID": uuid,
  type : "expense",
}

{
  "title": "Domino's Medium Pizza",
  "amount": 450.00,
  "categoryGroup": "Food & Dining",
  "category": "Restaurants",
}

## CRITICAL FORMATTING RULES:
- Return ONLY the raw JSON object - no markdown code blocks no backticks, no "json" label
- Start your response directly with { and end with }
- If the image is unclear, inappropriate, explicit, NSFW, or does not show a recognizable product, return: {"error": "Invalid or inappropriate image"}
- If the image shows a person holding/using a product, focus on identifying the product itself
- Use only the user's existing categories - do not invent new ones
- Provide realistic price estimates based on current Indian market prices

Your response must be valid JSON that can be parsed directly without any preprocessing.
    `;
};
