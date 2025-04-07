import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { serialize } from "@/lib/utils";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 1. Criar o cliente
    const novoCliente = await prisma.cliente.create({
      data: {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        endereco: data.endereco,
        cpf: data.cpf,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    // 2. Associar doenças, se houver
    if (Array.isArray(data.doencas) && data.doencas.length > 0) {
      const relacionamentos = data.doencas.map((doencaId: number) => ({
        cliente_id: novoCliente.id,
        doenca_id: doencaId,
        created_at: new Date(),
        updated_at: new Date(),
      }));

      await prisma.doenca_cliente.createMany({
        data: relacionamentos,
      });
    }

    return NextResponse.json(serialize(novoCliente), { status: 201 });
  } catch (error) {
    console.error("Erro ao cadastrar cliente:", error);
    return NextResponse.json(
      { error: "Erro ao cadastrar cliente" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: { created_at: "desc" },
      include: {
        doenca_cliente: {
          include: {
            doenca: true,
          },
        },
      },
    });

    const serialized = clientes.map((cliente) => ({
      ...cliente,
      doencas: cliente.doenca_cliente
        .map((dc) => ({
          id: dc.doenca?.id,
          nome: dc.doenca?.nome,
          descricao: dc.doenca?.descricao,
        }))
        .filter((d) => d.nome && d.descricao), // só mantém doenças completas
    }));

    return NextResponse.json(serialize(serialized));
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return NextResponse.json(
      { error: "Erro ao buscar clientes" },
      { status: 500 }
    );
  }
}
