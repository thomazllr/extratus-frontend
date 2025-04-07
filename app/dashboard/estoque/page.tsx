"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Check } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function EstoquePage() {
  // Estado para controle da tabela
  const [movimentacoes, setMovimentacoes] = useState<any[]>([]);
  const [loadingTable, setLoadingTable] = useState(true);

  // Estado para o diálogo de nova movimentação
  const [clientes, setClientes] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [tiposPagamento, setTiposPagamento] = useState<any[]>([]);
  const [loadingDialog, setLoadingDialog] = useState(false);

  const [clienteId, setClienteId] = useState<number | null>(null);
  const [itens, setItens] = useState([
    { produto_id: 0, quantidade: 1, preco_unitario: 0 },
  ]);
  const [statusPagamento, setStatusPagamento] = useState("pendente");
  const [tipoPagamentoId, setTipoPagamentoId] = useState<number | null>(null);
  const [observacao, setObservacao] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  // Carregar movimentações para a tabela
  const carregarMovimentacoes = async () => {
    try {
      setLoadingTable(true);
      const res = await fetch("/api/estoque");
      const data = await res.json();

      // Garantir que os totais sejam números
      const movimentacoesFormatadas = data.map((mov: any) => ({
        ...mov,
        total:
          typeof mov.total === "number" ? mov.total : Number(mov.total) || 0,
        // Formatar preços dos itens
        item_venda: mov.item_venda?.map((item: any) => ({
          ...item,
          preco_unitario:
            typeof item.preco_unitario === "number"
              ? item.preco_unitario
              : Number(item.preco_unitario) || 0,
        })),
      }));

      setMovimentacoes(movimentacoesFormatadas);
    } catch (error) {
      console.error("Erro ao carregar movimentações:", error);
      toast.error("Erro ao carregar movimentações");
    } finally {
      setLoadingTable(false);
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoadingDialog(true);
        const [clientesRes, produtosRes, tiposPagamentoRes] = await Promise.all(
          [
            fetch("/api/clientes").then((res) => res.json()),
            fetch("/api/produtos").then((res) => res.json()),
            fetch("/api/tipos-pagamento").then((res) => res.json()),
          ]
        );

        setClientes(clientesRes);
        setProdutos(produtosRes);
        setTiposPagamento(tiposPagamentoRes);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados iniciais");
      } finally {
        setLoadingDialog(false);
      }
    };

    fetchInitialData();
    carregarMovimentacoes();
  }, []);

  // Funções para manipulação dos itens
  const calcularTotal = () => {
    return itens.reduce(
      (acc, item) => acc + item.quantidade * (item.preco_unitario || 0),
      0
    );
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const novaLista = [...itens];
    const itemAtualizado = { ...novaLista[index], [field]: value };

    if (field === "produto_id") {
      const produtoSelecionado = produtos.find((p) => p.id === String(value));
      if (produtoSelecionado) {
        itemAtualizado.preco_unitario = Number(produtoSelecionado.preco) || 0;
      }
    }

    novaLista[index] = itemAtualizado;
    setItens(novaLista);
  };

  const adicionarItem = () => {
    setItens([...itens, { produto_id: 0, quantidade: 1, preco_unitario: 0 }]);
  };

  const removerItem = (index: number) => {
    const novaLista = [...itens];
    novaLista.splice(index, 1);
    setItens(
      novaLista.length
        ? novaLista
        : [{ produto_id: 0, quantidade: 1, preco_unitario: 0 }]
    );
  };

  const resetForm = () => {
    setClienteId(null);
    setItens([{ produto_id: 0, quantidade: 1, preco_unitario: 0 }]);
    setStatusPagamento("pendente");
    setTipoPagamentoId(null);
    setObservacao("");
  };

  const handleRegistrar = async () => {
    if (!clienteId || !tipoPagamentoId) {
      return toast.error("Preencha todos os campos obrigatórios");
    }

    if (itens.some((item) => item.produto_id === 0)) {
      return toast.error("Selecione todos os produtos");
    }

    try {
      setLoadingDialog(true);
      const total = calcularTotal();

      const payload = {
        cliente_id: clienteId,
        observacao,
        status_pagamento: statusPagamento,
        itens: itens.map((item) => ({
          produto_id: item.produto_id,
          quantidade: item.quantidade,
          preco_unitario: item.preco_unitario,
        })),
        pagamento: {
          valor: total,
          tipo_pagamento_id: tipoPagamentoId,
        },
        enviar_email: statusPagamento === "pago",
      };

      const res = await fetch("/api/estoque", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          statusPagamento === "pago"
            ? "Venda registrada e e-mail enviado com sucesso!"
            : "Venda registrada com sucesso!"
        );
        setOpenDialog(false);
        resetForm();
        carregarMovimentacoes();
      } else {
        toast.error(data.mensagem || "Erro ao registrar movimentação.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      toast.error("Erro ao processar a requisição.");
    } finally {
      setLoadingDialog(false);
    }
  };

  type AtualizarStatusResponse = {
    mensagem: string;
  };

  const atualizarStatusPagamento = async (
    id: number,
    novoStatus: string
  ): Promise<AtualizarStatusResponse> => {
    try {
      const res = await fetch(`/api/estoque/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status_pagamento: novoStatus,
          enviar_email: true,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          data.mensagem || "Status atualizado e e-mail enviado com sucesso!"
        );
        carregarMovimentacoes();
        return data;
      } else {
        toast.error(data.mensagem || "Erro ao atualizar status.");
        throw new Error(data.mensagem || "Erro ao atualizar status.");
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status.");
      throw error;
    }
  };
  // Função para excluir movimentação
  const excluirMovimentacao = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta movimentação?")) return;

    try {
      const res = await fetch(`/api/estoque/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Movimentação excluída com sucesso!");
        carregarMovimentacoes();
      } else {
        const data = await res.json();
        toast.error(data.mensagem || "Erro ao excluir movimentação.");
      }
    } catch (error) {
      console.error("Erro ao excluir movimentação:", error);
      toast.error("Erro ao excluir movimentação.");
    }
  };

  // Funções para formatação
  const formatarDataHora = (dataString: string) => {
    try {
      const data = new Date(dataString);
      if (isNaN(data.getTime())) {
        return dataString;
      }

      // Formata considerando o fuso horário local sem modificar a hora absoluta
      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }).format(data);
    } catch {
      return dataString;
    }
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  useEffect(() => {
    console.log(
      "Dados das movimentações:",
      movimentacoes.map((mov) => ({
        id: mov.id,
        dataOriginal: mov.data,
        dataFormatada: formatarDataHora(mov.data),
      }))
    );
  }, [movimentacoes]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Movimentações de Estoque</h1>

        {/* Modal de Nova Movimentação */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Nova Movimentação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar Movimentação</DialogTitle>
              <DialogDescription>
                Preencha os dados da venda ou movimentação de saída.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Cliente *</label>
                <Select
                  onValueChange={(val) => setClienteId(Number(val))}
                  value={clienteId ? String(clienteId) : undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Produtos *</label>
                {itens.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-2 items-center"
                  >
                    <div className="col-span-5">
                      <Select
                        onValueChange={(val) =>
                          handleItemChange(index, "produto_id", Number(val))
                        }
                        value={
                          item.produto_id ? String(item.produto_id) : undefined
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Produto" />
                        </SelectTrigger>
                        <SelectContent>
                          {produtos.map((p) => (
                            <SelectItem key={p.id} value={String(p.id)}>
                              {p.nome} - {formatarMoeda(Number(p.preco) || 0)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        className="h-9"
                        placeholder="Qtd"
                        value={item.quantidade}
                        min="1"
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "quantidade",
                            Number(e.target.value) || 1
                          )
                        }
                      />
                    </div>
                    <div className="col-span-4">
                      <div className="flex items-center gap-1">
                        <Input
                          type="text"
                          className="h-9"
                          readOnly
                          value={formatarMoeda(item.preco_unitario)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removerItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={adicionarItem}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-1" /> Adicionar Produto
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">
                    Status do Pagamento *
                  </label>
                  <Select
                    onValueChange={setStatusPagamento}
                    value={statusPagamento}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="pago">Pago</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Tipo de Pagamento *
                  </label>
                  <Select
                    onValueChange={(val) => setTipoPagamentoId(Number(val))}
                    value={
                      tipoPagamentoId ? String(tipoPagamentoId) : undefined
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposPagamento.map((t) => (
                        <SelectItem key={t.id} value={String(t.id)}>
                          {t.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Observação</label>
                <Input
                  className="mt-1"
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  placeholder="Motivo ou anotação opcional"
                />
              </div>

              <div className="bg-muted p-3 rounded-md mt-2">
                <p className="font-medium text-right text-lg">
                  Total: {formatarMoeda(calcularTotal())}
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleRegistrar} disabled={loadingDialog}>
                {loadingDialog ? "Processando..." : "Registrar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabela de Movimentações */}
      <div className="rounded-lg border p-4">
        {loadingTable ? (
          <div className="text-center py-4">Carregando movimentações...</div>
        ) : movimentacoes.length === 0 ? (
          <div className="text-center py-4">
            Nenhuma movimentação encontrada
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Produtos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movimentacoes.map((mov) => (
                <TableRow key={mov.id}>
                  <TableCell>{formatarDataHora(mov.data)}</TableCell>
                  <TableCell>{mov.cliente?.nome || "Não informado"}</TableCell>
                  <TableCell>
                    {mov.item_venda?.map((item: any) => (
                      <div key={item.id} className="text-sm">
                        {item.quantidade}x {item.produto?.nome} (
                        {formatarMoeda(item.preco_unitario)})
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          mov.status_pagamento === "pago"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          mov.status_pagamento === "pago"
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                        }
                      >
                        {mov.status_pagamento}
                      </Badge>
                      {mov.status_pagamento === "pendente" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1 text-green-600 border-green-300 hover:bg-green-50"
                          onClick={() => {
                            toast.promise(
                              atualizarStatusPagamento(mov.id, "pago"),
                              {
                                loading: "Confirmando pagamento...",
                                success: (data) =>
                                  data?.mensagem ||
                                  "Pagamento confirmado com sucesso!",
                                error: "Erro ao confirmar pagamento",
                              }
                            );
                          }}
                        >
                          <Check className="h-3 w-3" />
                          <span>Confirmar Pagamento</span>
                        </Button>
                      )}
                      {mov.status_pagamento === "pago" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-muted-foreground"
                          disabled
                          title="Pagamento já realizado"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Confirmado
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatarMoeda(mov.total)}
                  </TableCell>
                  <TableCell>
                    {mov.pagamento?.tipo_pagamento?.nome || "Não informado"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-red-50"
                      onClick={() => excluirMovimentacao(mov.id)}
                      title="Excluir movimentação"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
