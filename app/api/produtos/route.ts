// app/api/produtos/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { serialize } from "@/lib/utils";

const prisma = new PrismaClient();

export async function GET() {
  const produtos = await prisma.produto.findMany({
    include: {
      estoque: true,
    },
  });

  // 👇 Transforma preco de Decimal para number
  const produtosConvertidos = produtos.map((p) => ({
    ...p,
    preco: parseFloat(p.preco?.toString() || "0"),
    estoque: p.estoque.map((e) => ({
      ...e,
      quantidade: e.quantidade ?? 0,
    })),
  }));

  return NextResponse.json(serialize(produtosConvertidos));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, descricao, preco, categoria, quantidade } = body;

    if (!nome || !preco || quantidade == null) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes" },
        { status: 400 }
      );
    }

    const novoProduto = await prisma.produto.create({
      data: {
        nome,
        descricao,
        preco,
        categoria,
        created_at: new Date(),
        updated_at: new Date(),
        estoque: {
          create: {
            quantidade,
            created_at: new Date(),
            updated_at: new Date(),
          },
        },
      },
      include: {
        estoque: true,
      },
    });

    // 👇 Conversão após criação
    const produtoConvertido = {
      ...novoProduto,
      preco: parseFloat(novoProduto.preco?.toString() || "0"),
      estoque: novoProduto.estoque.map((e) => ({
        ...e,
        quantidade: e.quantidade ?? 0,
      })),
    };

    return NextResponse.json(serialize(produtoConvertido), { status: 201 });
  } catch (error) {
    console.error("Erro ao cadastrar medicamento:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

