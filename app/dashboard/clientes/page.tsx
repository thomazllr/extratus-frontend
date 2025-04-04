import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, Filter, UserPlus } from "lucide-react"

export default function ClientesPage() {
  // Exemplo de dados de clientes
  const clientes = [
    {
      id: 1,
      nome: "Roberto Almeida",
      email: "roberto.almeida@email.com",
      telefone: "(11) 98765-4321",
      endereco: "Rua das Flores, 123 - São Paulo, SP",
      ultimaCompra: "15/03/2023",
      status: "Ativo",
      historico: 12,
    },
    {
      id: 2,
      nome: "Carla Souza",
      email: "carla.souza@email.com",
      telefone: "(21) 98765-4321",
      endereco: "Av. Atlântica, 456 - Rio de Janeiro, RJ",
      ultimaCompra: "22/05/2023",
      status: "Ativo",
      historico: 8,
    },
    {
      id: 3,
      nome: "Fernando Santos",
      email: "fernando.santos@email.com",
      telefone: "(31) 98765-4321",
      endereco: "Rua dos Ipês, 789 - Belo Horizonte, MG",
      ultimaCompra: "10/01/2023",
      status: "Inativo",
      historico: 3,
    },
    {
      id: 4,
      nome: "Juliana Lima",
      email: "juliana.lima@email.com",
      telefone: "(41) 98765-4321",
      endereco: "Av. das Araucárias, 321 - Curitiba, PR",
      ultimaCompra: "05/06/2023",
      status: "Ativo",
      historico: 15,
    },
    {
      id: 5,
      nome: "Marcelo Costa",
      email: "marcelo.costa@email.com",
      telefone: "(51) 98765-4321",
      endereco: "Rua da Praia, 654 - Porto Alegre, RS",
      ultimaCompra: "18/04/2023",
      status: "Ativo",
      historico: 7,
    },
    {
      id: 6,
      nome: "Patricia Oliveira",
      email: "patricia.oliveira@email.com",
      telefone: "(81) 98765-4321",
      endereco: "Av. Boa Viagem, 987 - Recife, PE",
      ultimaCompra: "30/12/2022",
      status: "Inativo",
      historico: 2,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">Gerencie os clientes cadastrados no sistema</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
              <DialogDescription>Preencha os dados do cliente para cadastrá-lo no sistema.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="nome" className="text-sm font-medium">
                  Nome Completo
                </label>
                <Input id="nome" placeholder="Nome do cliente" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input id="email" type="email" placeholder="email@exemplo.com" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="telefone" className="text-sm font-medium">
                  Telefone
                </label>
                <Input id="telefone" placeholder="(00) 00000-0000" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="endereco" className="text-sm font-medium">
                  Endereço
                </label>
                <Input id="endereco" placeholder="Rua, número, bairro, cidade, estado" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancelar</Button>
              <Button>Cadastrar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center gap-2">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar clientes..." className="w-full pl-8" />
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
              <DropdownMenuItem>Status</DropdownMenuItem>
              <DropdownMenuItem>Data da última compra</DropdownMenuItem>
              <DropdownMenuItem>Histórico de compras</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Última Compra</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Histórico</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="/placeholder.svg" alt={cliente.nome} />
                      <AvatarFallback>
                        {cliente.nome
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{cliente.nome}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-[200px]">{cliente.endereco}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{cliente.email}</div>
                    <div>{cliente.telefone}</div>
                  </div>
                </TableCell>
                <TableCell>{cliente.ultimaCompra}</TableCell>
                <TableCell>
                  <Badge variant={cliente.status === "Ativo" ? "default" : "secondary"}>{cliente.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span>{cliente.historico}</span>
                    <span className="text-xs text-muted-foreground">compras</span>
                  </div>
                </TableCell>
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
                      <DropdownMenuItem>Ver histórico</DropdownMenuItem>
                      <DropdownMenuItem>Enviar mensagem</DropdownMenuItem>
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

