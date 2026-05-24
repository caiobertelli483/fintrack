"use client";
import { Pencil, Trash2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getCategoryIcon } from "@/lib/category-icons";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Transaction } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface TransactionCardProps {
  transaction: Transaction;
  onEdit: (t: Transaction) => void;
  onDeleted: () => void;
}

export function TransactionCard({ transaction, onEdit, onDeleted }: TransactionCardProps) {
  const { toast } = useToast();
  const Icon = getCategoryIcon(transaction.category.icon);
  const isExpense = transaction.type === "expense";

  async function handleDelete() {
    try {
      await fetch(`/api/transactions/${transaction.id}`, { method: "DELETE" });
      toast({ title: "Transação excluída", variant: "success" as any });
      onDeleted();
    } catch {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    }
  }

  return (
    <div className="flex items-center gap-3 py-3 px-1 group animate-fade-in">
      <div
        className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${transaction.category.color}20` }}
      >
        <Icon className="h-5 w-5" style={{ color: transaction.category.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{transaction.description}</p>
        <p className="text-xs text-muted-foreground">{transaction.category.name} · {formatDate(transaction.date)}</p>
      </div>
      <div className="flex items-center gap-1">
        <span className={cn("text-sm font-semibold tabular-nums", isExpense ? "text-red-400" : "text-green-400")}>
          {isExpense ? "-" : "+"}{formatCurrency(transaction.amount)}
        </span>
        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity ml-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(transaction)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir transação?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que quer excluir &quot;{transaction.description}&quot;? Essa ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
