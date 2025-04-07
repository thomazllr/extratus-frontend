// components/dashboard-analytics.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

type DashboardData = {
  vendasDiarias?: Array<{ data: string; vendas: number; receita: number }>;
  topClientes?: Array<{ id: number; nome: string; total: number }>;
  categoriasVendidas?: Array<{ categoria: string; quantidade: number }>;
  statusPagamento?: Array<{ status: string; quantidade: number }>;
  estoqueHistorico?: Array<{
    id: number | string;
    nome: string;
    historico: Array<{ data: string; quantidade: number }>;
  }>;
};

type DashboardAnalyticsProps = {
  data: DashboardData;
};

export function DashboardAnalytics({ data }: DashboardAnalyticsProps) {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-[200px]" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Gráfico 1: Vendas por dia */}
      <Card>
        <CardHeader>
          <CardTitle>Vendas Diárias (Últimos 30 dias)</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dashboardData?.vendasDiarias}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="vendas" fill="#8884d8" name="Vendas" />
              <Bar dataKey="receita" fill="#82ca9d" name="Receita (R$)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico 2: Tendência de vendas */}
      <Card>
        <CardHeader>
          <CardTitle>Tendência de Vendas</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dashboardData?.tendenciaVendas}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="periodo" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="vendas"
                stroke="#8884d8"
                name="Vendas"
              />
              <Line
                type="monotone"
                dataKey="receita"
                stroke="#82ca9d"
                name="Receita (R$)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico 3: Categorias mais vendidas */}
      <Card>
        <CardHeader>
          <CardTitle>Categorias Mais Vendidas</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dashboardData?.categoriasVendidas}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="quantidade"
                nameKey="categoria"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {dashboardData?.categoriasVendidas.map(
                  (entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  )
                )}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico 4: Status de pagamento */}
      <Card>
        <CardHeader>
          <CardTitle>Status de Pagamento</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dashboardData?.statusPagamento}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="quantidade"
                nameKey="status"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {dashboardData?.statusPagamento.map(
                  (entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  )
                )}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico 5: Vendas por cliente */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Top 10 Clientes (por valor gasto)</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={dashboardData?.topClientes}
              margin={{ left: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="nome" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#8884d8" name="Total Gasto (R$)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico 6: Histórico de estoque */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Histórico de Estoque (Últimos 30 dias)</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Legend />
              {dashboardData?.estoqueHistorico
                .slice(0, 5)
                .map((produto: any, index: number) => (
                  <Line
                    key={produto.id}
                    type="monotone"
                    dataKey="quantidade"
                    data={produto.historico}
                    name={produto.nome}
                    stroke={COLORS[index % COLORS.length]}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
