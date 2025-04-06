import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { serialize } from "@/lib/utils";

const prisma = new PrismaClient();

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await context.params; // ✅ corrigido
    const { status_pagamento } = await request.json();
    const id = parseInt(paramId);

    if (!id || !status_pagamento) {
      return NextResponse.json(
        { sucesso: false, mensagem: "ID e status são obrigatórios." },
        { status: 400 }
      );
    }

    const vendaAtualizada = await prisma.venda.update({
      where: { id: Number(id) },
      data: { status_pagamento },
    });

    return NextResponse.json(
      serialize({
        sucesso: true,
        venda: vendaAtualizada,
      })
    );
  } catch (error: any) {
    console.error("Erro ao atualizar status:", error);
    return NextResponse.json(
      {
        sucesso: false,
        mensagem: error.message || "Erro ao atualizar status.",
      },
      { status: 500 }
    );
  }
}
