import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { serialize } from "@/lib/utils";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Vendas diárias (últimos 30 dias) - Sintaxe corrigida
    const vendasDiarias = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('day', v.data) as data,
        COUNT(v.id)::integer as vendas,
        SUM(v.total) as receita
      FROM venda v
      WHERE v.data >= NOW() - INTERVAL '30 days'
      GROUP BY DATE_TRUNC('day', v.data)
      ORDER BY DATE_TRUNC('day', v.data) DESC
    `;

    // 2. Tendência de vendas (mensal) - Sintaxe corrigida
    const tendenciaVendas = await prisma.$queryRaw`
      SELECT 
        TO_CHAR(v.data, 'YYYY-MM') as periodo,
        COUNT(v.id)::integer as vendas,
        SUM(v.total) as receita
      FROM venda v
      WHERE v.data >= NOW() - INTERVAL '12 months'
      GROUP BY TO_CHAR(v.data, 'YYYY-MM')
      ORDER BY TO_CHAR(v.data, 'YYYY-MM')
    `;

    // 3. Categorias mais vendidas
    const categoriasVendidas = await prisma.$queryRaw`
      SELECT 
        p.categoria,
        SUM(iv.quantidade)::integer as quantidade
      FROM item_venda iv
      JOIN produto p ON iv.produto_id = p.id
      GROUP BY p.categoria
      ORDER BY SUM(iv.quantidade) DESC
    `;

    // 4. Status de pagamento
    const statusPagamento = await prisma.$queryRaw`
      SELECT 
        status_pagamento as status,
        COUNT(id)::integer as quantidade
      FROM venda
      GROUP BY status_pagamento
    `;

    // 5. Top 10 clientes
    const topClientes = await prisma.$queryRaw`
      SELECT 
        c.id,
        c.nome,
        SUM(v.total) as total
      FROM venda v
      JOIN cliente c ON v.cliente_id = c.id
      GROUP BY c.id, c.nome
      ORDER BY SUM(v.total) DESC
      LIMIT 10
    `;

    // 6. Histórico de estoque (últimos 30 dias)
    const produtosComHistorico = await prisma.produto.findMany({
      take: 5,
      orderBy: {
        historicoEstoque: {
          _count: "desc",
        },
      },
      include: {
        historicoEstoque: {
          where: {
            data: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
          orderBy: { data: "asc" },
        },
      },
    });

    const estoqueHistorico = produtosComHistorico.map((produto) => ({
      id: produto.id,
      nome: produto.nome,
      historico: produto.historicoEstoque.map((estoque) => ({
        data: estoque.data,
        quantidade: estoque.quantidade,
      })),
    }));

    return NextResponse.json(
      serialize({
        vendasDiarias,
        tendenciaVendas,
        categoriasVendidas,
        statusPagamento,
        topClientes,
        estoqueHistorico,
      })
    );
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    return NextResponse.json(
      { error: "Erro ao buscar dados do dashboard", details: error },
      { status: 500 }
    );
  }
}
