"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, ArrowRight, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Doenca {
  id: string;
  nome: string | null;
  descricao: string | null;
  gravidade?: "baixa" | "media" | "alta";
  categoria?: string;
}

export default function DoencasPage() {
  const [doencas, setDoencas] = useState<Doenca[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
  const [doencaParaExcluir, setDoencaParaExcluir] = useState<Doenca | null>(
    null
  );
  const [excluindo, setExcluindo] = useState(false);

  // Form states
  const [novaDoenca, setNovaDoenca] = useState<{
    nome: string;
    descricao: string;
    gravidade: "baixa" | "media" | "alta";
    categoria: string;
  }>({
    nome: "",
    descricao: "",
    gravidade: "baixa",
    categoria: "geral",
  });

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/doenca")
      .then((res) => res.json())
      .then((data) => {
        setDoencas(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar doenças:", err);
        setIsLoading(false);
      });
  }, []);

  const handleAddDoenca = async () => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/doenca", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novaDoenca),
      });

      if (!res.ok) throw new Error("Erro ao salvar no servidor.");

      const nova = await res.json();

      setDoencas([...doencas, nova]); // atualiza lista com a nova do backend
      setOpenModal(false);
    } catch (err) {
      console.error("Erro ao salvar doença:", err);
      alert("Erro ao salvar doença.");
    } finally {
      setIsLoading(false);

      // Reset form
      setNovaDoenca({
        nome: "",
        descricao: "",
        gravidade: "baixa",
        categoria: "geral",
      });
    }
  };

  const handleDeleteDoenca = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta doença?")) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/doenca", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Erro ao excluir no servidor.");

      setDoencas(doencas.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Erro ao excluir doença:", err);
      alert("Erro ao excluir doença.");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmarExclusaoDoenca = async () => {
    if (!doencaParaExcluir) return;

    setExcluindo(true);

    try {
      const res = await fetch("/api/doenca", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: doencaParaExcluir.id }),
      });

      if (!res.ok) throw new Error("Erro ao excluir no servidor.");

      setDoencas(doencas.filter((d) => d.id !== doencaParaExcluir.id));
      setModalExclusaoAberto(false);
      setDoencaParaExcluir(null);
    } catch (err) {
      console.error("Erro ao excluir doença:", err);
      alert("Erro ao excluir doença.");
    } finally {
      setExcluindo(false);
    }
  };

  const doencasFiltradas = doencas.filter((doenca) => {
    const matchSearch =
      doenca.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doenca.descricao?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategoria = filtroCategoria
      ? doenca.categoria === filtroCategoria
      : true;

    return matchSearch && matchCategoria;
  });

  const renderGravidadeBadge = (gravidade?: string) => {
    if (!gravidade) return null;

    const styles = {
      baixa: "bg-green-100 text-green-800 hover:bg-green-100",
      media: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      alta: "bg-red-100 text-red-800 hover:bg-red-100",
    };

    return (
      <Badge
        className={
          gravidade in styles ? styles[gravidade as keyof typeof styles] : ""
        }
      >
        {gravidade.charAt(0).toUpperCase() + gravidade.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Doenças</h1>
          <p className="text-muted-foreground">
            Informações sobre doenças cadastradas
          </p>
        </div>
        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Doença
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Doença</DialogTitle>
              <DialogDescription>
                Preencha os detalhes da doença e clique em salvar quando
                finalizar.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nome" className="text-right">
                  Nome
                </Label>
                <Input
                  id="nome"
                  value={novaDoenca.nome}
                  onChange={(e) =>
                    setNovaDoenca({ ...novaDoenca, nome: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="descricao" className="text-right">
                  Descrição
                </Label>
                <Textarea
                  id="descricao"
                  value={novaDoenca.descricao}
                  onChange={(e) =>
                    setNovaDoenca({ ...novaDoenca, descricao: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="gravidade" className="text-right">
                  Gravidade
                </Label>
                <Select
                  value={novaDoenca.gravidade}
                  onValueChange={(value) =>
                    setNovaDoenca({
                      ...novaDoenca,
                      gravidade: value as "baixa" | "media" | "alta",
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Select
                  value={novaDoenca.categoria}
                  onValueChange={(value) =>
                    setNovaDoenca({ ...novaDoenca, categoria: value })
                  }
                ></Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddDoenca} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Salvar"
                )}
              </Button>{" "}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar doenças..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select
          value={filtroCategoria || ""}
          onValueChange={(value) => setFiltroCategoria(value || null)}
        ></Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : doencasFiltradas.length === 0 ? (
        <div className="text-center p-10 border rounded-lg bg-muted/50">
          <p className="text-muted-foreground">Nenhuma doença encontrada.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {doencasFiltradas.map((doenca) => (
            <Card key={doenca.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="flex-1">
                    {doenca.nome ?? "Sem nome"}
                  </CardTitle>
                  {renderGravidadeBadge(doenca.gravidade)}
                </div>
                {doenca.categoria && (
                  <Badge variant="outline" className="mb-2">
                    {doenca.categoria.charAt(0).toUpperCase() +
                      doenca.categoria.slice(1)}
                  </Badge>
                )}
                <CardDescription>
                  {doenca.descricao ?? "Sem descrição"}
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex gap-2">
                <Button
                  variant="destructive"
                  className="w-auto px-3"
                  onClick={() => {
                    setDoencaParaExcluir(doenca);
                    setModalExclusaoAberto(true);
                  }}
                >
                  Excluir
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <Dialog open={modalExclusaoAberto} onOpenChange={setModalExclusaoAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a doença{" "}
              <strong>{doencaParaExcluir?.nome}</strong>?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setModalExclusaoAberto(false);
                setDoencaParaExcluir(null);
              }}
              disabled={excluindo}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmarExclusaoDoenca}
              disabled={excluindo}
            >
              {excluindo ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Excluir"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
