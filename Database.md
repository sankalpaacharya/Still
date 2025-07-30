# Database Utility Functions

This document lists all database functions available in the `features/*/actions/index.ts` files to prevent duplication and provide a comprehensive reference.

## Cashflow Functions (`features/cashflow/actions/index.ts`)

### `getExpenses()`
- **Purpose**: Retrieves and groups all transactions by category with enriched data
- **Database Operations**: 
  - Selects from `transaction` table ordered by `created_at`
  - Joins with `category` table data (id, name, icon, budget, type)
- **Returns**: GroupExpense object (transactions grouped by category)
- **Data Enhancement**: Adds category info, icon, budget, and type to each transaction

### `updateExpenseAction(data)`
- **Purpose**: Updates an existing transaction with account balance management
- **Complex Logic**: 
  - Handles account balance updates when amount or account changes
  - Reverts old account balance and applies new balance
  - Validates sufficient funds
- **Database Operations**: 
  - Updates `transactions` table
  - Updates `accounts` table balances
  - Includes rollback logic on errors
- **Returns**: Success/error message
- **Path Revalidation**: `/cashflow`

### `getTotalAmountByType(type: "income" | "expense")`
- **Purpose**: Calculates total amount for income or expense transactions
- **Parameters**: 
  - `type`: "income" | "expense" - Type of transactions to sum
- **Database Operations**: 
  - Selects from `category` table filtered by type
  - Selects from `transaction` table filtered by category IDs
- **Returns**: Total amount or error

### `addExpenseAction(data)` (Duplicate function - consider consolidation)
- **Purpose**: Simple transaction insertion
- **Database Operations**: 
  - Inserts into `transaction` table
  - Revalidates `/dashboard` path
- **Returns**: Success/error message
- **Note**: This appears to be a simpler version of dashboard's addExpenseAction

## Categories Functions (`features/categories/actions/index.ts`)

### `createCategoryAction(data: CategoryFormType, id: string)`
- **Purpose**: Creates a new category with duplicate name validation
- **Validation**: Checks for existing category with same name
- **Database Operations**: 
  - Selects from `category` table to check duplicates
  - Inserts new category with `user_id`
  - Revalidates `/categories` path
- **Returns**: Success/error message

### `updateCategoryAction(data: CategoryFormType, id: string)`
- **Purpose**: Updates an existing category
- **Parameters**: 
  - `data`: CategoryFormType - Updated category data
  - `id`: string - Category ID to update
- **Database Operations**: 
  - Updates `category` table by `id`
  - Revalidates `/categories` path
- **Returns**: Success/error message

### `getAllCategories()`
- **Purpose**: Retrieves all categories for the authenticated user
- **Database Operations**: 
  - Selects all from `category` table filtered by `user_id`
- **Returns**: Array of category objects or empty array

## Chat Functions (`features/chat/actions/index.ts`)

### `getFullUserInfo()`
- **Purpose**: Retrieves complete user data (categories and transactions)
- **Database Operations**: 
  - Selects all from `category` table filtered by `user_id`
  - Selects all from `transaction` table filtered by `user_id`
- **Returns**: Object with categories and transactions arrays
- **Error Handling**: Throws errors for authentication or database failures

## Dashboard Functions (`features/dashboard/actions/index.ts`)

### `NewAddExpenseAction(data: transactionItem)`
- **Purpose**: Bulk insert multiple transactions from structured data
- **Parameters**: 
  - `data`: transactionItem - Object with item names as keys and transaction data as values
- **Database Operations**: 
  - Bulk inserts into `transaction` table
  - Revalidates `/dashboard` path
- **Returns**: Success/error message with inserted data

### `addExpenseAction(data: Expense)`
- **Purpose**: Adds expense/income with account balance management
- **Complex Logic**: 
  - Validates account balance for expenses
  - Updates account balance based on transaction type
  - Handles both income and expense transactions
- **Database Operations**: 
  - Inserts into `transactions` table
  - Updates `accounts` table balance
- **Returns**: Success/error message
- **Path Revalidation**: `/dashboard`

### `mostSpentCategoryWithBudget()`
- **Purpose**: Retrieves top 5 spending categories for current month with budget info
- **Complex Logic**: 
  - Filters transactions by current month
  - Groups by category and sums amounts
  - Enriches with category details and budget info
- **Database Operations**: 
  - Selects from `transaction` table with date filtering
  - Joins with `category` table for names, icons, budgets
- **Returns**: Array of top 5 categories with spending and budget data

### `getRecentTransactions()`
- **Purpose**: Retrieves last 5 transactions with category enrichment
- **Database Operations**: 
  - Selects from `transaction` table ordered by `created_at` desc, limited to 5
  - Joins with `category` table for enrichment
- **Returns**: Array of enriched transaction objects

### `getTotalSpendingThisMonth()`
- **Purpose**: Calculates total spending for current month
- **Database Operations**: 
  - Selects and sums amounts from `transaction` table for current month
- **Returns**: Total spending amount

### `getTransactionOfMonth()`
- **Purpose**: Groups current month transactions by day
- **Database Operations**: 
  - Selects amount and date from `transaction` table for current month
- **Returns**: Object with daily spending totals

### `getCategories()`
- **Purpose**: Retrieves all user categories
- **Database Operations**: 
  - Selects all from `category` table filtered by `user_id`
- **Returns**: Array of Category objects

### `uploadImageAction(formData: FormData)`
- **Purpose**: Processes uploaded images using AI for expense extraction
- **Complex Logic**: 
  - Validates image format (JPEG/PNG only)
  - Calls AI service for expense parsing
  - Handles JSON parsing of AI response
- **External Dependencies**: `uploadSnapToAI` function
- **Returns**: Parsed expense data from AI

### `uploadImageFile(file: File)`
- **Purpose**: Uploads image files to Supabase storage
- **Database Operations**: 
  - Uploads to `items-receipts` storage bucket
  - Revalidates `/dashboard` path
- **Returns**: Success message

### `renameImageFile(oldFilename: string, newFilename: string)`
- **Purpose**: Renames files in Supabase storage
- **Database Operations**: 
  - Copies file with new name in `items-receipts` bucket
  - Deletes old file
- **Returns**: Success message

## Database Tables Referenced

### `transaction` / `transactions` (Note: Inconsistent table naming)
- Columns: `id`, `user_id`, `category_id`, `amount`, `description`, `date`, `created_at`, `account_id`, `category_group`, `category`, `type`
- Operations: SELECT, INSERT, UPDATE

### `category`
- Columns: `id`, `user_id`, `name`, `icon`, `budget`, `type`
- Operations: SELECT, INSERT, UPDATE

### `items-receipts` (Storage Bucket)
- File storage for receipt images
- Operations: UPLOAD, COPY, DELETE

## Potential Issues & Recommendations

### Duplicate Functions
- `addExpenseAction` exists in both `cashflow` and `dashboard` actions with different implementations
- Consider consolidating or renaming for clarity

### Table Naming Inconsistency
- `transaction` vs `transactions` - standardize table naming

### Missing Error Handling
- Some functions don't handle all potential database errors
- Consider adding consistent error handling patterns

### Performance Considerations
- `getExpenses()` could be optimized with proper JOIN instead of separate queries
- Consider adding indexes on frequently queried columns (`user_id`, `category_id`, `created_at`)

### Security Notes
- All functions properly validate user authentication
- Row Level Security (RLS) should be enabled on all tables
- Consider adding rate limiting for file upload functions 