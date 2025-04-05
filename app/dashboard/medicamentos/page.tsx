"use client";

import { useState } from "react";
import { Plus, Search, Filter, Download, Trash2, Eye } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useProdutos } from "@/hooks/use-produtos";

export default function MedicamentosPage() {
  const { produtos, fetchProdutos } = useProdutos();
  const [isLoading, setIsLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<number | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [produtoDetalhado, setProdutoDetalhado] = useState<
    null | (typeof produtos)[0]
  >(null);

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    preco: "",
    quantidade: "",
    categoria: "analgésico",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (value: string) => {
    setForm((prev) => ({ ...prev, categoria: value }));
  };

  const resetForm = () => {
    setForm({
      nome: "",
      descricao: "",
      preco: "",
      quantidade: "",
      categoria: "analgésico",
    });
  };
  const handleSubmit = async () => {
    if (!form.nome || !form.descricao || !form.preco || !form.quantidade) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/produtos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: form.nome,
          descricao: form.descricao,
          preco: parseFloat(form.preco),
          categoria: form.categoria,
          quantidade: parseInt(form.quantidade),
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar medicamento");
      }

      toast.success("Medicamento cadastrado com sucesso!");
      resetForm();
      setIsDialogOpen(false);
      await fetchProdutos(); // 👈 atualiza lista com dados do banco
    } catch (err) {
      toast.error("Erro ao salvar medicamento");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const abrirConfirmacaoExclusao = (id: number) => {
    setProdutoSelecionado(id);
    setIsConfirmDialogOpen(true);
  };

  const confirmarExclusao = async () => {
    if (produtoSelecionado !== null) {
      setIsDeleting(produtoSelecionado);

      try {
        const response = await fetch(`/api/produtos/${produtoSelecionado}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Erro ao excluir o medicamento");
        }

        toast.success("Medicamento excluído com sucesso.");
        await fetchProdutos(); // 👈 Atualiza lista com dados reais do banco
      } catch (err) {
        toast.error("Erro ao excluir o medicamento.");
        console.error(err);
      } finally {
        setProdutoSelecionado(null);
        setIsConfirmDialogOpen(false);
        setIsDeleting(null);
      }
    }
  };
  const abrirDetalhesProduto = (produto: (typeof produtos)[0]) => {
    setProdutoDetalhado(produto);
    setIsDetailDialogOpen(true);
  };

  const filteredProducts = produtos.filter(
    (p) =>
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case "analgésico":
        return "bg-blue-100 text-blue-800";
      case "antibiótico":
        return "bg-purple-100 text-purple-800";
      case "anti-inflamatório":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Medicamentos
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie o catálogo de medicamentos da farmácia
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 hover:scale-105 transition"
          >
            <Plus className="h-4 w-4" />
            Novo Medicamento
          </Button>

          <DialogContent className="sm:max-w-[500px] rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Cadastrar Novo Medicamento
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    placeholder="Ex: Paracetamol"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select
                    value={form.categoria}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger id="categoria">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="analgésico">Analgésico</SelectItem>
                      <SelectItem value="antibiótico">Antibiótico</SelectItem>
                      <SelectItem value="anti-inflamatório">
                        Anti-inflamatório
                      </SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  name="descricao"
                  value={form.descricao}
                  onChange={handleChange}
                  placeholder="Descreva o medicamento"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preco">Preço (R$)</Label>
                  <Input
                    id="preco"
                    name="preco"
                    type="number"
                    value={form.preco}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantidade">Estoque</Label>
                  <Input
                    id="quantidade"
                    name="quantidade"
                    type="number"
                    value={form.quantidade}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110"
                disabled={isSaving}
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                    Salvando...
                  </div>
                ) : (
                  "Cadastrar"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                placeholder="Buscar por nome ou descrição..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filtrar</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="rounded-lg border shadow-sm bg-white dark:bg-gray-900 overflow-hidden">
          <Table>
            <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              <TableRow>
                <TableHead className="font-semibold">Nome</TableHead>
                <TableHead className="font-semibold">Descrição</TableHead>
                <TableHead className="font-semibold">Categoria</TableHead>
                <TableHead className="font-semibold">Estoque</TableHead>
                <TableHead className="text-right font-semibold">
                  Preço
                </TableHead>
                <TableHead className="text-right font-semibold">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <TableRow
                    key={p.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="text-blue-500">💊</div>
                        <div className="font-medium">{p.nome}</div>
                      </div>
                    </TableCell>

                    <TableCell className="line-clamp-1 text-muted-foreground">
                      {p.descricao}
                    </TableCell>

                    <TableCell>
                      <Badge className={`${getCategoryColor(p.categoria)}`}>
                        {p.categoria}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          p.estoque[0]?.quantidade === 0
                            ? "destructive"
                            : p.estoque[0]?.quantidade < 10
                            ? "outline"
                            : "secondary"
                        }
                      >
                        {p.estoque[0]?.quantidade ?? 0} unid.
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right text-blue-700 font-medium">
                      💰 R$ {p.preco.toFixed(2).replace(".", ",")}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => abrirDetalhesProduto(p)}
                          className="hover:bg-gray-100 dark:hover:bg-gray-700 h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => abrirConfirmacaoExclusao(p.id)}
                          className="hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 h-8 w-8 p-0"
                          disabled={isDeleting !== null}
                        >
                          {isDeleting === p.id ? (
                            <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent animate-spin rounded-full" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {searchTerm
                      ? "Nenhum medicamento encontrado"
                      : "Nenhum medicamento cadastrado"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modal de Confirmação */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-red-600 text-lg">
              Confirmar exclusão
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Você tem certeza que deseja excluir este medicamento? Esta ação não
            poderá ser desfeita.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
              disabled={isDeleting !== null}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmarExclusao}
              disabled={isDeleting !== null}
            >
              {isDeleting !== null ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Detalhes do Medicamento
            </DialogTitle>
          </DialogHeader>
          {produtoDetalhado && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Nome</Label>
                  <p>{produtoDetalhado.nome}</p>
                </div>
                <div className="space-y-1">
                  <Label>Categoria</Label>
                  <Badge
                    className={`text-xs ${getCategoryColor(
                      produtoDetalhado.categoria
                    )}`}
                  >
                    {produtoDetalhado.categoria}
                  </Badge>
                </div>
              </div>
              <div>
                <Label>Descrição</Label>
                <p>{produtoDetalhado.descricao}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Preço</Label>
                  <p className="text-blue-700 font-semibold">
                    R$ {produtoDetalhado.preco.toFixed(2).replace(".", ",")}
                  </p>
                </div>
                <div>
                  <Label>Estoque</Label>
                  <Badge
                    variant={
                      produtoDetalhado.estoque[0]?.quantidade === 0
                        ? "destructive"
                        : produtoDetalhado.estoque[0]?.quantidade < 10
                        ? "outline"
                        : "secondary"
                    }
                    className="text-xs"
                  >
                    {produtoDetalhado.estoque[0]?.quantidade ?? 0} unid.
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
