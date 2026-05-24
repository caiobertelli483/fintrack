"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { Transaction, Category, TransactionFormData } from "@/types";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transaction?: Transaction | null;
  categories: Category[];
}

export function TransactionModal({ open, onClose, onSuccess, transaction, categories }: TransactionModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState<TransactionFormData>({
    description: "",
    amount: "",
    type: "expense",
    date: today,
    categoryId: "",
  });

  useEffect(() => {
    if (transaction) {
      setForm({
        description: transaction.description,
        amount: transaction.amount.toString(),
        type: transaction.type as "income" | "expense",
        date: new Date(transaction.date).toISOString().split("T")[0],
        categoryId: transaction.categoryId,
      });
    } else {
      setForm({ description: "", amount: "", type: "expense", date: today, categoryId: "" });
    }
  }, [transaction, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.description || !form.amount || !form.categoryId) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const url = transaction ? `/api/transactions/${transaction.id}` : "/api/transactions";
      const method = transaction ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount: parseFloat(form.amount) }),
      });
      if (!res.ok) throw new Error("Erro ao salvar");
      toast({ title: transaction ? "Transação atualizada!" : "Transação adicionada!", variant: "success" as any });
      onSuccess();
      onClose();
    } catch {
      toast({ title: "Erro ao salvar transação", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{transaction ? "Editar Transação" : "Nova Transação"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Type toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl">
            {(["expense", "income"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setForm((f) => ({ ...f, type }))}
                className={cn(
                  "flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  form.type === type
                    ? type === "expense"
                      ? "bg-red-500/20 text-red-400 shadow-sm"
                      : "bg-green-500/20 text-green-400 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {type === "expense" ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                {type === "expense" ? "Despesa" : "Receita"}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <Label>Descrição</Label>
            <Input
              placeholder="Ex: Almoço no restaurante"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Valor (R$)</Label>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0,00"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={form.categoryId} onValueChange={(v) => setForm((f) => ({ ...f, categoryId: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Data</Label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className={cn("flex-1", form.type === "income" ? "bg-green-500 hover:bg-green-600" : "")}
              disabled={loading}
            >
              {loading ? "Salvando..." : transaction ? "Atualizar" : "Adicionar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
