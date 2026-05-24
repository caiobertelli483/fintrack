"use client";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransactionModal } from "@/components/transactions/transaction-modal";
import { TransactionCard } from "@/components/transactions/transaction-card";
import { formatCurrency, formatMonthYear } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Plus, TrendingUp, TrendingDown, Wallet, Sparkles, ChevronLeft, ChevronRight, PiggyBank } from "lucide-react";
import type { DashboardStats, Category } from "@/types";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [statsRes, catsRes] = await Promise.all([
      fetch(`/api/dashboard?month=${month}&year=${year}`),
      fetch("/api/categories"),
    ]);
    setStats(await statsRes.json());
    setCategories(await catsRes.json());
    setLoading(false);
  }, [month, year]);

  useEffect(() => { fetchData(); }, [fetchData]);

  function changeMonth(delta: number) {
    const d = new Date(year, month - 1 + delta, 1);
    setMonth(d.getMonth() + 1);
    setYear(d.getFullYear());
  }

  const currentDate = new Date(year, month - 1, 1);

  return (
    <div className="px-4 pt-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Visão geral</p>
          <h1 className="text-2xl font-bold mt-0.5">Dashboard</h1>
        </div>
        <Button onClick={() => setModalOpen(true)} size="icon" className="rounded-2xl h-11 w-11 shadow-lg shadow-primary/20">
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Month selector */}
      <div className="flex items-center justify-between bg-card border border-border rounded-2xl px-4 py-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => changeMonth(-1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-semibold capitalize">{formatMonthYear(currentDate)}</span>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => changeMonth(1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-card border border-border rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : stats ? (
        <>
          {/* Balance card */}
          <Card className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border-primary/20">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Wallet className="h-4 w-4" />
                Saldo total
              </div>
              <p className={cn("text-3xl font-bold tracking-tight", stats.balance >= 0 ? "text-foreground" : "text-red-400")}>
                {formatCurrency(stats.balance)}
              </p>
            </CardContent>
          </Card>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <TrendingUp className="h-3 w-3 text-green-400" />
                  Receitas
                </div>
                <p className="text-base font-bold text-green-400 tabular-nums">{formatCurrency(stats.totalIncome)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <TrendingDown className="h-3 w-3 text-red-400" />
                  Gastos
                </div>
                <p className="text-base font-bold text-red-400 tabular-nums">{formatCurrency(stats.totalExpense)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <PiggyBank className="h-3 w-3 text-blue-400" />
                  Economia
                </div>
                <p className={cn("text-base font-bold tabular-nums", stats.savings >= 0 ? "text-blue-400" : "text-orange-400")}>
                  {formatCurrency(stats.savings)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Insight */}
          {stats.insight && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground/80">{stats.insight}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pie chart */}
          {stats.expensesByCategory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Gastos por categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 items-center">
                  <div className="w-36 h-36 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={stats.expensesByCategory} cx="50%" cy="50%" innerRadius={35} outerRadius={62} dataKey="value" paddingAngle={2}>
                          {stats.expensesByCategory.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-2 min-w-0">
                    {stats.expensesByCategory.slice(0, 5).map((cat) => (
                      <div key={cat.name} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                          <span className="text-xs text-muted-foreground truncate">{cat.name}</span>
                        </div>
                        <span className="text-xs font-medium tabular-nums">{formatCurrency(cat.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent transactions */}
          {stats.recentTransactions.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Últimas transações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-border">
                  {stats.recentTransactions.map((tx) => (
                    <TransactionCard
                      key={tx.id}
                      transaction={tx}
                      onEdit={() => {}}
                      onDeleted={fetchData}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {stats.recentTransactions.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Wallet className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nenhuma transação neste mês.</p>
              <p className="text-xs mt-1">Toque em + para adicionar.</p>
            </div>
          )}
        </>
      ) : null}

      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchData}
        categories={categories}
      />
    </div>
  );
}
