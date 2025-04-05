import { useEffect, useState } from "react";

export function useProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProdutos = async () => {
    setLoading(true);
    const res = await fetch("/api/produtos");
    const data = await res.json();
    setProdutos(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  return { produtos, loading, fetchProdutos };
}
