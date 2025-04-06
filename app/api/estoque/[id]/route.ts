import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await context.params; // ✅ corrigido
    const id = parseInt(paramId);

    if (!id) {
      return NextResponse.json(
        { sucesso: false, mensagem: "ID da movimentação é obrigatório." },
        { status: 400 }
      );
    }

    const vendaId = Number(id);

    return await prisma.$transaction(async (tx) => {
      const venda = await tx.venda.findUnique({
        where: { id: vendaId },
        include: { item_venda: true, pagamento: true },
      });

      if (!venda) {
        return NextResponse.json(
          { sucesso: false, mensagem: "Venda não encontrada." },
          { status: 404 }
        );
      }

      if (venda.status === "cancelada") {
        return NextResponse.json(
          { sucesso: false, mensagem: "Venda já está cancelada." },
          { status: 400 }
        );
      }

      for (const item of venda.item_venda) {
        await tx.estoque.upsert({
          where: { id: item.produto_id! }, // If 'id' is your primary key
          // OR use a compound unique identifier if defined in your schema:
          // where: { produto_id_unique: item.produto_id! },
          update: {
            quantidade: { increment: item.quantidade ?? 0 },
            updated_at: new Date(),
          },
          create: {
            produto_id: item.produto_id!,
            quantidade: item.quantidade,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });
      }

      await tx.venda.update({
        where: { id: vendaId },
        data: {
          status: "cancelada",
          status_pagamento: "estornado",
          updated_at: new Date(),
        },
      });

      return NextResponse.json({
        sucesso: true,
        mensagem: "Venda cancelada com sucesso e estoque reabastecido.",
      });
    });
  } catch (error: any) {
    console.error("Erro ao cancelar venda:", error);
    return NextResponse.json(
      {
        sucesso: false,
        mensagem: error.message || "Erro ao cancelar venda.",
      },
      { status: 500 }
    );
  }
}
