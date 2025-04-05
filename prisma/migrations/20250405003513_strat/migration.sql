-- CreateTable
CREATE TABLE "cliente" (
    "id" BIGSERIAL NOT NULL,
    "cpf" VARCHAR(255),
    "created_at" TIMESTAMP(6),
    "data_nascimento" DATE,
    "email" VARCHAR(255),
    "endereco" VARCHAR(255),
    "nome" VARCHAR(255),
    "telefone" VARCHAR(255),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cliente_profissoes" (
    "cliente_id" BIGINT NOT NULL,
    "profissoes_id" BIGINT NOT NULL
);

-- CreateTable
CREATE TABLE "doenca" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(6),
    "descricao" VARCHAR(255),
    "nome" VARCHAR(255),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "doenca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doenca_cliente" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(6),
    "data_diagnostico" DATE,
    "updated_at" TIMESTAMP(6),
    "cliente_id" BIGINT,
    "doenca_id" BIGINT,

    CONSTRAINT "doenca_cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estoque" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(6),
    "quantidade" INTEGER,
    "updated_at" TIMESTAMP(6),
    "produto_id" BIGINT,

    CONSTRAINT "estoque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_venda" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(6),
    "preco_unitario" DECIMAL(38,2),
    "quantidade" INTEGER,
    "updated_at" TIMESTAMP(6),
    "produto_id" BIGINT,
    "venda_id" BIGINT,

    CONSTRAINT "item_venda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagamento" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(6),
    "nome" VARCHAR(255),
    "updated_at" TIMESTAMP(6),
    "valor" DECIMAL(38,2),
    "tipo_pagamento_id" BIGINT NOT NULL,
    "venda_id" BIGINT NOT NULL,

    CONSTRAINT "pagamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produto" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(6),
    "descricao" VARCHAR(255),
    "nome" VARCHAR(255),
    "preco" DECIMAL(38,2),
    "updated_at" TIMESTAMP(6),
    "categoria" VARCHAR(255),

    CONSTRAINT "produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profissao" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(6),
    "nome" VARCHAR(255),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "profissao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipo_pagamento" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(6),
    "nome" VARCHAR(255),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "tipo_pagamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" BIGSERIAL NOT NULL,
    "cpf" VARCHAR(255),
    "is_admin" BOOLEAN NOT NULL,
    "nome" VARCHAR(255),
    "senha" VARCHAR(255),

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "venda" (
    "id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6),
    "data" DATE,
    "total" DECIMAL(38,2),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "venda_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cliente_profissoes" ADD CONSTRAINT "fkb4wlau9nrmpkss53pg79ji3if" FOREIGN KEY ("profissoes_id") REFERENCES "profissao"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cliente_profissoes" ADD CONSTRAINT "fklc31nwt6b16kav8v12w2u7wdv" FOREIGN KEY ("cliente_id") REFERENCES "cliente"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "doenca_cliente" ADD CONSTRAINT "fkawq8onyqbwe8c2sly6332wa7" FOREIGN KEY ("doenca_id") REFERENCES "doenca"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "doenca_cliente" ADD CONSTRAINT "fkmivxoy2530yoynn5aj2j74ve6" FOREIGN KEY ("cliente_id") REFERENCES "cliente"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "estoque" ADD CONSTRAINT "fkh201uorwvq9pjj4dsvjyo73ft" FOREIGN KEY ("produto_id") REFERENCES "produto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "item_venda" ADD CONSTRAINT "fk7wkinkvno0wlhv821hhu34y04" FOREIGN KEY ("produto_id") REFERENCES "produto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "item_venda" ADD CONSTRAINT "fkkiky88fkai72328rhw3r3yebx" FOREIGN KEY ("venda_id") REFERENCES "venda"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pagamento" ADD CONSTRAINT "fkbf6syaph4vriqxw6jtfubmwc3" FOREIGN KEY ("venda_id") REFERENCES "venda"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pagamento" ADD CONSTRAINT "fkda44t9l6pmuqrolntvwoi1cuw" FOREIGN KEY ("tipo_pagamento_id") REFERENCES "tipo_pagamento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
