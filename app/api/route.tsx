// app/api/usuarios/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { serialize } from "@/lib/utils";

const prisma = new PrismaClient();

export async function GET() {
  const profissoes = await prisma.profissao.findMany();
  return NextResponse.json(serialize(profissoes));
}
