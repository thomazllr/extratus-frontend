"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Package, Users, AlertCircle } from "lucide-react";
import { DashboardAnalytics } from "@/components/dashboard-analytics";
import { useQuery } from "@tanstack/react-query";

// Tipo para os dados do dashboard
type DashboardData = {
  vendasDiarias?: Array<{ data: string; vendas: number; receita: number }>;
  topClientes?: Array<{ id: number; nome: string; total: number }>;
  categoriasVendidas?: Array<{ categoria: string; quantidade: number }>;
  statusPagamento?: Array<{ status: string; quantidade: number }>;
};

type DashboardAnalyticsProps = {
  data: DashboardData;
};

// Função para buscar dados da API
const getDashboardMetrics = async (): Promise<DashboardData> => {
  const res = await fetch("/api/dashboard");
  if (!res.ok) throw new Error("Erro ao buscar dados do dashboard");
  return res.json();
};

// Função auxiliar para formatar valores monetários
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema de farmácia
        </p>
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
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>
        <TabsContent value="analytics" className="space-y-4">
          <DashboardAnalytics data={dashboardData} />
        </TabsContent>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
                <CardDescription>
                  Últimas movimentações no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData.vendasDiarias?.length ? (
                  <div className="space-y-2">
                    {dashboardData.vendasDiarias?.slice(0, 5).map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between border rounded-md p-3 bg-white shadow-sm"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {new Date(item.data).toLocaleDateString("pt-BR")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.vendas} vendas no dia
                          </p>
                        </div>
                        <p className="text-sm font-bold text-green-600">
                          R$ {formatCurrency(item.receita)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Nenhuma atividade recente encontrada
                  </p>
                )}
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Status de Pagamento</CardTitle>
                <CardDescription>
                  Distribuição dos status de pagamento
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {dashboardData.statusPagamento?.length ? (
                  <div className="h-full flex items-center justify-center">
                    {/* Gráfico de pizza ou barras */}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Nenhum dado de pagamento disponível
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Personalizados</CardTitle>
              <CardDescription>
                Gere relatórios específicos por período
              </CardDescription>
            </CardHeader>
            <CardContent>{/* Formulário */}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
