import { PrismaClient } from "@prisma/client";
import { subDays, subMonths, startOfMonth } from "date-fns";

const prisma = new PrismaClient();

const defaultCategories = [
  { name: "Alimentação", icon: "utensils", color: "#f97316", isDefault: true },
  { name: "Mercado", icon: "shopping-cart", color: "#22c55e", isDefault: true },
  { name: "Transporte", icon: "car", color: "#3b82f6", isDefault: true },
  { name: "Faculdade", icon: "graduation-cap", color: "#8b5cf6", isDefault: true },
  { name: "Lazer", icon: "gamepad-2", color: "#ec4899", isDefault: true },
  { name: "Saúde", icon: "heart-pulse", color: "#ef4444", isDefault: true },
  { name: "Assinaturas", icon: "tv", color: "#06b6d4", isDefault: true },
  { name: "Moradia", icon: "home", color: "#eab308", isDefault: true },
  { name: "Salário", icon: "wallet", color: "#10b981", isDefault: true },
  { name: "Outros", icon: "ellipsis", color: "#6b7280", isDefault: true },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Create categories
  const categories: Record<string, string> = {};
  for (const cat of defaultCategories) {
    const created = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
    categories[cat.name] = created.id;
  }

  const now = new Date();
  const thisMonth = startOfMonth(now);

  // Mock transactions for current month
  const transactions = [
    // Income
    {
      description: "Salário",
      amount: 4500,
      type: "income",
      date: new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 5),
      categoryId: categories["Salário"],
    },
    {
      description: "Freelance design",
      amount: 800,
      type: "income",
      date: new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 12),
      categoryId: categories["Outros"],
    },
    // Expenses this month
    {
      description: "Aluguel",
      amount: 1200,
      type: "expense",
      date: new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1),
      categoryId: categories["Moradia"],
    },
    {
      description: "Conta de luz",
      amount: 145,
      type: "expense",
      date: new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 3),
      categoryId: categories["Moradia"],
    },
    {
      description: "iFood - Japonês",
      amount: 68,
      type: "expense",
      date: new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 7),
      categoryId: categories["Alimentação"],
    },
    {
      description: "Supermercado Extra",
      amount: 320,
      type: "expense",
      date: new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 9),
      categoryId: categories["Mercado"],
    },
    {
      description: "Uber",
      amount: 35,
      type: "expense",
      date: new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 10),
      categoryId: categories["Transporte"],
    },
    {
      description: "Netflix",
      amount: 39.9,
      type: "expense",
      date: new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 10),
      categoryId: categories["Assinaturas"],
    },
    {
      description: "Spotify",
      amount: 21.9,
      type: "expense",
      date: new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 10),
      categoryId: categories["Assinaturas"],
    },
    {
      description: "Lanche McDonald's",
      amount: 42.5,
      type: "expense",
      date: new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 13),
      categoryId: categories["Alimentação"],
    },
    {
      description: "Ônibus mensal",
      amount: 180,
      type: "expense",
      date: new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 2),
      categoryId: categories["Transporte"],
    },
    {
      description: "Faculdade - mensalidade",
      amount: 780,
      type: "expense",
      date: new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 5),
      categoryId: categories["Faculdade"],
    },
    {
      description: "Farmácia",
      amount: 89.9,
      type: "expense",
      date: new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 8),
      categoryId: categories["Saúde"],
    },
    {
      description: "Cinema + pipoca",
      amount: 75,
      type: "expense",
      date: new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 11),
      categoryId: categories["Lazer"],
    },
    {
      description: "Padaria",
      amount: 28,
      type: "expense",
      date: new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 14),
      categoryId: categories["Alimentação"],
    },
    // Last month transactions
    {
      description: "Salário",
      amount: 4500,
      type: "income",
      date: subMonths(new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 5), 1),
      categoryId: categories["Salário"],
    },
    {
      description: "Aluguel",
      amount: 1200,
      type: "expense",
      date: subMonths(new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1), 1),
      categoryId: categories["Moradia"],
    },
    {
      description: "Supermercado",
      amount: 290,
      type: "expense",
      date: subMonths(new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 10), 1),
      categoryId: categories["Mercado"],
    },
    {
      description: "Restaurante",
      amount: 120,
      type: "expense",
      date: subMonths(new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 15), 1),
      categoryId: categories["Alimentação"],
    },
    {
      description: "Faculdade",
      amount: 780,
      type: "expense",
      date: subMonths(new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 5), 1),
      categoryId: categories["Faculdade"],
    },
    {
      description: "Transporte",
      amount: 200,
      type: "expense",
      date: subMonths(new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 8), 1),
      categoryId: categories["Transporte"],
    },
    {
      description: "Assinaturas streaming",
      amount: 61.8,
      type: "expense",
      date: subMonths(new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 10), 1),
      categoryId: categories["Assinaturas"],
    },
    {
      description: "Lazer",
      amount: 150,
      type: "expense",
      date: subMonths(new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 20), 1),
      categoryId: categories["Lazer"],
    },
  ];

  for (const tx of transactions) {
    await prisma.transaction.create({ data: tx });
  }

  console.log(`✅ Seeded ${defaultCategories.length} categories and ${transactions.length} transactions`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
