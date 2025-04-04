import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { serialize } from "@/lib/utils";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const doencas = await prisma.doenca.findMany({
      select: {
        id: true,
        nome: true,
      },
      orderBy: { nome: "asc" },
    });
    return NextResponse.json(serialize(doencas));
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar doenças" },
      { status: 500 }
    );
  }
}
