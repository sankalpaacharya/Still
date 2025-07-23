import TransactionForm from "@/features/cashflow/components/transaction-form";

type Props = {};

export default function Page({}: Props) {
  return (
    <div className="p-5 h-full">
      <TransactionForm />
    </div>
  );
}
