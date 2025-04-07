"use client";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Package, Users, AlertCircle, Download } from "lucide-react";
import { DashboardAnalytics } from "@/components/dashboard-analytics";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Tipo para os dados do dashboard
type DashboardData = {
  vendasDiarias?: Array<{ data: string; vendas: number; receita: number }>;
  topClientes?: Array<{ id: number; nome: string; total: number }>;
  categoriasVendidas?: Array<{ categoria: string; quantidade: number }>;
  statusPagamento?: Array<{ status: string; quantidade: number }>;
  estoqueHistorico?: Array<{
    id: number;
    nome: string;
    historico: Array<{ data: Date; quantidade: number }>;
  }>;
  produtosMaisVendidos?: Array<{
    id: number;
    nome: string;
    quantidade: number;
    valor_total: number;
    estoque_restante: number;
  }>;
  relatorios?: Array<{
    id: number;
    data: Date | string;
    cliente: {
      id: number | null;
      nome: string;
      cpf: string;
    };
    total: number;
    status: string;
    itens: number;
    formaPagamento: string;
    produtos: Array<{
      id: number | null;
      nome: string;
      quantidade: number;
      preco: number;
      categoria: string;
    }>;
  }>;
};

const getDashboardMetrics = async (): Promise<DashboardData> => {
  const res = await fetch("/api/dashboard");
  if (!res.ok) throw new Error("Erro ao buscar dados do dashboard");
  return res.json();
};

function formatCurrency(value?: number | string): string {
  const parsed = Number(value);
  if (isNaN(parsed)) return "0,00";
  return parsed.toFixed(2).replace(".", ",");
}

export default function Dashboard() {
  const { data: dashboardData = {}, isLoading } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: getDashboardMetrics,
    staleTime: 1000 * 60 * 5,
  });
  const [open, setOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<
    NonNullable<DashboardData["relatorios"]>[0] | null
  >(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-muted-foreground">
          Carregando dados do dashboard...
        </p>
      </div>
    );
  }

  const defaultValues = {
    vendasHoje: dashboardData.vendasDiarias?.[0]?.vendas || 0,
    receitaHoje: formatCurrency(dashboardData.vendasDiarias?.[0]?.receita),
    totalClientes: dashboardData.topClientes?.length || 0,
    topClienteValor: formatCurrency(dashboardData.topClientes?.[0]?.total),
    topCategoria: dashboardData.categoriasVendidas?.[0]?.categoria || "N/A",
    vendasTopCategoria: dashboardData.categoriasVendidas?.[0]?.quantidade || 0,
    pagamentosPendentes:
      dashboardData.statusPagamento?.find((s) => s?.status === "pendente")
        ?.quantidade || 0,
    pagamentosPagos:
      dashboardData.statusPagamento?.find((s) => s?.status === "pago")
        ?.quantidade || 0,
  };

  function openModal(report: typeof selectedReport) {
    setSelectedReport(report);
    setOpen(true);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground"></p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Hoje</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{defaultValues.vendasHoje}</div>
            <p className="text-xs text-muted-foreground">
              Receita: R$ {defaultValues.receitaHoje}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Clientes Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {defaultValues.totalClientes}
            </div>
            <p className="text-xs text-muted-foreground">
              Top cliente: R$ {defaultValues.topClienteValor}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categoria Top</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {defaultValues.topCategoria}
            </div>
            <p className="text-xs text-muted-foreground">
              {defaultValues.vendasTopCategoria} vendas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pagamentos Pendentes
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {defaultValues.pagamentosPendentes}
            </div>
            <p className="text-xs text-muted-foreground">
              {defaultValues.pagamentosPagos} pagos
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4">
          <DashboardAnalytics data={dashboardData} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Relatórios de Vendas</h2>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Baixar Relatório
            </Button>
          </div>

          <div className="overflow-auto rounded-lg border bg-background shadow-sm">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">CPF</th>
                  <th className="px-4 py-3">Itens</th>
                  <th className="px-4 py-3">Total (R$)</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Pagamento</th>
                  <th className="px-4 py-3">Medicamentos</th>
                  <th className="px-4 py-3">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted">
                {dashboardData.relatorios?.map((relatorio) => {
                  const status = relatorio.status.toLowerCase();
                  const statusColor =
                    status === "pago"
                      ? "bg-green-100 text-green-800"
                      : status === "pendente"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800";

                  return (
                    <tr
                      key={relatorio.id}
                      className="hover:bg-muted/40 transition"
                    >
                      <td className="px-4 py-3">
                        {new Date(relatorio.data).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {relatorio.cliente?.nome || "N/A"}
                      </td>
                      <td className="px-4 py-3">{relatorio.cliente?.cpf}</td>
                      <td className="px-4 py-3">{relatorio.itens}</td>
                      <td className="px-4 py-3 font-medium">
                        R$ {formatCurrency(relatorio.total)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded ${statusColor}`}
                        >
                          {relatorio.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {relatorio.formaPagamento}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <ul className="list-disc ml-4 space-y-1 text-xs">
                          {relatorio.produtos.map((produto, index) => (
                            <li key={index}>
                              {produto.nome} ({produto.quantidade}x)
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openModal(relatorio)}
                        >
                          Ver Relatório
                        </Button>
                      </td>
                    </tr>
                  );
                }) || (
                  <tr>
                    <td
                      colSpan={9}
                      className="text-center p-4 text-muted-foreground"
                    >
                      Nenhum relatório encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* 🧩 Modal */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes do Relatório</DialogTitle>
              <DialogDescription>
                Informações completas da venda realizada.
              </DialogDescription>
            </DialogHeader>

            {selectedReport && (
              <div className="space-y-3 text-sm">
                <p>
                  <strong>Data:</strong>{" "}
                  {new Date(selectedReport.data).toLocaleDateString()}
                </p>
                <p>
                  <strong>Cliente:</strong> {selectedReport.cliente.nome} (
                  {selectedReport.cliente.cpf})
                </p>
                <p>
                  <strong>Status:</strong> {selectedReport.status}
                </p>
                <p>
                  <strong>Forma de Pagamento:</strong>{" "}
                  {selectedReport.formaPagamento}
                </p>
                <p>
                  <strong>Itens:</strong> {selectedReport.itens}
                </p>
                <p>
                  <strong>Total:</strong> R${" "}
                  {formatCurrency(selectedReport.total)}
                </p>

                <div>
                  <strong>Medicamentos:</strong>
                  <ul className="list-disc ml-5 mt-1 space-y-1">
                    {selectedReport.produtos.map((p, i) => (
                      <li key={i}>
                        {p.nome} - {p.quantidade}x • R${" "}
                        {formatCurrency(p.preco)} • {p.categoria}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </Tabs>
    </div>
  );
}
