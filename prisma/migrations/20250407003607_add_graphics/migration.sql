-- CreateTable
CREATE TABLE "MetricasDiarias" (
    "id" BIGSERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "vendas" INTEGER NOT NULL,
    "clientes" INTEGER NOT NULL,
    "receita" DECIMAL(10,2) NOT NULL,
    "produtos" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MetricasDiarias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TendenciaVendas" (
    "id" BIGSERIAL NOT NULL,
    "periodo" TEXT NOT NULL,
    "vendas" INTEGER NOT NULL,
    "receita" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TendenciaVendas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstoqueHistorico" (
    "id" BIGSERIAL NOT NULL,
    "produto_id" BIGINT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EstoqueHistorico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MetricasDiarias_data_key" ON "MetricasDiarias"("data");

-- CreateIndex
CREATE UNIQUE INDEX "TendenciaVendas_periodo_key" ON "TendenciaVendas"("periodo");

-- AddForeignKey
ALTER TABLE "EstoqueHistorico" ADD CONSTRAINT "EstoqueHistorico_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
