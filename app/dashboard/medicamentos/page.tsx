import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MoreHorizontal, Filter } from "lucide-react"

export default function MedicamentosPage() {
  // Exemplo de dados de medicamentos
  const medicamentos = [
    {
      id: 1,
      nome: "Dipirona 500mg",
      categoria: "Analgésico",
      fabricante: "Medley",
      estoque: 120,
      status: "Em estoque",
      preco: 5.99,
      validade: "12/2025",
    },
    {
      id: 2,
      nome: "Amoxicilina 250mg",
      categoria: "Antibiótico",
      fabricante: "EMS",
      estoque: 45,
      status: "Em estoque",
      preco: 25.5,
      validade: "06/2025",
    },
    {
      id: 3,
      nome: "Ibuprofeno 400mg",
      categoria: "Anti-inflamatório",
      fabricante: "Neo Química",
      estoque: 10,
      status: "Estoque baixo",
      preco: 12.75,
      validade: "03/2025",
    },
    {
      id: 4,
      nome: "Loratadina 10mg",
      categoria: "Antialérgico",
      fabricante: "Cimed",
      estoque: 78,
      status: "Em estoque",
      preco: 15.2,
      validade: "09/2025",
    },
    {
      id: 5,
      nome: "Omeprazol 20mg",
      categoria: "Antiácido",
      fabricante: "Medley",
      estoque: 0,
      status: "Sem estoque",
      preco: 18.9,
      validade: "05/2025",
    },
    {
      id: 6,
      nome: "Paracetamol 750mg",
      categoria: "Analgésico",
      fabricante: "EMS",
      estoque: 95,
      status: "Em estoque",
      preco: 8.5,
      validade: "10/2025",
    },
    {
      id: 7,
      nome: "Azitromicina 500mg",
      categoria: "Antibiótico",
      fabricante: "Neo Química",
      estoque: 5,
      status: "Estoque baixo",
      preco: 32.8,
      validade: "04/2025",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medicamentos</h1>
          <p className="text-muted-foreground">Gerencie o catálogo de medicamentos</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Medicamento
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center gap-2">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar medicamentos..." className="w-full pl-8" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filtrar</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Categoria</DropdownMenuItem>
              <DropdownMenuItem>Fabricante</DropdownMenuItem>
              <DropdownMenuItem>Status de estoque</DropdownMenuItem>
              <DropdownMenuItem>Validade</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
              <SelectItem value="anti-inflamatorio">Anti-inflamatório</SelectItem>
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
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Fabricante</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medicamentos.map((medicamento) => (
              <TableRow key={medicamento.id}>
                <TableCell className="font-medium">{medicamento.nome}</TableCell>
                <TableCell>{medicamento.categoria}</TableCell>
                <TableCell>{medicamento.fabricante}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {medicamento.estoque}
                    <Badge
                      variant={
                        medicamento.status === "Em estoque"
                          ? "default"
                          : medicamento.status === "Estoque baixo"
                            ? "warning"
                            : "destructive"
                      }
                      className="ml-2"
                    >
                      {medicamento.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>R$ {medicamento.preco.toFixed(2)}</TableCell>
                <TableCell>{medicamento.validade}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Visualizar detalhes</DropdownMenuItem>
                      <DropdownMenuItem>Atualizar estoque</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

