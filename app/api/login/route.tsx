// app/api/login/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "@/lib/utils";
import { cookies } from "next/headers"; // 👈 Importe isso

const prisma = new PrismaClient();

type LoginRequestBody = {
  cpf: string;
  senha: string;
};

export async function POST(req: Request) {
  const { cpf, senha }: LoginRequestBody = await req.json();

  const usuario = await prisma.usuario.findFirst({
    where: { cpf },
  });

  if (!usuario) {
    return NextResponse.json(
      { error: "Usuário não encontrado" },
      { status: 401 }
    );
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha ?? "");

  if (!senhaValida) {
    return NextResponse.json({ error: "Senha inválida" }, { status: 401 });
  }

  const token = jwt.sign(
    { id: Number(usuario.id), nome: usuario.nome, is_admin: usuario.is_admin },
    process.env.JWT_SECRET!, // <-- Correto agora
    { expiresIn: "1h" }
  );

  // Create response
  const response = NextResponse.json(
    serialize({
      message: "Login bem-sucedido",
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        is_admin: usuario.is_admin,
      },
    })
  );

  response.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60,
    path: "/",
    sameSite: "strict",
  });

  return response;
}
