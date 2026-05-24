import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");
  const year = searchParams.get("year");
  const categoryId = searchParams.get("categoryId");
  const type = searchParams.get("type");

  const where: Record<string, unknown> = {};

  if (month && year) {
    const start = new Date(parseInt(year), parseInt(month) - 1, 1);
    const end = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
    where.date = { gte: start, lte: end };
  }
  if (categoryId) where.categoryId = categoryId;
  if (type) where.type = type;

  const transactions = await prisma.transaction.findMany({
    where,
    include: { category: true },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(transactions);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { description, amount, type, date, categoryId } = body;

  if (!description || !amount || !type || !date || !categoryId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const transaction = await prisma.transaction.create({
    data: { description, amount: parseFloat(amount), type, date: new Date(date), categoryId },
    include: { category: true },
  });

  return NextResponse.json(transaction, { status: 201 });
}
