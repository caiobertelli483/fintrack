import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { description, amount, type, date, categoryId } = body;

  const transaction = await prisma.transaction.update({
    where: { id: params.id },
    data: { description, amount: parseFloat(amount), type, date: new Date(date), categoryId },
    include: { category: true },
  });

  return NextResponse.json(transaction);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.transaction.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
