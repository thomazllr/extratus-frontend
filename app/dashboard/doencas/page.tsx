import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, ArrowRight } from "lucide-react"

export default function DoencasPage() {
  // Exemplo de dados de doenças
  const doencas = [
    {
      id: 1,
      nome: "Hipertensão",
      descricao: "Pressão arterial elevada que pode levar a problemas cardíacos.",
      sintomas: ["Dores de cabeça", "Tontura", "Visão embaçada", "Falta de ar"],
      tratamentos: ["Inibidores da ECA", "Bloqueadores de canais de cálcio", "Diuréticos"],
      gravidade: "Moderada",
    },
    {
      id: 2,
      nome: "Diabetes Tipo 2",
      descricao: "Condição crônica que afeta a forma como o corpo processa o açúcar no sangue.",
      sintomas: ["Sede excessiva", "Micção frequente", "Fadiga", "Visão embaçada"],
      tratamentos: ["Metformina", "Insulina", "Inibidores de SGLT2"],
      gravidade: "Moderada",
    },
    {
      id: 3,
      nome: "Asma",
      descricao: "Condição que causa inflamação e estreitamento das vias aéreas.",
      sintomas: ["Falta de ar", "Chiado no peito", "Tosse", "Aperto no peito"],
      tratamentos: ["Broncodilatadores", "Corticosteroides inalatórios", "Modificadores de leucotrienos"],
      gravidade: "Moderada",
    },
    {
      id: 4,
      nome: "Enxaqueca",
      descricao: "Dor de cabeça intensa que pode ser acompanhada por náusea e sensibilidade à luz.",
      sintomas: ["Dor pulsante", "Náusea", "Sensibilidade à luz", "Visão embaçada"],
      tratamentos: ["Triptanos", "Analgésicos", "Antieméticos"],
      gravidade: "Leve",
    },
    {
      id: 5,
      nome: "Artrite Reumatoide",
      descricao: "Doença autoimune que causa inflamação nas articulações.",
      sintomas: ["Dor nas articulações", "Rigidez", "Inchaço", "Fadiga"],
      tratamentos: ["Anti-inflamatórios", "Medicamentos antirreumáticos", "Corticosteroides"],
      gravidade: "Grave",
    },
    {
      id: 6,
      nome: "Doença de Alzheimer",
      descricao: "Doença neurodegenerativa progressiva que causa problemas de memória e cognição.",
      sintomas: ["Perda de memória", "Confusão", "Mudanças de humor", "Dificuldade para resolver problemas"],
      tratamentos: ["Inibidores de colinesterase", "Memantina"],
      gravidade: "Grave",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Doenças</h1>
          <p className="text-muted-foreground">Informações sobre doenças e tratamentos recomendados</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Doença
        </Button>
      </div>

      <div className="flex w-full max-w-sm items-center space-x-2">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Buscar doenças..." className="w-full pl-8" />
        </div>
      </div>

      <Tabs defaultValue="todas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="leves">Leves</TabsTrigger>
          <TabsTrigger value="moderadas">Moderadas</TabsTrigger>
          <TabsTrigger value="graves">Graves</TabsTrigger>
        </TabsList>
        <TabsContent value="todas" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {doencas.map((doenca) => (
              <Card key={doenca.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle>{doenca.nome}</CardTitle>
                    <Badge
                      variant={
                        doenca.gravidade === "Leve"
                          ? "outline"
                          : doenca.gravidade === "Moderada"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {doenca.gravidade}
                    </Badge>
                  </div>
                  <CardDescription>{doenca.descricao}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Sintomas comuns:</h4>
                    <ul className="text-sm text-muted-foreground pl-5 list-disc">
                      {doenca.sintomas.map((sintoma, index) => (
                        <li key={index}>{sintoma}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full gap-1">
                    Ver detalhes
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="leves" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {doencas
              .filter((doenca) => doenca.gravidade === "Leve")
              .map((doenca) => (
                <Card key={doenca.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle>{doenca.nome}</CardTitle>
                      <Badge variant="outline">{doenca.gravidade}</Badge>
                    </div>
                    <CardDescription>{doenca.descricao}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Sintomas comuns:</h4>
                      <ul className="text-sm text-muted-foreground pl-5 list-disc">
                        {doenca.sintomas.map((sintoma, index) => (
                          <li key={index}>{sintoma}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full gap-1">
                      Ver detalhes
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="moderadas" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {doencas
              .filter((doenca) => doenca.gravidade === "Moderada")
              .map((doenca) => (
                <Card key={doenca.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle>{doenca.nome}</CardTitle>
                      <Badge variant="secondary">{doenca.gravidade}</Badge>
                    </div>
                    <CardDescription>{doenca.descricao}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Sintomas comuns:</h4>
                      <ul className="text-sm text-muted-foreground pl-5 list-disc">
                        {doenca.sintomas.map((sintoma, index) => (
                          <li key={index}>{sintoma}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full gap-1">
                      Ver detalhes
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="graves" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {doencas
              .filter((doenca) => doenca.gravidade === "Grave")
              .map((doenca) => (
                <Card key={doenca.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle>{doenca.nome}</CardTitle>
                      <Badge variant="destructive">{doenca.gravidade}</Badge>
                    </div>
                    <CardDescription>{doenca.descricao}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Sintomas comuns:</h4>
                      <ul className="text-sm text-muted-foreground pl-5 list-disc">
                        {doenca.sintomas.map((sintoma, index) => (
                          <li key={index}>{sintoma}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full gap-1">
                      Ver detalhes
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

