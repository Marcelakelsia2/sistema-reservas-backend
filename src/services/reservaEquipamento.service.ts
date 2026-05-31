import { prisma } from "../lib/prisma";
import { HttpError } from "../utils/httpError";

/**
 * VALIDAR CONFLITO DE HORÁRIO
 */
function conflitoHorario(novoInicio: Date, novoFim: Date, existenteInicio: Date, existenteFim: Date) {
  return (
    (novoInicio >= existenteInicio && novoInicio < existenteFim) ||
    (novoFim > existenteInicio && novoFim <= existenteFim) ||
    (novoInicio <= existenteInicio && novoFim >= existenteFim)
  );
}

/**
 * CRIAR RESERVA DE EQUIPAMENTO
 */
export async function criar(data: any, usuarioId: number) {
  const equipamento = await prisma.equipamento.findUnique({
    where: { id: data.equipamentoId }
  });

  if (!equipamento) throw new HttpError("Equipamento não encontrado", 404);

  if (data.quantidade > equipamento.quantidadeDisponivel) {
    throw new HttpError("Quantidade indisponível", 400);
  }

  const inicio = new Date(data.horaInicio);
  const fim = new Date(data.horaFim);

  if (inicio >= fim) {
    throw new HttpError("Hora início deve ser menor que fim", 400);
  }

  const reservas = await prisma.reservaEquipamento.findMany({
    where: {
      equipamentoId: data.equipamentoId,
      status: "PENDENTE"
    }
  });

  for (const r of reservas) {
    if (
      conflitoHorario(inicio, fim, new Date(r.horaInicio), new Date(r.horaFim))
    ) {
      throw new HttpError("Conflito de horário com outra reserva", 409);
    }
  }

  return prisma.reservaEquipamento.create({
    data: {
      ...data,
      usuarioId
    }
  });
}

/**
 * LISTAR TODAS
 */
export async function listar() {
  return prisma.reservaEquipamento.findMany({
    include: { equipamento: true, usuario: true }
  });
}

/**
 * MINHAS RESERVAS
 */
export async function minhas(usuarioId: number) {
  return prisma.reservaEquipamento.findMany({
    where: { usuarioId },
    include: { equipamento: true }
  });
}

/**
 * VER
 */
export async function ver(id: number, usuario: any) {
  const reserva = await prisma.reservaEquipamento.findUnique({
    where: { id },
    include: { equipamento: true }
  });

  if (!reserva) throw new HttpError("Reserva não encontrada", 404);

  if (usuario.role === "USUARIO" && reserva.usuarioId !== usuario.id) {
    throw new HttpError("Sem permissão", 403);
  }

  return reserva;
}

/**
 * CANCELAR
 */
export async function cancelar(id: number, usuario: any) {
  const reserva = await prisma.reservaEquipamento.findUnique({
    where: { id }
  });

  if (!reserva) throw new HttpError("Reserva não encontrada", 404);

  if (usuario.role === "USUARIO" && reserva.usuarioId !== usuario.id) {
    throw new HttpError("Sem permissão", 403);
  }

  return prisma.reservaEquipamento.update({
    where: { id },
    data: { status: "CANCELADA" }
  });
}

/**
 * HISTÓRICO
 */
export async function historico(usuarioId: number) {
  return prisma.reservaEquipamento.findMany({
    where: { usuarioId },
    orderBy: { createdAt: "desc" }
  });
}

/**
 * CONFLITOS
 */
export async function conflitos() {
  return prisma.reservaEquipamento.findMany({
    where: { status: "PENDENTE" }
  });
}