import { NextResponse } from "next/server";
import { Resend } from "resend";
import { PrismaClient } from "@prisma/client";
import { serialize } from "@/lib/utils";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await context.params; // ✅ corrigido
    const id = parseInt(paramId);
    const { status_pagamento, enviar_email } = await req.json();
    const vendaId = Number(id);

    const venda = await prisma.venda.update({
      where: { id: vendaId },
      data: { status_pagamento },
      include: {
        cliente: true,
        item_venda: {
          include: {
            produto: true,
          },
        },
      },
    });

    // 2. Enviar e-mail se solicitado e se o status for "pago"
    if (enviar_email && status_pagamento === "pago" && venda.cliente?.email) {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: venda.cliente.email,
        subject: `Pagamento confirmado - Compra #${venda.id}`,
        html: `
          <h1>Olá ${venda.cliente.nome || "Cliente"}!</h1>
          <p>Seu pagamento foi confirmado com sucesso.</p>
          <h3>Resumo da compra:</h3>
          <ul>
            ${venda.item_venda
              .map(
                (item) => `
              <li>${item.quantidade}x ${item.produto?.nome || "Produto"} - ${item.preco_unitario}</li>
            `
              )
              .join("")}
          </ul>
          <p><strong>Total: ${venda.total}</strong></p>
          <p>Obrigado por comprar conosco!</p>
        `,
      });
    }

    return NextResponse.json(
      serialize({
        success: true,
        mensagem:
          "Status atualizado" + (enviar_email ? " e e-mail enviado" : ""),
        venda,
      })
    );
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    return NextResponse.json(
      { success: false, mensagem: "Erro ao atualizar status" },
      { status: 500 }
    );
  }
}
