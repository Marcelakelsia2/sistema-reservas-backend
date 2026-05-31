import { prisma } from "../lib/prisma";
import { HttpError } from "../utils/httpError";

// VALIDAR QUANTIDADES
function validarQuantidades(
  quantidadeTotal: number,
  quantidadeDisponivel: number
) {
  if (quantidadeTotal < 0 || quantidadeDisponivel < 0) {
    throw new HttpError(
      "Quantidades não podem ser negativas",
      400
    );
  }

  if (quantidadeDisponivel > quantidadeTotal) {
    throw new HttpError(
      "Quantidade disponível não pode ser maior que a quantidade total",
      400
    );
  }
}

// CRIAR
export async function criar(data: any) {
  const existe = await prisma.equipamento.findFirst({
    where: {
      codigo: data.codigo,
    },
  });

  if (existe) {
    throw new HttpError(
      "Já existe um equipamento com este código",
      400
    );
  }

  validarQuantidades(
    data.quantidadeTotal,
    data.quantidadeDisponivel
  );

  return prisma.equipamento.create({
    data,
  });
}

// LISTAR
export async function listar() {
  return prisma.equipamento.findMany({
    include: {
      tipoEquipamento: true,
    },
  });
}

// VER
export async function ver(id: number) {
  const equipamento = await prisma.equipamento.findUnique({
    where: { id },
    include: {
      tipoEquipamento: true,
    },
  });

  if (!equipamento) {
    throw new HttpError(
      "Equipamento não encontrado",
      404
    );
  }

  return equipamento;
}

// EDITAR
export async function editar(
  id: number,
  data: any
) {
  if (data.codigo) {
    const existe = await prisma.equipamento.findFirst({
      where: {
        codigo: data.codigo,
        NOT: { id },
      },
    });

    if (existe) {
      throw new HttpError(
        "Já existe outro equipamento com este código",
        400
      );
    }
  }

  if (
    data.quantidadeTotal !== undefined &&
    data.quantidadeDisponivel !== undefined
  ) {
    validarQuantidades(
      data.quantidadeTotal,
      data.quantidadeDisponivel
    );
  }

  return prisma.equipamento.update({
    where: { id },
    data,
  });
}

// ALTERAR DISPONIBILIDADE
export async function alterarDisponibilidade(
  id: number,
  estado: any
) {
  return prisma.equipamento.update({
    where: { id },
    data: {
      estado,
    },
  });
}

// ALTERAR QUANTIDADE
export async function alterarQuantidade(
  id: number,
  data: any
) {
  validarQuantidades(
    data.quantidadeTotal,
    data.quantidadeDisponivel
  );

  return prisma.equipamento.update({
    where: { id },
    data: {
      quantidadeTotal: data.quantidadeTotal,
      quantidadeDisponivel:
        data.quantidadeDisponivel,
    },
  });
}

// ALTERAR ESTADO
export async function alterarEstado(
  id: number,
  estado: any
) {
  return prisma.equipamento.update({
    where: { id },
    data: {
      estado,
    },
  });
}

// DISPONÍVEIS
export async function disponiveis() {
  return prisma.equipamento.findMany({
    where: {
      estado: "DISPONIVEL",
      quantidadeDisponivel: {
        gt: 0,
      },
    },
  });
}

// CONFLITOS
export async function conflitos() {
  return prisma.reservaEquipamento.findMany({
    include: {
      equipamento: true,
      reserva: true,
    },
  });
}

// REMOVER
export async function remover(id: number) {
  return prisma.equipamento.delete({
    where: { id },
  });
}