export type Budget = {
  id: string;
  user_id: string;
  month: string;
  amount: number;
  created_at: string;
  updated_at: string;
};

export type BudgetInput = {
  month: string;
  amount: number;
};

export type BudgetFieldErrors = Partial<{
  month: string;
  amount: string;
}>;

export type BudgetActionState = {
  fieldErrors: BudgetFieldErrors;
  formError: string | null;
};

export const INITIAL_BUDGET_ACTION_STATE: BudgetActionState = {
  fieldErrors: {},
  formError: null,
};

export type BudgetFormValues = {
  month: string;
  amount: string;
};
