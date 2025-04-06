import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { serialize } from "@/lib/utils";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      cliente_id,
      observacao,
      status_pagamento,
      itens,
      pagamento,
    }: {
      cliente_id: number;
      observacao?: string;
      status_pagamento: string;
      itens: {
        produto_id: number;
        quantidade: number;
        preco_unitario: number;
      }[];
      pagamento: {
        valor: number;
        tipo_pagamento_id: number;
      };
    } = body;

    // Usar transação para garantir integridade dos dados
    return await prisma.$transaction(async (tx) => {
      // Buscar os produtos com estoque e preço
      const produtosDB = await tx.produto.findMany({
        where: {
          id: { in: itens.map((item) => item.produto_id) },
        },
        include: {
          estoque: true,
        },
      });

      // Validar quantidade e construir os itens com preço
      const itensValidados = itens.map((item) => {
        const produtoDB = produtosDB.find(
          (p) => Number(p.id) === item.produto_id
        );

        if (!produtoDB)
          throw new Error(`Produto ID ${item.produto_id} não encontrado.`);

        // Calcular estoque total (pode haver múltiplos registros)
        const estoqueTotal = produtoDB.estoque.reduce(
          (total, reg) => total + (reg.quantidade || 0),
          0
        );

        // Garantir que o estoque não seja negativo para exibição
        const estoqueAtual = Math.max(estoqueTotal, 0);

        if (item.quantidade > estoqueAtual) {
          throw new Error(
            `Quantidade insuficiente no estoque para o produto "${produtoDB.nome}". Disponível: ${estoqueAtual}, Solicitado: ${item.quantidade}`
          );
        }

        return {
          produto_id: item.produto_id,
          quantidade: item.quantidade,
          preco_unitario:
            Number(item.preco_unitario) || Number(produtoDB.preco) || 0,
        };
      });

      const total = itensValidados.reduce(
        (acc, item) => acc + item.quantidade * item.preco_unitario,
        0
      );

      // Atualizar estoque ANTES da criação da venda
      for (const item of itensValidados) {
        // Verificar se já existe registro de estoque
        const estoqueExistente = await tx.estoque.findFirst({
          where: { produto_id: item.produto_id },
        });

        if (estoqueExistente) {
          // Atualizar registro existente
          await tx.estoque.update({
            where: { id: estoqueExistente.id },
            data: {
              quantidade: {
                decrement: item.quantidade,
              },
              updated_at: new Date(),
            },
          });
        } else {
          // Criar novo registro de estoque (caso raro)
          await tx.estoque.create({
            data: {
              produto_id: item.produto_id,
              quantidade: -item.quantidade,
              created_at: new Date(),
              updated_at: new Date(),
            },
          });
        }
      }

      // Criar a venda com todos os relacionamentos
      const novaVenda = await tx.venda.create({
        data: {
          data: new Date(),
          total,
          observacao,
          status_pagamento,
          cliente: {
            connect: {
              id: cliente_id,
            },
          },
          item_venda: {
            create: itensValidados.map((item) => ({
              quantidade: item.quantidade,
              preco_unitario: item.preco_unitario,
              produto: {
                connect: {
                  id: item.produto_id,
                },
              },
            })),
          },
          pagamento: {
            create: {
              valor: total,
              created_at: new Date(),
              tipo_pagamento: {
                connect: {
                  id: pagamento.tipo_pagamento_id,
                },
              },
            },
          },
        },
        include: {
          cliente: true,
          item_venda: {
            include: {
              produto: true,
            },
          },
          pagamento: {
            include: {
              tipo_pagamento: true,
            },
          },
        },
      });

      return NextResponse.json({
        sucesso: true,
        venda: serialize(novaVenda),
      });
    });
  } catch (error: any) {
    console.error("Erro ao registrar movimentação:", error);
    return NextResponse.json(
      {
        sucesso: false,
        mensagem: error.message || "Erro ao registrar movimentação.",
      },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const vendas = await prisma.venda.findMany({
      orderBy: { created_at: "desc" },
      include: {
        cliente: true,
        item_venda: {
          include: {
            produto: true,
          },
        },
        pagamento: {
          include: {
            tipo_pagamento: true,
          },
        },
      },
    });

    // Vamos garantir que só o primeiro pagamento seja retornado para cada venda
    const vendasFormatadas = vendas.map((venda) => {
      const primeiroPagamento = Array.isArray(venda.pagamento)
        ? venda.pagamento[0]
        : null;

      return serialize({
        ...venda,
        pagamento: primeiroPagamento,
      });
    });

    return NextResponse.json(vendasFormatadas);
  } catch (error: any) {
    console.error("Erro ao buscar movimentações:", error);
    return NextResponse.json(
      { sucesso: false, mensagem: "Erro ao buscar movimentações." },
      { status: 500 }
    );
  }
}
