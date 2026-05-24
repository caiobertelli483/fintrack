"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransactionModal } from "@/components/transactions/transaction-modal";
import { TransactionCard } from "@/components/transactions/transaction-card";
import { formatMonthYear } from "@/lib/utils";
import { Plus, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import type { Transaction, Category } from "@/types";

export default function TransactionsPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ month: String(month), year: String(year) });
    if (categoryFilter !== "all") params.set("categoryId", categoryFilter);
    if (typeFilter !== "all") params.set("type", typeFilter);
    const [txRes, catsRes] = await Promise.all([
      fetch(`/api/transactions?${params}`),
      fetch("/api/categories"),
    ]);
    setTransactions(await txRes.json());
    setCategories(await catsRes.json());
    setLoading(false);
  }, [month, year, categoryFilter, typeFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  function changeMonth(delta: number) {
    const d = new Date(year, month - 1 + delta, 1);
    setMonth(d.getMonth() + 1);
    setYear(d.getFullYear());
  }

  function handleEdit(t: Transaction) {
    setEditing(t);
    setModalOpen(true);
  }

  return (
    <div className="px-4 pt-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Histórico</p>
          <h1 className="text-2xl font-bold mt-0.5">Transações</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-2xl h-11 w-11" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          <Button size="icon" className="rounded-2xl h-11 w-11 shadow-lg shadow-primary/20" onClick={() => { setEditing(null); setModalOpen(true); }}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Month selector */}
      <div className="flex items-center justify-between bg-card border border-border rounded-2xl px-4 py-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => changeMonth(-1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-semibold capitalize">{formatMonthYear(new Date(year, month - 1, 1))}</span>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => changeMonth(1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="grid grid-cols-2 gap-2 animate-slide-up">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="expense">Despesas</SelectItem>
              <SelectItem value="income">Receitas</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Transactions list */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-card border border-border rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : transactions.length > 0 ? (
        <div className="bg-card border border-border rounded-2xl divide-y divide-border px-4">
          {transactions.map((tx) => (
            <TransactionCard key={tx.id} transaction={tx} onEdit={handleEdit} onDeleted={fetchData} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-sm">Nenhuma transação encontrada.</p>
          <p className="text-xs mt-1">Altere os filtros ou adicione uma transação.</p>
        </div>
      )}

      <TransactionModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSuccess={fetchData}
        transaction={editing}
        categories={categories}
      />
    </div>
  );
}
