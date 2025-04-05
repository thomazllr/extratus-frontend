import { useEffect, useState } from "react";

export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  estoque: {
    id: number;
    quantidade: number;
    produtoId: number;
  }[];
}

export function useProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProdutos = async () => {
    setLoading(true);
    const res = await fetch("/api/produtos");
    const data = await res.json();
    setProdutos(data);
    console.log("Produtos:", data);
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  return { produtos, loading, fetchProdutos };
}
