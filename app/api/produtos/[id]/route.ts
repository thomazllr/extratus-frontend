import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: paramId } = await context.params; // ✅ corrigido
  const id = parseInt(paramId);

  if (isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    // Primeiro remove o estoque relacionado (se quiser deletar mesmo)
    await prisma.estoque.deleteMany({
      where: { produto_id: id },
    });

    // Opcional: remover item_venda (caso queira deletar tudo mesmo)
    await prisma.item_venda.deleteMany({
      where: { produto_id: id },
    });

    // Por fim, deleta o produto
    await prisma.produto.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Produto excluído com sucesso" });
  } catch (error: any) {
    console.error("Erro ao excluir produto:", error);
    return NextResponse.json(
      {
        error:
          "Erro ao excluir o produto. Verifique se ele está relacionado a uma venda.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await context.params; // ✅ corrigido
    const { quantidade } = await req.json();
    const id = parseInt(paramId);

    // Atualiza o estoque do produto
    const estoqueAtualizado = await prisma.estoque.updateMany({
      where: {
        produto_id: id,
      },
      data: {
        quantidade,
        updated_at: new Date(),
      },
    });

    if (!estoqueAtualizado) {
      return NextResponse.json(
        { error: "Estoque não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao atualizar estoque:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
