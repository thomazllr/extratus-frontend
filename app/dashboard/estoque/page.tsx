import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  Clock,
  Download,
  Filter,
  Plus,
  Search,
  Trash,
} from "lucide-react";

export default function EstoquePage() {
  // Exemplo de dados de estoque
  const estoqueAtual = [
    {
      id: 1,
      medicamento: "Dipirona 500mg",
      categoria: "Analgésico",
      quantidade: 120,
      lote: "DIP2023-01",
      validade: "12/2025",
      status: "Em estoque",
      ultimaAtualizacao: "10/06/2023",
    },
    {
      id: 2,
      medicamento: "Amoxicilina 250mg",
      categoria: "Antibiótico",
      quantidade: 45,
      lote: "AMX2023-02",
      validade: "06/2025",
      status: "Em estoque",
      ultimaAtualizacao: "15/06/2023",
    },
    {
      id: 3,
      medicamento: "Ibuprofeno 400mg",
      categoria: "Anti-inflamatório",
      quantidade: 10,
      lote: "IBU2023-01",
      validade: "03/2025",
      status: "Estoque baixo",
      ultimaAtualizacao: "05/06/2023",
    },
    {
      id: 4,
      medicamento: "Loratadina 10mg",
      categoria: "Antialérgico",
      quantidade: 78,
      lote: "LOR2023-03",
      validade: "09/2025",
      status: "Em estoque",
      ultimaAtualizacao: "20/06/2023",
    },
    {
      id: 5,
      medicamento: "Omeprazol 20mg",
      categoria: "Antiácido",
      quantidade: 0,
      lote: "OME2023-01",
      validade: "05/2025",
      status: "Sem estoque",
      ultimaAtualizacao: "01/06/2023",
    },
  ];

  const movimentacoes = [
    {
      id: 1,
      medicamento: "Dipirona 500mg",
      tipo: "entrada",
      quantidade: 50,
      data: "10/06/2023",
      responsavel: "João Silva",
      observacao: "Reposição de estoque",
    },
    {
      id: 2,
      medicamento: "Ibuprofeno 400mg",
      tipo: "saida",
      quantidade: 15,
      data: "05/06/2023",
      responsavel: "Maria Oliveira",
      observacao: "Venda para cliente",
    },
    {
      id: 3,
      medicamento: "Amoxicilina 250mg",
      tipo: "entrada",
      quantidade: 30,
      data: "15/06/2023",
      responsavel: "Carlos Santos",
      observacao: "Compra de fornecedor",
    },
    {
      id: 4,
      medicamento: "Loratadina 10mg",
      tipo: "saida",
      quantidade: 5,
      data: "20/06/2023",
      responsavel: "Ana Pereira",
      observacao: "Venda para cliente",
    },
    {
      id: 5,
      medicamento: "Omeprazol 20mg",
      tipo: "saida",
      quantidade: 10,
      data: "01/06/2023",
      responsavel: "Lucas Ferreira",
      observacao: "Venda para cliente",
    },
  ];

  const alertas = [
    {
      id: 1,
      medicamento: "Ibuprofeno 400mg",
      tipo: "estoque_baixo",
      mensagem: "Estoque abaixo do mínimo (10 unidades)",
      data: "05/06/2023",
      prioridade: "alta",
    },
    {
      id: 2,
      medicamento: "Omeprazol 20mg",
      tipo: "sem_estoque",
      mensagem: "Produto sem estoque",
      data: "01/06/2023",
      prioridade: "alta",
    },
    {
      id: 3,
      medicamento: "Azitromicina 500mg",
      tipo: "estoque_baixo",
      mensagem: "Estoque abaixo do mínimo (5 unidades)",
      data: "12/06/2023",
      prioridade: "alta",
    },
    {
      id: 4,
      medicamento: "Dipirona 500mg",
      tipo: "proxima_validade",
      mensagem: "Lote DIP2022-05 próximo ao vencimento (07/2023)",
      data: "15/06/2023",
      prioridade: "media",
    },
    {
      id: 5,
      medicamento: "Paracetamol 750mg",
      tipo: "proxima_validade",
      mensagem: "Lote PAR2022-08 próximo ao vencimento (08/2023)",
      data: "18/06/2023",
      prioridade: "media",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estoque</h1>
          <p className="text-muted-foreground">
            Gerencie o estoque de medicamentos
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Exportar Relatório de Estoque</DialogTitle>
                <DialogDescription>
                  Selecione o formato e os dados que deseja exportar.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
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
                  <label htmlFor="dados" className="text-sm font-medium">
                    Dados
                  </label>
                  <Select defaultValue="todos">
                    <SelectTrigger id="dados">
                      <SelectValue placeholder="Selecione os dados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os dados</SelectItem>
                      <SelectItem value="estoque_atual">
                        Apenas estoque atual
                      </SelectItem>
                      <SelectItem value="movimentacoes">
                        Apenas movimentações
                      </SelectItem>
                      <SelectItem value="alertas">Apenas alertas</SelectItem>
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
                      <SelectItem value="ultimos_3_meses">
                        Últimos 3 meses
                      </SelectItem>
                      <SelectItem value="ultimo_ano">Último ano</SelectItem>
                      <SelectItem value="personalizado">
                        Personalizado
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Exportar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nova Movimentação
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Registrar Movimentação</DialogTitle>
                <DialogDescription>
                  Registre uma entrada ou saída de medicamentos no estoque.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="medicamento" className="text-sm font-medium">
                    Medicamento
                  </label>
                  <Select>
                    <SelectTrigger id="medicamento">
                      <SelectValue placeholder="Selecione o medicamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dipirona">Dipirona 500mg</SelectItem>
                      <SelectItem value="amoxicilina">
                        Amoxicilina 250mg
                      </SelectItem>
                      <SelectItem value="ibuprofeno">
                        Ibuprofeno 400mg
                      </SelectItem>
                      <SelectItem value="loratadina">
                        Loratadina 10mg
                      </SelectItem>
                      <SelectItem value="omeprazol">Omeprazol 20mg</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="tipo" className="text-sm font-medium">
                    Tipo de Movimentação
                  </label>
                  <Select>
                    <SelectTrigger id="tipo">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entrada">Entrada</SelectItem>
                      <SelectItem value="saida">Saída</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="quantidade" className="text-sm font-medium">
                    Quantidade
                  </label>
                  <Input
                    id="quantidade"
                    type="number"
                    min="1"
                    placeholder="Quantidade"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="observacao" className="text-sm font-medium">
                    Observação
                  </label>
                  <Input id="observacao" placeholder="Motivo da movimentação" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Registrar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total em Estoque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">253</div>
            <p className="text-xs text-muted-foreground">
              5 categorias diferentes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Entradas (Mês)
            </CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">80</div>
            <p className="text-xs text-muted-foreground">
              +15% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saídas (Mês)</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">30</div>
            <p className="text-xs text-muted-foreground">
              +8% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Alertas Ativos
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              3 de alta prioridade
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="estoque" className="space-y-4">
        <TabsList>
          <TabsTrigger value="estoque">Estoque Atual</TabsTrigger>
          <TabsTrigger value="movimentacoes">Movimentações</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
        </TabsList>
        <TabsContent value="estoque" className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full max-w-sm items-center gap-2">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar medicamentos..."
                  className="w-full pl-8"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filtrar</span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="todos">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="em-estoque">Em estoque</SelectItem>
                  <SelectItem value="estoque-baixo">Estoque baixo</SelectItem>
                  <SelectItem value="sem-estoque">Sem estoque</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="todos">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas as categorias</SelectItem>
                  <SelectItem value="analgesico">Analgésico</SelectItem>
                  <SelectItem value="antibiotico">Antibiótico</SelectItem>
                  <SelectItem value="anti-inflamatorio">
                    Anti-inflamatório
                  </SelectItem>
                  <SelectItem value="antialergico">Antialérgico</SelectItem>
                  <SelectItem value="antiacido">Antiácido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicamento</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Lote</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Última Atualização</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estoqueAtual.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.medicamento}
                    </TableCell>
                    <TableCell>{item.categoria}</TableCell>
                    <TableCell>{item.quantidade}</TableCell>
                    <TableCell>{item.lote}</TableCell>
                    <TableCell>{item.validade}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "Em estoque"
                            ? "default"
                            : item.status === "Estoque baixo"
                            ? "outline"
                            : "destructive"
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.ultimaAtualizacao}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="movimentacoes" className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full max-w-sm items-center gap-2">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar movimentações..."
                  className="w-full pl-8"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filtrar</span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="todos">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="saida">Saída</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Calendar className="h-4 w-4" />
                <span className="sr-only">Selecionar período</span>
              </Button>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicamento</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Observação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movimentacoes.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.medicamento}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {item.tipo === "entrada" ? (
                          <ArrowDownCircle className="h-4 w-4 text-teal-500" />
                        ) : (
                          <ArrowUpCircle className="h-4 w-4 text-rose-500" />
                        )}
                        <span className="capitalize">{item.tipo}</span>
                      </div>
                    </TableCell>
                    <TableCell>{item.quantidade}</TableCell>
                    <TableCell>{item.data}</TableCell>
                    <TableCell>{item.responsavel}</TableCell>
                    <TableCell>{item.observacao}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="alertas" className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full max-w-sm items-center gap-2">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar alertas..."
                  className="w-full pl-8"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filtrar</span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="todos">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas as prioridades</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="todos">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  <SelectItem value="estoque_baixo">Estoque baixo</SelectItem>
                  <SelectItem value="sem_estoque">Sem estoque</SelectItem>
                  <SelectItem value="proxima_validade">
                    Próximo ao vencimento
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-4">
            {alertas.map((alerta) => (
              <Card
                key={alerta.id}
                className={
                  alerta.prioridade === "alta"
                    ? "border-red-200 bg-red-50"
                    : alerta.prioridade === "media"
                    ? "border-amber-200 bg-amber-50"
                    : "border-blue-200 bg-blue-50"
                }
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <AlertCircle
                          className={
                            alerta.prioridade === "alta"
                              ? "h-5 w-5 text-red-500"
                              : alerta.prioridade === "media"
                              ? "h-5 w-5 text-amber-500"
                              : "h-5 w-5 text-blue-500"
                          }
                        />
                        <h4 className="font-semibold">{alerta.medicamento}</h4>
                        <Badge
                          variant={
                            alerta.prioridade === "alta"
                              ? "destructive"
                              : alerta.prioridade === "media"
                              ? "outline"
                              : "default"
                          }
                          className="ml-2 capitalize"
                        >
                          {alerta.prioridade}
                        </Badge>
                      </div>
                      <p className="text-sm">{alerta.mensagem}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{alerta.data}</span>
                      <Button variant="ghost" size="icon" className="ml-2">
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Remover alerta</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
