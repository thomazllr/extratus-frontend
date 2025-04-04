"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Calendar, Download, FileText, LineChart, Package, Pill, PieChart, Users } from "lucide-react"
import { useRef, useEffect } from "react"

export default function RelatoriosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">Visualize e exporte relatórios do sistema</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Período
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Exportar Relatório</DialogTitle>
                <DialogDescription>Selecione o formato e os dados que deseja exportar.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="relatorio" className="text-sm font-medium">
                    Relatório
                  </label>
                  <Select defaultValue="vendas">
                    <SelectTrigger id="relatorio">
                      <SelectValue placeholder="Selecione o relatório" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vendas">Vendas</SelectItem>
                      <SelectItem value="estoque">Estoque</SelectItem>
                      <SelectItem value="clientes">Clientes</SelectItem>
                      <SelectItem value="medicamentos">Medicamentos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="formato" className="text-sm font-medium">
                    Formato
                  </label>
                  <Select defaultValue="pdf">
                    <SelectTrigger id="formato">
                      <SelectValue placeholder="Selecione o formato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="periodo" className="text-sm font-medium">
                    Período
                  </label>
                  <Select defaultValue="ultimo_mes">
                    <SelectTrigger id="periodo">
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ultimo_mes">Último mês</SelectItem>
                      <SelectItem value="ultimos_3_meses">Últimos 3 meses</SelectItem>
                      <SelectItem value="ultimo_ano">Último ano</SelectItem>
                      <SelectItem value="personalizado">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Exportar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="vendas" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="vendas" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span>Vendas</span>
          </TabsTrigger>
          <TabsTrigger value="estoque" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>Estoque</span>
          </TabsTrigger>
          <TabsTrigger value="clientes" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Clientes</span>
          </TabsTrigger>
          <TabsTrigger value="medicamentos" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            <span>Medicamentos</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vendas" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 12.580,00</div>
                <p className="text-xs text-muted-foreground">+15% em relação ao mês anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 85,30</div>
                <p className="text-xs text-muted-foreground">+5% em relação ao mês anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Número de Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">147</div>
                <p className="text-xs text-muted-foreground">+8% em relação ao mês anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes Atendidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98</div>
                <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Vendas por Período</CardTitle>
                <CardDescription>Evolução das vendas nos últimos 30 dias</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <VendasPorPeriodoChart />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Vendas por Categoria</CardTitle>
                <CardDescription>Distribuição de vendas por categoria de medicamento</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <VendasPorCategoriaChart />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Medicamentos Mais Vendidos</CardTitle>
              <CardDescription>Top 5 medicamentos com maior volume de vendas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Pill className="h-4 w-4 text-teal-500" />
                      <span className="font-medium">Dipirona 500mg</span>
                    </div>
                    <span className="font-medium">R$ 2.995,00</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-teal-500" style={{ width: "85%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>500 unidades</span>
                    <span>85%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Pill className="h-4 w-4 text-teal-500" />
                      <span className="font-medium">Paracetamol 750mg</span>
                    </div>
                    <span className="font-medium">R$ 2.125,00</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-teal-500" style={{ width: "70%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>250 unidades</span>
                    <span>70%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Pill className="h-4 w-4 text-teal-500" />
                      <span className="font-medium">Amoxicilina 250mg</span>
                    </div>
                    <span className="font-medium">R$ 1.912,50</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-teal-500" style={{ width: "65%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>75 unidades</span>
                    <span>65%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Pill className="h-4 w-4 text-teal-500" />
                      <span className="font-medium">Loratadina 10mg</span>
                    </div>
                    <span className="font-medium">R$ 1.520,00</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-teal-500" style={{ width: "55%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>100 unidades</span>
                    <span>55%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Pill className="h-4 w-4 text-teal-500" />
                      <span className="font-medium">Ibuprofeno 400mg</span>
                    </div>
                    <span className="font-medium">R$ 1.275,00</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-teal-500" style={{ width: "45%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>100 unidades</span>
                    <span>45%</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full gap-2">
                <FileText className="h-4 w-4" />
                Ver relatório completo
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="estoque" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total em Estoque</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.248 unidades</div>
                <p className="text-xs text-muted-foreground">Valor estimado: R$ 28.750,00</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Itens Abaixo do Mínimo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-muted-foreground">Necessidade de reposição</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Itens Próximos ao Vencimento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Vencimento nos próximos 30 dias</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Giro de Estoque</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2</div>
                <p className="text-xs text-muted-foreground">Rotatividade mensal</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Distribuição por Categoria</CardTitle>
                <CardDescription>Quantidade de itens por categoria</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <EstoquePorCategoriaChart />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Status de Estoque</CardTitle>
                <CardDescription>Distribuição por status de estoque</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <StatusEstoqueChart />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Movimentações Recentes</CardTitle>
              <CardDescription>Últimas entradas e saídas do estoque</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Dipirona 500mg</span>
                      <span className="text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">Entrada</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Lote: DIP2023-01 | Validade: 12/2025</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">+50 unidades</div>
                    <div className="text-sm text-muted-foreground">10/06/2023</div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Ibuprofeno 400mg</span>
                      <span className="text-xs text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">Saída</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Lote: IBU2023-01 | Validade: 03/2025</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">-15 unidades</div>
                    <div className="text-sm text-muted-foreground">05/06/2023</div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Amoxicilina 250mg</span>
                      <span className="text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">Entrada</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Lote: AMX2023-02 | Validade: 06/2025</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">+30 unidades</div>
                    <div className="text-sm text-muted-foreground">15/06/2023</div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Loratadina 10mg</span>
                      <span className="text-xs text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">Saída</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Lote: LOR2023-03 | Validade: 09/2025</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">-5 unidades</div>
                    <div className="text-sm text-muted-foreground">20/06/2023</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Omeprazol 20mg</span>
                      <span className="text-xs text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">Saída</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Lote: OME2023-01 | Validade: 05/2025</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">-10 unidades</div>
                    <div className="text-sm text-muted-foreground">01/06/2023</div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full gap-2">
                <FileText className="h-4 w-4" />
                Ver relatório completo
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="clientes" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">573</div>
                <p className="text-xs text-muted-foreground">+8% em relação ao mês anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">428</div>
                <p className="text-xs text-muted-foreground">75% do total de clientes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Novos Clientes (Mês)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">+15% em relação ao mês anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Médio por Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 128,50</div>
                <p className="text-xs text-muted-foreground">+5% em relação ao mês anterior</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Novos Clientes por Período</CardTitle>
                <CardDescription>Evolução de novos cadastros nos últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <ClientesPorPeriodoChart />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Distribuição por Status</CardTitle>
                <CardDescription>Proporção de clientes ativos e inativos</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <ClientesPorStatusChart />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Clientes Mais Frequentes</CardTitle>
              <CardDescription>Top 5 clientes com maior número de compras</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-teal-500" />
                      <span className="font-medium">Juliana Lima</span>
                    </div>
                    <span className="font-medium">R$ 1.250,00</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-teal-500" style={{ width: "90%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>15 compras</span>
                    <span>90%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-teal-500" />
                      <span className="font-medium">Roberto Almeida</span>
                    </div>
                    <span className="font-medium">R$ 980,00</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-teal-500" style={{ width: "75%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>12 compras</span>
                    <span>75%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-teal-500" />
                      <span className="font-medium">Marcelo Costa</span>
                    </div>
                    <span className="font-medium">R$ 750,00</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-teal-500" style={{ width: "60%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>7 compras</span>
                    <span>60%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-teal-500" />
                      <span className="font-medium">Carla Souza</span>
                    </div>
                    <span className="font-medium">R$ 620,00</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-teal-500" style={{ width: "50%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>8 compras</span>
                    <span>50%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-teal-500" />
                      <span className="font-medium">Fernando Santos</span>
                    </div>
                    <span className="font-medium">R$ 320,00</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-teal-500" style={{ width: "30%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>3 compras</span>
                    <span>30%</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full gap-2">
                <FileText className="h-4 w-4" />
                Ver relatório completo
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="medicamentos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Medicamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">248</div>
                <p className="text-xs text-muted-foreground">Em 12 categorias diferentes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Medicamentos Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">215</div>
                <p className="text-xs text-muted-foreground">87% do total de medicamentos</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Preço Médio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 25,80</div>
                <p className="text-xs text-muted-foreground">+3% em relação ao mês anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Novos Medicamentos (Mês)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Adicionados este mês</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Medicamentos por Categoria</CardTitle>
                <CardDescription>Distribuição por categoria terapêutica</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <MedicamentosPorCategoriaChart />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Medicamentos por Fabricante</CardTitle>
                <CardDescription>Distribuição por fabricante</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <MedicamentosPorFabricanteChart />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Medicamentos por Faixa de Preço</CardTitle>
              <CardDescription>Distribuição de medicamentos por faixa de preço</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PieChart className="h-4 w-4 text-teal-500" />
                      <span className="font-medium">Até R$ 10,00</span>
                    </div>
                    <span className="font-medium">68 medicamentos</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-teal-500" style={{ width: "28%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>28% do total</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PieChart className="h-4 w-4 text-teal-500" />
                      <span className="font-medium">R$ 10,01 a R$ 25,00</span>
                    </div>
                    <span className="font-medium">95 medicamentos</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-teal-500" style={{ width: "38%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>38% do total</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PieChart className="h-4 w-4 text-teal-500" />
                      <span className="font-medium">R$ 25,01 a R$ 50,00</span>
                    </div>
                    <span className="font-medium">52 medicamentos</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-teal-500" style={{ width: "21%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>21% do total</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PieChart className="h-4 w-4 text-teal-500" />
                      <span className="font-medium">R$ 50,01 a R$ 100,00</span>
                    </div>
                    <span className="font-medium">25 medicamentos</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-teal-500" style={{ width: "10%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>10% do total</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PieChart className="h-4 w-4 text-teal-500" />
                      <span className="font-medium">Acima de R$ 100,00</span>
                    </div>
                    <span className="font-medium">8 medicamentos</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-teal-500" style={{ width: "3%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>3% do total</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full gap-2">
                <FileText className="h-4 w-4" />
                Ver relatório completo
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Componentes de gráficos para visualização
function VendasPorPeriodoChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Sample data
    const dias = Array.from({ length: 30 }, (_, i) => i + 1)
    const vendas = [
      420, 380, 450, 520, 480, 430, 400, 450, 500, 550, 600, 580, 520, 490, 510, 540, 580, 620, 590, 550, 530, 560, 590,
      630, 650, 680, 640, 610, 590, 620,
    ]
    const maxVendas = Math.max(...vendas)

    // Colors
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, "rgba(16, 185, 129, 0.2)")
    gradient.addColorStop(1, "rgba(16, 185, 129, 0)")

    // Calculate spacing
    const padding = 40
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2
    const barSpacing = chartWidth / dias.length

    // Draw axes
    ctx.strokeStyle = "#E5E7EB"
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, canvas.height - padding)
    ctx.lineTo(canvas.width - padding, canvas.height - padding)
    ctx.stroke()

    // Draw horizontal grid lines
    ctx.fillStyle = "#6B7280"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "right"
    for (let i = 0; i <= 4; i++) {
      const value = Math.round((maxVendas / 4) * i)
      const y = canvas.height - padding - (value / maxVendas) * chartHeight
      ctx.fillText(`R$ ${value}`, padding - 5, y + 4)

      ctx.strokeStyle = "#F3F4F6"
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(canvas.width - padding, y)
      ctx.stroke()
    }

    // Draw line chart
    ctx.strokeStyle = "#10B981"
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let i = 0; i < dias.length; i++) {
      const x = padding + i * barSpacing
      const y = canvas.height - padding - (vendas[i] / maxVendas) * chartHeight

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.stroke()

    // Fill area under the line
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.moveTo(padding, canvas.height - padding)
    for (let i = 0; i < dias.length; i++) {
      const x = padding + i * barSpacing
      const y = canvas.height - padding - (vendas[i] / maxVendas) * chartHeight
      ctx.lineTo(x, y)
    }
    ctx.lineTo(padding + (dias.length - 1) * barSpacing, canvas.height - padding)
    ctx.closePath()
    ctx.fill()

    // Draw x-axis labels (only some days to avoid clutter)
    ctx.fillStyle = "#6B7280"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"
    for (let i = 0; i < dias.length; i += 5) {
      const x = padding + i * barSpacing
      ctx.fillText(`${dias[i]}`, x, canvas.height - padding + 15)
    }
  }, [])

  return (
    <div className="h-[300px] w-full">
      <canvas ref={canvasRef} className="h-full w-full"></canvas>
    </div>
  )
}

function VendasPorCategoriaChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Sample data
    const categorias = ["Analgésicos", "Antibióticos", "Anti-inflamatórios", "Antialérgicos", "Outros"]
    const vendas = [35, 25, 20, 15, 5]
    const cores = [
      "#10B981", // Verde
      "#3B82F6", // Azul
      "#F59E0B", // Âmbar
      "#8B5CF6", // Roxo
      "#6B7280", // Cinza
    ]

    // Calculate total
    const total = vendas.reduce((acc, curr) => acc + curr, 0)

    // Calculate center and radius
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 40

    // Draw pie chart
    let startAngle = 0
    for (let i = 0; i < categorias.length; i++) {
      const sliceAngle = (vendas[i] / total) * 2 * Math.PI

      ctx.fillStyle = cores[i]
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.closePath()
      ctx.fill()

      startAngle += sliceAngle
    }

    // Draw center circle (donut hole)
    ctx.fillStyle = "#FFFFFF"
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fill()

    // Draw legend
    const legendX = canvas.width - 150
    const legendY = 30
    const legendSpacing = 25

    for (let i = 0; i < categorias.length; i++) {
      const y = legendY + i * legendSpacing

      // Draw color box
      ctx.fillStyle = cores[i]
      ctx.fillRect(legendX, y, 15, 15)

      // Draw text
      ctx.fillStyle = "#111827"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(`${categorias[i]} (${vendas[i]}%)`, legendX + 20, y + 12)
    }
  }, [])

  return (
    <div className="h-[300px] w-full">
      <canvas ref={canvasRef} className="h-full w-full"></canvas>
    </div>
  )
}

function EstoquePorCategoriaChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Sample data
    const categorias = ["Analgésicos", "Antibióticos", "Anti-inflamatórios", "Antialérgicos", "Antiácidos"]
    const quantidades = [350, 280, 220, 180, 150]
    const maxQuantidade = Math.max(...quantidades)

    // Colors
    const barColors = [
      "#10B981", // Verde
      "#3B82F6", // Azul
      "#F59E0B", // Âmbar
      "#8B5CF6", // Roxo
      "#EC4899", // Rosa
    ]

    // Calculate bar width and spacing
    const padding = 40
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2
    const barWidth = chartWidth / categorias.length - 20

    // Draw axes
    ctx.strokeStyle = "#E5E7EB"
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, canvas.height - padding)
    ctx.lineTo(canvas.width - padding, canvas.height - padding)
    ctx.stroke()

    // Draw horizontal grid lines
    ctx.fillStyle = "#6B7280"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "right"
    for (let i = 0; i <= 4; i++) {
      const value = Math.round((maxQuantidade / 4) * i)
      const y = canvas.height - padding - (value / maxQuantidade) * chartHeight
      ctx.fillText(`${value}`, padding - 5, y + 4)

      ctx.strokeStyle = "#F3F4F6"
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(canvas.width - padding, y)
      ctx.stroke()
    }

    // Draw bars
    for (let i = 0; i < categorias.length; i++) {
      const x = padding + i * (chartWidth / categorias.length) + 10
      const barHeight = (quantidades[i] / maxQuantidade) * chartHeight
      const y = canvas.height - padding - barHeight

      ctx.fillStyle = barColors[i]
      ctx.fillRect(x, y, barWidth, barHeight)

      // Draw category label
      ctx.fillStyle = "#6B7280"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(categorias[i], x + barWidth / 2, canvas.height - padding + 15)

      // Draw quantity on top of bar
      ctx.fillStyle = "#111827"
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`${quantidades[i]}`, x + barWidth / 2, y - 5)
    }
  }, [])

  return (
    <div className="h-[300px] w-full">
      <canvas ref={canvasRef} className="h-full w-full"></canvas>
    </div>
  )
}

function StatusEstoqueChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Sample data
    const status = ["Em estoque", "Estoque baixo", "Sem estoque"]
    const quantidades = [180, 45, 23]
    const cores = [
      "#10B981", // Verde
      "#F59E0B", // Âmbar
      "#EF4444", // Vermelho
    ]

    // Calculate total
    const total = quantidades.reduce((acc, curr) => acc + curr, 0)

    // Calculate center and radius
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 40

    // Draw pie chart
    let startAngle = 0
    for (let i = 0; i < status.length; i++) {
      const sliceAngle = (quantidades[i] / total) * 2 * Math.PI

      ctx.fillStyle = cores[i]
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.closePath()
      ctx.fill()

      startAngle += sliceAngle
    }

    // Draw center circle (donut hole)
    ctx.fillStyle = "#FFFFFF"
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fill()

    // Draw total in center
    ctx.fillStyle = "#111827"
    ctx.font = "bold 24px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(`${total}`, centerX, centerY - 10)

    ctx.font = "14px sans-serif"
    ctx.fillText("Total", centerX, centerY + 15)

    // Draw legend
    const legendX = 30
    const legendY = 30
    const legendSpacing = 25

    for (let i = 0; i < status.length; i++) {
      const y = legendY + i * legendSpacing

      // Draw color box
      ctx.fillStyle = cores[i]
      ctx.fillRect(legendX, y, 15, 15)

      // Draw text
      ctx.fillStyle = "#111827"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(`${status[i]} (${quantidades[i]})`, legendX + 20, y + 12)
    }
  }, [])

  return (
    <div className="h-[300px] w-full">
      <canvas ref={canvasRef} className="h-full w-full"></canvas>
    </div>
  )
}

function ClientesPorPeriodoChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Sample data
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"]
    const clientes = [28, 35, 32, 38, 40, 42]
    const maxClientes = Math.max(...clientes)

    // Colors
    const barColors = [
      "#10B981", // Verde
      "#10B981", // Verde
      "#10B981", // Verde
      "#10B981", // Verde
      "#10B981", // Verde
      "#10B981", // Verde
    ]

    // Calculate bar width and spacing
    const padding = 40
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2
    const barWidth = chartWidth / meses.length - 20

    // Draw axes
    ctx.strokeStyle = "#E5E7EB"
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, canvas.height - padding)
    ctx.lineTo(canvas.width - padding, canvas.height - padding)
    ctx.stroke()

    // Draw horizontal grid lines
    ctx.fillStyle = "#6B7280"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "right"
    for (let i = 0; i <= 4; i++) {
      const value = Math.round((maxClientes / 4) * i)
      const y = canvas.height - padding - (value / maxClientes) * chartHeight
      ctx.fillText(`${value}`, padding - 5, y + 4)

      ctx.strokeStyle = "#F3F4F6"
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(canvas.width - padding, y)
      ctx.stroke()
    }

    // Draw bars
    for (let i = 0; i < meses.length; i++) {
      const x = padding + i * (chartWidth / meses.length) + 10
      const barHeight = (clientes[i] / maxClientes) * chartHeight
      const y = canvas.height - padding - barHeight

      ctx.fillStyle = barColors[i]
      ctx.fillRect(x, y, barWidth, barHeight)

      // Draw month label
      ctx.fillStyle = "#6B7280"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(meses[i].substring(0, 3), x + barWidth / 2, canvas.height - padding + 15)

      // Draw quantity on top of bar
      ctx.fillStyle = "#111827"
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`${clientes[i]}`, x + barWidth / 2, y - 5)
    }
  }, [])

  return (
    <div className="h-[300px] w-full">
      <canvas ref={canvasRef} className="h-full w-full"></canvas>
    </div>
  )
}

function ClientesPorStatusChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Sample data
    const status = ["Ativos", "Inativos"]
    const quantidades = [428, 145]
    const cores = [
      "#10B981", // Verde
      "#6B7280", // Cinza
    ]

    // Calculate total
    const total = quantidades.reduce((acc, curr) => acc + curr, 0)

    // Calculate center and radius
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 40

    // Draw pie chart
    let startAngle = 0
    for (let i = 0; i < status.length; i++) {
      const sliceAngle = (quantidades[i] / total) * 2 * Math.PI

      ctx.fillStyle = cores[i]
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.closePath()
      ctx.fill()

      startAngle += sliceAngle
    }

    // Draw center circle (donut hole)
    ctx.fillStyle = "#FFFFFF"
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fill()

    // Draw total in center
    ctx.fillStyle = "#111827"
    ctx.font = "bold 24px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(`${total}`, centerX, centerY - 10)

    ctx.font = "14px sans-serif"
    ctx.fillText("Total", centerX, centerY + 15)

    // Draw legend
    const legendX = canvas.width - 150
    const legendY = 30
    const legendSpacing = 25

    for (let i = 0; i < status.length; i++) {
      const y = legendY + i * legendSpacing

      // Draw color box
      ctx.fillStyle = cores[i]
      ctx.fillRect(legendX, y, 15, 15)

      // Draw text
      ctx.fillStyle = "#111827"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "left"
      const percentage = Math.round((quantidades[i] / total) * 100)
      ctx.fillText(`${status[i]} (${percentage}%)`, legendX + 20, y + 12)
    }
  }, [])

  return (
    <div className="h-[300px] w-full">
      <canvas ref={canvasRef} className="h-full w-full"></canvas>
    </div>
  )
}

function MedicamentosPorCategoriaChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Sample data
    const categorias = ["Analgésicos", "Antibióticos", "Anti-inflamatórios", "Antialérgicos", "Antiácidos", "Outros"]
    const quantidades = [65, 42, 38, 35, 28, 40]
    const cores = [
      "#10B981", // Verde
      "#3B82F6", // Azul
      "#F59E0B", // Âmbar
      "#8B5CF6", // Roxo
      "#EC4899", // Rosa
      "#6B7280", // Cinza
    ]

    // Calculate total
    const total = quantidades.reduce((acc, curr) => acc + curr, 0)

    // Calculate center and radius
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 40

    // Draw pie chart
    let startAngle = 0
    for (let i = 0; i < categorias.length; i++) {
      const sliceAngle = (quantidades[i] / total) * 2 * Math.PI

      ctx.fillStyle = cores[i]
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.closePath()
      ctx.fill()

      startAngle += sliceAngle
    }

    // Draw center circle (donut hole)
    ctx.fillStyle = "#FFFFFF"
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fill()

    // Draw total in center
    ctx.fillStyle = "#111827"
    ctx.font = "bold 24px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(`${total}`, centerX, centerY - 10)

    ctx.font = "14px sans-serif"
    ctx.fillText("Total", centerX, centerY + 15)

    // Draw legend
    const legendX = 30
    const legendY = 30
    const legendSpacing = 25

    for (let i = 0; i < categorias.length; i++) {
      const y = legendY + i * legendSpacing

      // Draw color box
      ctx.fillStyle = cores[i]
      ctx.fillRect(legendX, y, 15, 15)

      // Draw text
      ctx.fillStyle = "#111827"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "left"
      const percentage = Math.round((quantidades[i] / total) * 100)
      ctx.fillText(`${categorias[i]} (${percentage}%)`, legendX + 20, y + 12)
    }
  }, [])

  return (
    <div className="h-[300px] w-full">
      <canvas ref={canvasRef} className="h-full w-full"></canvas>
    </div>
  )
}

function MedicamentosPorFabricanteChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Sample data
    const fabricantes = ["Medley", "EMS", "Neo Química", "Cimed", "Eurofarma", "Outros"]
    const quantidades = [58, 52, 45, 38, 30, 25]
    const maxQuantidade = Math.max(...quantidades)

    // Colors
    const barColors = [
      "#10B981", // Verde
      "#3B82F6", // Azul
      "#F59E0B", // Âmbar
      "#8B5CF6", // Roxo
      "#EC4899", // Rosa
      "#6B7280", // Cinza
    ]

    // Calculate bar width and spacing
    const padding = 40
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2
    const barWidth = chartWidth / fabricantes.length - 20

    // Draw axes
    ctx.strokeStyle = "#E5E7EB"
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, canvas.height - padding)
    ctx.lineTo(canvas.width - padding, canvas.height - padding)
    ctx.stroke()

    // Draw horizontal grid lines
    ctx.fillStyle = "#6B7280"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "right"
    for (let i = 0; i <= 4; i++) {
      const value = Math.round((maxQuantidade / 4) * i)
      const y = canvas.height - padding - (value / maxQuantidade) * chartHeight
      ctx.fillText(`${value}`, padding - 5, y + 4)

      ctx.strokeStyle = "#F3F4F6"
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(canvas.width - padding, y)
      ctx.stroke()
    }

    // Draw bars
    for (let i = 0; i < fabricantes.length; i++) {
      const x = padding + i * (chartWidth / fabricantes.length) + 10
      const barHeight = (quantidades[i] / maxQuantidade) * chartHeight
      const y = canvas.height - padding - barHeight

      ctx.fillStyle = barColors[i]
      ctx.fillRect(x, y, barWidth, barHeight)

      // Draw fabricante label
      ctx.fillStyle = "#6B7280"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(fabricantes[i], x + barWidth / 2, canvas.height - padding + 15)

      // Draw quantity on top of bar
      ctx.fillStyle = "#111827"
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`${quantidades[i]}`, x + barWidth / 2, y - 5)
    }
  }, [])

  return (
    <div className="h-[300px] w-full">
      <canvas ref={canvasRef} className="h-full w-full"></canvas>
    </div>
  )
}

