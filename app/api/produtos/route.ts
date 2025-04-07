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

  // 👇 Transforma preco de Decimal para number e inclui os novos campos
  const produtosConvertidos = produtos.map((p) => ({
    ...p,
    preco: parseFloat(p.preco?.toString() || "0"),
    miligramas: p.miligramas ?? null,
    quantidade_capsulas: p.quantidade_capsulas ?? null,
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
    const {
      nome,
      descricao,
      preco,
      categoria,
      quantidade,
      miligramas,
      quantidade_capsulas,
    } = body;

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
        miligramas,
        quantidade_capsulas,
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
      miligramas: novoProduto.miligramas ?? null,
      quantidade_capsulas: novoProduto.quantidade_capsulas ?? null,
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
