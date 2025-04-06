-- DropForeignKey
ALTER TABLE "pagamento" DROP CONSTRAINT "fkbf6syaph4vriqxw6jtfubmwc3";

-- DropForeignKey
ALTER TABLE "pagamento" DROP CONSTRAINT "fkda44t9l6pmuqrolntvwoi1cuw";

-- AlterTable
CREATE SEQUENCE venda_id_seq;
ALTER TABLE "venda" ADD COLUMN     "cliente_id" BIGINT,
ADD COLUMN     "observacao" VARCHAR(255),
ADD COLUMN     "status_pagamento" VARCHAR(100) NOT NULL DEFAULT 'pendente',
ALTER COLUMN "id" SET DEFAULT nextval('venda_id_seq');
ALTER SEQUENCE venda_id_seq OWNED BY "venda"."id";

-- AddForeignKey
ALTER TABLE "pagamento" ADD CONSTRAINT "fkda44t9l6pmuqrolntvwoi1cuw" FOREIGN KEY ("tipo_pagamento_id") REFERENCES "tipo_pagamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamento" ADD CONSTRAINT "fkbf6syaph4vriqxw6jtfubmwc3" FOREIGN KEY ("venda_id") REFERENCES "venda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venda" ADD CONSTRAINT "venda_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;
