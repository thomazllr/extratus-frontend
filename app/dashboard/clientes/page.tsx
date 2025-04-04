"use client";

import { useEffect, useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MoreHorizontal,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

export default function ClientesPage() {
  // Estados existentes
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [doencas, setDoencas] = useState([]);
  const [doencasSelecionadas, setDoencasSelecionadas] = useState<number[]>([]);
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);
  const [formErrors, setFormErrors] = useState({
    nome: false,
    email: false,
    telefone: false,
    endereco: false,
  });

  // Buscar dados
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doencasRes, clientesRes] = await Promise.all([
          fetch("/api/doenca").then((res) => res.json()),
          fetch("/api/clientes").then((res) => res.json()),
        ]);
        setDoencas(doencasRes);
        setClientes(clientesRes);
      } catch (error) {
        toast.error("Erro ao carregar dados");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Validar formulário
  const validateForm = () => {
    const errors = {
      nome: nome.trim() === "",
      email: !/^\S+@\S+\.\S+$/.test(email),
      telefone: telefone.trim() === "",
      endereco: endereco.trim() === "",
    };
    setFormErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  // Cadastrar cliente
  async function handleSubmit() {
    if (!validateForm()) {
      toast.error("Preencha todos os campos corretamente");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          telefone,
          endereco,
          doencas: doencasSelecionadas,
        }),
      });

      if (res.ok) {
        toast.success("Cliente cadastrado com sucesso!");
        resetForm();
        const updatedClientes = await fetch("/api/clientes").then((r) =>
          r.json()
        );
        setClientes(updatedClientes);
      } else {
        toast.error("Erro ao cadastrar cliente");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao cadastrar cliente");
    } finally {
      setIsLoading(false);
    }
  }

  // Resetar formulário
  const resetForm = () => {
    setNome("");
    setEmail("");
    setTelefone("");
    setEndereco("");
    setDoencasSelecionadas([]);
    setFormErrors({
      nome: false,
      email: false,
      telefone: false,
      endereco: false,
    });
  };

  // Filtrar clientes
  const filteredClientes = clientes.filter(
    (cliente: any) =>
      cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.telefone.includes(searchTerm)
  );

  // Verificar se formulário está válido para habilitar botão
  const isFormValid =
    nome.trim() !== "" &&
    /^\S+@\S+\.\S+$/.test(email) &&
    telefone.trim() !== "" &&
    endereco.trim() !== "";

  return (
    <div className="space-y-6 p-6">
      {/* Cabeçalho e busca */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Clientes
          </h1>
          <p className="text-muted-foreground">
            Gerencie os clientes cadastrados no sistema
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar clientes..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Modal de Cadastro */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-md bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600">
                <UserPlus className="h-4 w-4" /> Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
                <DialogDescription>
                  Preencha todos os campos para cadastrar um novo cliente.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Input
                    id="nome"
                    placeholder="Nome Completo*"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className={formErrors.nome ? "border-red-500" : ""}
                  />
                  {formErrors.nome && (
                    <p className="text-sm text-red-500">Nome é obrigatório</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email*"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={formErrors.email ? "border-red-500" : ""}
                  />
                  {formErrors.email && (
                    <p className="text-sm text-red-500">Email inválido</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Input
                    id="telefone"
                    placeholder="Telefone*"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className={formErrors.telefone ? "border-red-500" : ""}
                  />
                  {formErrors.telefone && (
                    <p className="text-sm text-red-500">
                      Telefone é obrigatório
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Input
                    id="endereco"
                    placeholder="Endereço*"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    className={formErrors.endereco ? "border-red-500" : ""}
                  />
                  {formErrors.endereco && (
                    <p className="text-sm text-red-500">
                      Endereço é obrigatório
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Doenças</label>
                  <div className="grid gap-2 max-h-40 overflow-y-auto border rounded p-2">
                    {doencas.map((d: any) => (
                      <label
                        key={d.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Checkbox
                          checked={doencasSelecionadas.includes(d.id)}
                          onCheckedChange={(checked) => {
                            setDoencasSelecionadas((prev) =>
                              checked
                                ? [...prev, d.id]
                                : prev.filter((id) => id !== d.id)
                            );
                          }}
                        />
                        {d.nome}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
                  disabled={isLoading || !isFormValid}
                >
                  {isLoading ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabela de Clientes */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="rounded-lg border shadow-sm bg-white dark:bg-gray-900 overflow-hidden">
          <Table>
            <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              <TableRow>
                <TableHead className="w-[300px] font-semibold">
                  Cliente
                </TableHead>
                <TableHead className="font-semibold">Contato</TableHead>
                <TableHead className="font-semibold">Doenças</TableHead>
                <TableHead className="text-right font-semibold">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.length > 0 ? (
                filteredClientes.map((cliente: any) => (
                  <TableRow
                    key={cliente.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border-2 border-white shadow">
                          <AvatarImage
                            src="/placeholder.svg"
                            alt={cliente.nome}
                          />
                          <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                            {cliente.nome
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .substring(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{cliente.nome}</div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate max-w-[180px]">
                              {cliente.endereco}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{cliente.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{cliente.telefone}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {cliente.doencas?.map((doenca: string) => (
                          <Badge
                            key={doenca}
                            variant="outline"
                            className="border-blue-100 bg-blue-50 text-blue-600 dark:border-blue-900 dark:bg-blue-900/50 dark:text-blue-300"
                          >
                            {doenca}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 border border-gray-200 shadow-lg dark:border-gray-700"
                        >
                          <DropdownMenuLabel className="font-semibold">
                            Ações
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => setClienteSelecionado(cliente)}
                          >
                            <span>Visualizar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <span>Editar</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600 cursor-pointer">
                            <span>Excluir</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    {searchTerm
                      ? "Nenhum cliente encontrado"
                      : "Nenhum cliente cadastrado"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modal de Visualização */}
      <Dialog
        open={!!clienteSelecionado}
        onOpenChange={(open) => !open && setClienteSelecionado(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          {clienteSelecionado && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  Detalhes do Cliente
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-blue-100 shadow">
                    <AvatarImage
                      src="/placeholder.svg"
                      alt={clienteSelecionado.nome}
                    />
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xl">
                      {clienteSelecionado.nome
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {clienteSelecionado.nome}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      ID: {clienteSelecionado.id}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-500" />
                      Email
                    </h4>
                    <p className="text-sm">{clienteSelecionado.email}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4 text-blue-500" />
                      Telefone
                    </h4>
                    <p className="text-sm">{clienteSelecionado.telefone}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      Endereço
                    </h4>
                    <p className="text-sm">{clienteSelecionado.endereco}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Doenças</h4>
                    <div className="flex flex-wrap gap-2">
                      {clienteSelecionado.doencas?.length > 0 ? (
                        clienteSelecionado.doencas.map((doenca: string) => (
                          <Badge
                            key={doenca}
                            variant="outline"
                            className="border-blue-100 bg-blue-50 text-blue-600 dark:border-blue-900 dark:bg-blue-900/50 dark:text-blue-300"
                          >
                            {doenca}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Nenhuma doença registrada
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
