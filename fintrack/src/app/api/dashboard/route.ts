import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface TxWithCategory {
  type: string;
  amount: number;
  categoryId: string;
  category: { name: string; color: string };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const month = parseInt(searchParams.get("month") || String(new Date().getMonth() + 1));
  const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const transactions = await prisma.transaction.findMany({
    where: { date: { gte: start, lte: end } },
    include: { category: true },
    orderBy: { date: "desc" },
  });

  const totalIncome = transactions
    .filter((t: TxWithCategory) => t.type === "income")
    .reduce((s: number, t: TxWithCategory) => s + t.amount, 0);

  const totalExpense = transactions
    .filter((t: TxWithCategory) => t.type === "expense")
    .reduce((s: number, t: TxWithCategory) => s + t.amount, 0);

  // All-time balance
  const allTransactions = await prisma.transaction.findMany();
  const balance = allTransactions.reduce(
    (s: number, t: { type: string; amount: number }) =>
      t.type === "income" ? s + t.amount : s - t.amount,
    0
  );

  // Expenses by category
  const expenseMap: Record<string, { name: string; value: number; color: string }> = {};
  for (const t of transactions.filter((t: TxWithCategory) => t.type === "expense")) {
    if (!expenseMap[t.categoryId]) {
      expenseMap[t.categoryId] = { name: t.category.name, value: 0, color: t.category.color };
    }
    expenseMap[t.categoryId].value += t.amount;
  }
  const expensesByCategory = Object.values(expenseMap).sort((a, b) => b.value - a.value);

  // Insight
  let insight = "Continue acompanhando suas finanças!";
  if (expensesByCategory.length > 0) {
    const top = expensesByCategory[0];
    const pct = totalExpense > 0 ? Math.round((top.value / totalExpense) * 100) : 0;
    insight = `Você gastou mais com ${top.name} este mês (${pct}% das despesas)`;
  }
  if (totalIncome > 0 && totalExpense < totalIncome * 0.7) {
    insight = `Ótimo mês! Você economizou ${Math.round(((totalIncome - totalExpense) / totalIncome) * 100)}% da sua renda 🎉`;
  }

  return NextResponse.json({
    balance,
    totalIncome,
    totalExpense,
    savings: totalIncome - totalExpense,
    expensesByCategory,
    recentTransactions: transactions.slice(0, 5),
    insight,
  });
}
