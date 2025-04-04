import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { serialize } from "@/lib/utils";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get("x-api-key");

    if (!apiKey || apiKey !== process.env.API_KEY_REGISTRO) {
      return NextResponse.json(
        { error: "Chave de API inválida ou ausente." },
        { status: 401 }
      );
    }

    const { cpf, nome, senha, is_admin = false } = await req.json();

    if (!cpf || !nome || !senha) {
      return NextResponse.json(
        { error: "Campos obrigatórios: cpf, nome e senha." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.usuario.findFirst({ where: { cpf } });

    if (existingUser) {
      return NextResponse.json(
        { error: "Usuário já cadastrado com esse CPF." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const novoUsuario = await prisma.usuario.create({
      data: {
        cpf,
        nome,
        senha: hashedPassword,
        is_admin,
      },
    });

    return NextResponse.json(
      serialize({
        id: novoUsuario.id,
        cpf: novoUsuario.cpf,
        nome: novoUsuario.nome,
        is_admin: novoUsuario.is_admin,
      })
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
