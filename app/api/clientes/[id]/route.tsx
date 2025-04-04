import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await context.params;
    const id = BigInt(paramId);

    const cliente = await prisma.cliente.findUnique({ where: { id } });
    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    await prisma.doenca_cliente.deleteMany({ where: { cliente_id: id } });
    await prisma.cliente.delete({ where: { id } });

    return NextResponse.json({ message: "Cliente deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar cliente:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Erro ao deletar cliente",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: paramId } = await context.params; // ✅ corrigido
  const id = Number(paramId);
  const data = await req.json();

  try {
    await prisma.cliente.update({
      where: { id },
      data: {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        endereco: data.endereco,
        updated_at: new Date(),
      },
    });

    await prisma.doenca_cliente.deleteMany({ where: { cliente_id: id } });

    if (Array.isArray(data.doencas) && data.doencas.length > 0) {
      await prisma.doenca_cliente.createMany({
        data: data.doencas.map((doencaId: number) => ({
          cliente_id: id,
          doenca_id: doencaId,
          created_at: new Date(),
          updated_at: new Date(),
        })),
      });
    }

    return NextResponse.json({ message: "Cliente atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar cliente" },
      { status: 500 }
    );
  }
}
