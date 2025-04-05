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
        descricao: true,
        gravidade: true,
        categoria: true,
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

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.nome || !data.descricao) {
      return NextResponse.json(
        { error: "Nome e descrição são obrigatórios." },
        { status: 400 }
      );
    }

    const novaDoenca = await prisma.doenca.create({
      data: {
        nome: data.nome,
        descricao: data.descricao,
        created_at: new Date(),
        updated_at: new Date(),
        gravidade: data.gravidade || "baixa",
        categoria: data.categoria || "geral",
      },
    });

    return NextResponse.json(serialize(novaDoenca), { status: 201 });
  } catch (error) {
    console.error("Erro ao cadastrar doença:", error);
    return NextResponse.json(
      { error: "Erro ao cadastrar doença" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório." }, { status: 400 });
    }

    await prisma.doenca.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir doença:", error);
    return NextResponse.json(
      { error: "Erro ao excluir doença" },
      { status: 500 }
    );
  }
}
