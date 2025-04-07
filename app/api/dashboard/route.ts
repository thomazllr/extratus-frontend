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

    // Consulta produtosMaisVendidos corrigida
    const produtosMaisVendidos = await prisma.$queryRaw`
    SELECT
      p.id,
      p.nome,
      SUM(iv.quantidade)::integer as quantidade,
      SUM(iv.quantidade * p.preco) as valor_total,
      (SELECT COALESCE(SUM(e.quantidade), 0)::integer FROM estoque e WHERE e.produto_id = p.id) as estoque_restante
    FROM item_venda iv
    JOIN produto p ON iv.produto_id = p.id
    JOIN venda v ON iv.venda_id = v.id
    WHERE v.data >= NOW() - INTERVAL '30 days'
    GROUP BY p.id, p.nome
    ORDER BY SUM(iv.quantidade) DESC
    LIMIT 20
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

    // Adicione esta query após as outras consultas existentes
    const relatoriosVendas = await prisma.venda.findMany({
      where: {
        data: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)), // Últimos 30 dias
        },
      },
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            cpf: true,
          },
        },
        item_venda: {
          include: {
            produto: {
              select: {
                id: true,
                nome: true,
                preco: true,
                categoria: true,
              },
            },
          },
        },
        pagamento: {
          include: {
            tipo_pagamento: {
              select: {
                nome: true,
              },
            },
          },
        },
      },
      orderBy: {
        data: "desc",
      },
      take: 50, // Limite de registros
    });

    // Formate os dados para serem consistentes com suas outras respostas
    const relatoriosFormatados = relatoriosVendas.map((venda) => ({
      id: venda.id,
      data: venda.data,
      cliente: {
        id: venda.cliente?.id || null,
        nome: venda.cliente?.nome || "Não informado",
        cpf: venda.cliente?.cpf || "",
      },
      total: venda.total,
      status: venda.status_pagamento,
      itens: venda.item_venda.length,
      formaPagamento:
        venda.pagamento[0]?.tipo_pagamento?.nome || "Não informado",
      produtos: venda.item_venda.map((item) => ({
        id: item.produto?.id || null,
        nome: item.produto?.nome || "Produto desconhecido",
        quantidade: item.quantidade || 0,
        preco: item.produto?.preco || 0,
        categoria: item.produto?.categoria || "",
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
        produtosMaisVendidos,
        relatorios: relatoriosFormatados, // Adicione esta linha
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
