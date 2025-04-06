import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { serialize } from "@/lib/utils";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const tipos = await prisma.tipo_pagamento.findMany({
      orderBy: {
        nome: "asc",
      },
    });

    return NextResponse.json(serialize(tipos));
  } catch (error) {
    console.error("Erro ao buscar tipos de pagamento:", error);
    return NextResponse.json(
      { sucesso: false, mensagem: "Erro ao buscar tipos de pagamento." },
      { status: 500 }
    );
  }
}
