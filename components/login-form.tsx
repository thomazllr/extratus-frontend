"use client";

import type React from "react";
import { useState, useEffect } from "react"; // Adicionei o useEffect
import { useRouter } from "next/navigation";
import { LockKeyhole, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginForm() {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Função para aplicar a máscara de CPF
  const formatCPF = (value: string) => {
    // Remove tudo que não é dígito
    const numericValue = value.replace(/\D/g, "");

    // Aplica a máscara: 000.000.000-00
    let formattedValue = numericValue;
    if (numericValue.length > 3) {
      formattedValue = `${numericValue.slice(0, 3)}.${numericValue.slice(3)}`;
    }
    if (numericValue.length > 6) {
      formattedValue = `${formattedValue.slice(0, 7)}.${formattedValue.slice(
        7
      )}`;
    }
    if (numericValue.length > 9) {
      formattedValue = `${formattedValue.slice(0, 11)}-${formattedValue.slice(
        11,
        13
      )}`;
    }

    return formattedValue;
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCPF(e.target.value);
    setCpf(formattedValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Envia o CPF com a máscara (como string)
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cpf, // Envia com a máscara (ex: "123.456.789-09")
          senha,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.error || "Erro ao fazer login");
        return;
      }

      const data = await res.json();
      router.push("/dashboard");
    } catch (err) {
      setError("Erro de conexão com o servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Entre com seu CPF e senha Para acessar o sistema
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                className="pl-10"
                value={cpf}
                onChange={handleCpfChange}
                maxLength={14} // 11 dígitos + 3 caracteres especiais
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="senha">Senha</Label>
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="senha"
                type="password"
                placeholder="••••••••"
                className="pl-10"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full mt-4" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
