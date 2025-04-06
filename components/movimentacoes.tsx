"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function MovimentacoesTable() {
  const [movimentacoes, setMovimentacoes] = useState<any[]>([]);

  const carregarMovimentacoes = async () => {
    try {
      const res = await fetch("/api/estoque");
      const data = await res.json();
      setMovimentacoes(data);
    } catch (error) {
      console.error("Erro ao carregar movimentações:", error);
    }
  };

  useEffect(() => {
    carregarMovimentacoes();
  }, []);

  const formatarData = (dataString: string) => {
    return new Date(dataString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Produtos</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Pagamento</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movimentacoes.map((mov) => (
            <TableRow key={mov.id}>
              <TableCell>{formatarData(mov.data)}</TableCell>
              <TableCell>{mov.cliente?.nome || "Não informado"}</TableCell>
              <TableCell>
                {mov.item_venda?.map((item: any) => (
                  <div key={item.id} className="text-sm">
                    {item.quantidade}x {item.produto?.nome}
                  </div>
                ))}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    mov.status_pagamento === "pago" ? "default" : "secondary"
                  }
                  className={
                    mov.status_pagamento === "pago"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {mov.status_pagamento}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                R$ {mov.total.toFixed(2).replace(".", ",")}
              </TableCell>
              <TableCell>
                {mov.pagamento?.tipo_pagamento?.nome || "Não informado"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
