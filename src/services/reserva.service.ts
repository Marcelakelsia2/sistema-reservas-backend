import { prisma } from "../lib/prisma";
import { HttpError } from "../utils/httpError";

function validarHorario(inicio: Date, fim: Date) {
  if (inicio >= fim) {
    throw new HttpError("Hora de início deve ser menor que a hora de fim", 400);
  }
}

// CONFLITO SALA
async function verificarConflitoSala(salaId: number, inicio: Date, fim: Date) {
  const conflito = await prisma.reserva.findFirst({
    where: {
      salaId,
      status: { not: "CANCELADA" },
      AND: [
        { horaInicio: { lt: fim } },
        { horaFim: { gt: inicio } }
      ]
    }
  });

  if (conflito) {
    throw new HttpError("Conflito de horário na sala", 400);
  }
}

// CRIAR
export async function criar(data: any, usuarioId: number) {
  const inicio = new Date(`${data.data}T${data.horaInicio}:00`);
  const fim = new Date(`${data.data}T${data.horaFim}:00`);

  validarHorario(inicio, fim);
  await verificarConflitoSala(data.salaId, inicio, fim);

  return prisma.reserva.create({
    data: {
      usuarioId,
      salaId: data.salaId,
      horaInicio: inicio,
      horaFim: fim,
      data: new Date(data.data),
      observacao: data.observacao
    }
  });
}

// LISTAR
export async function listar() {
  return prisma.reserva.findMany({
    include: { sala: true, usuario: true }
  });
}

// MINHAS
export async function minhas(usuarioId: number) {
  return prisma.reserva.findMany({
    where: { usuarioId },
    include: { sala: true }
  });
}

// VER
export async function ver(id: number, usuario: any) {
  const reserva = await prisma.reserva.findUnique({
    where: { id },
    include: { sala: true }
  });

  if (!reserva) throw new HttpError("Reserva não encontrada", 404);

  if (usuario.role === "USUARIO" && reserva.usuarioId !== usuario.id) {
    throw new HttpError("Sem permissão", 403);
  }

  return reserva;
}

// CANCELAR
export async function cancelar(id: number, usuario: any) {
  await ver(id, usuario);

  return prisma.reserva.update({
    where: { id },
    data: { status: "CANCELADA" }
  });
}

// HISTÓRICO
export async function historico(usuarioId: number) {
  return prisma.reserva.findMany({
    where: { usuarioId }
  });
}

// CONFLITOS
export async function conflitos() {
  return prisma.reserva.findMany({
    where: { status: "PENDENTE" },
    include: { sala: true }
  });
}