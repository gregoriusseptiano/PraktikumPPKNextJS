export type TransactionType = "income" | "expense";

export type TransactionFilter = "all" | TransactionType;

export type Transaction = {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  transaction_date: string;
  created_at: string;
  updated_at: string;
};

export type TransactionInput = {
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  transaction_date: string;
};

export type TransactionField = keyof TransactionInput;

export type TransactionFieldErrors = Partial<Record<TransactionField, string>>;

export type TransactionActionState = {
  fieldErrors: TransactionFieldErrors;
  formError: string | null;
};

export const INITIAL_TRANSACTION_ACTION_STATE: TransactionActionState = {
  fieldErrors: {},
  formError: null,
};

export type TransactionFormValues = {
  type: TransactionType;
  amount: string;
  category: string;
  description: string;
  transaction_date: string;
};
