import { prisma } from "../lib/prisma";
import { HttpError } from "../utils/httpError";

// CRIAR
export async function criar(data: any) {
  const existe = await prisma.tipoEquipamento.findFirst({
    where: {
      nome: data.nome,
    },
  });

  if (existe) {
    throw new HttpError(
      "Já existe um tipo de equipamento com este nome",
      400
    );
  }

  return prisma.tipoEquipamento.create({
    data,
  });
}

// LISTAR
export async function listar() {
  return prisma.tipoEquipamento.findMany({
    include: {
      equipamentos: true,
    },
  });
}

// VER
export async function ver(id: number) {
  const tipo = await prisma.tipoEquipamento.findUnique({
    where: { id },
    include: {
      equipamentos: true,
    },
  });

  if (!tipo) {
    throw new HttpError(
      "Tipo de equipamento não encontrado",
      404
    );
  }

  return tipo;
}

// EDITAR
export async function editar(id: number, data: any) {
  if (data.nome) {
    const existe = await prisma.tipoEquipamento.findFirst({
      where: {
        nome: data.nome,
        NOT: { id },
      },
    });

    if (existe) {
      throw new HttpError(
        "Já existe outro tipo de equipamento com este nome",
        400
      );
    }
  }

  return prisma.tipoEquipamento.update({
    where: { id },
    data,
  });
}

// REMOVER
export async function remover(id: number) {
  const existe = await prisma.tipoEquipamento.findUnique({
    where: { id },
  });

  if (!existe) {
    throw new HttpError(
      "Tipo de equipamento não encontrado",
      404
    );
  }

  return prisma.tipoEquipamento.delete({
    where: { id },
  });
}