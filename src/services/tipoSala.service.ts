import { prisma } from "../lib/prisma";
import { HttpError } from "../utils/httpError";

// CRIAR
export async function criar(nome: string, descricao?: string) {
  const existente = await prisma.tipoSala.findFirst({
    where: { nome },
  });

  if (existente) {
    throw new HttpError("Já existe um tipo de sala com esse nome.", 409);
  }

  return prisma.tipoSala.create({
    data: { nome, descricao },
  });
}

// LISTAR
export async function listar() {
  return prisma.tipoSala.findMany({
    orderBy: { id: "desc" },
  });
}

// VER DETALHE
export async function verPorId(id: number) {
  const tipo = await prisma.tipoSala.findUnique({
    where: { id },
  });

  if (!tipo) {
    throw new HttpError("Tipo de sala não encontrado.", 404);
  }

  return tipo;
}

// EDITAR
export async function editar(id: number, data: { nome?: string; descricao?: string }) {
  const tipo = await prisma.tipoSala.findUnique({
    where: { id },
  });

  if (!tipo) {
    throw new HttpError("Tipo de sala não encontrado.", 404);
  }

  // evitar nomes duplicados
  if (data.nome) {
    const duplicado = await prisma.tipoSala.findFirst({
      where: {
        nome: data.nome,
        NOT: { id },
      },
    });

    if (duplicado) {
      throw new HttpError("Já existe outro tipo de sala com esse nome.", 409);
    }
  }

  return prisma.tipoSala.update({
    where: { id },
    data,
  });
}

// REMOVER
export async function remover(id: number) {
  const tipo = await prisma.tipoSala.findUnique({
    where: { id },
  });

  if (!tipo) {
    throw new HttpError("Tipo de sala não encontrado.", 404);
  }

  return prisma.tipoSala.delete({
    where: { id },
  });
}