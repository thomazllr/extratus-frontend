import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await context.params;
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
        include: {
          item_venda: {
            include: {
              produto: true, // Incluímos o produto para ter o nome nos logs
            },
          },
          pagamento: true,
        },
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

      // Primeiro verificar se todos os itens têm estoque registrado
      for (const item of venda.item_venda) {
        if (!item.produto_id) {
          return NextResponse.json(
            {
              sucesso: false,
              mensagem: `Item ${item.id} não tem produto associado.`,
            },
            { status: 400 }
          );
        }
      }

      // Processar cada item da venda
      for (const item of venda.item_venda) {
        // 1. Encontrar o registro de estoque existente para o produto
        const estoqueExistente = await tx.estoque.findFirst({
          where: { produto_id: item.produto_id },
        });

        // 2. Atualizar ou criar o estoque
        if (estoqueExistente) {
          await tx.estoque.update({
            where: { id: estoqueExistente.id },
            data: {
              quantidade: { increment: item.quantidade ?? 0 },
              updated_at: new Date(),
            },
          });
        } else {
          await tx.estoque.create({
            data: {
              produto_id: item.produto_id,
              quantidade: item.quantidade ?? 0,
              created_at: new Date(),
              updated_at: new Date(),
            },
          });
        }

        // 3. Registrar no histórico de estoque (opcional)
        await tx.estoqueHistorico.create({
          data: {
            produto_id: Number(item.produto_id),
            quantidade: item.quantidade ?? 0, // Positivo para entrada
            data: new Date(),
          },
        });
      }

      // Atualizar status da venda
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
        dados: {
          vendaId: venda.id,
          itensProcessados: venda.item_venda.length,
        },
      });
    });
  } catch (error: any) {
    console.error("Erro ao cancelar venda:", error);
    return NextResponse.json(
      {
        sucesso: false,
        mensagem: error.message || "Erro ao cancelar venda.",
        detalhes:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
