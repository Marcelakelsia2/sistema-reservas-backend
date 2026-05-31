import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

import { HttpError } from "../utils/httpError";


// LISTAR UTILIZADORES
export async function listarUtilizadores() {
  return prisma.usuario.findMany({
    select: {
      id: true,
      nome: true,
      email: true,
      telefone: true,
      role: true,
      ativo: true,
      emailVerificado: true,
      dataCriacao: true,
    },
  });
}


// PERFIL
export async function meuPerfil(id: number) {
  const usuario = await prisma.usuario.findUnique({
    where: { id },

    select: {
      id: true,
      nome: true,
      email: true,
      telefone: true,
      role: true,
      ativo: true,
      emailVerificado: true,
      dataCriacao: true,
    },
  });

  if (!usuario) {
    throw new HttpError(
      "Utilizador não encontrado.",
      404
    );
  }

  return usuario;
}


// VER UTILIZADOR
export async function verUtilizador(id: number) {
  const usuario = await prisma.usuario.findUnique({
    where: { id },

    select: {
      id: true,
      nome: true,
      email: true,
      telefone: true,
      role: true,
      ativo: true,
      emailVerificado: true,
      dataCriacao: true,
    },
  });

  if (!usuario) {
    throw new HttpError(
      "Utilizador não encontrado.",
      404
    );
  }

  return usuario;
}


// EDITAR PERFIL
export async function atualizarPerfil(
  id: number,
  data: {
    nome?: string;
    telefone?: string;
  }
) {
  return prisma.usuario.update({
    where: { id },

    data,
  });
}


// ALTERAR SENHA
export async function alterarSenha(
  id: number,
  senhaAtual: string,
  novaSenha: string
) {
  const usuario = await prisma.usuario.findUnique({
    where: { id },
  });

  if (!usuario) {
    throw new HttpError(
      "Utilizador não encontrado.",
      404
    );
  }

  const senhaValida = await bcrypt.compare(
    senhaAtual,
    usuario.senha
  );

  if (!senhaValida) {
    throw new HttpError(
      "Senha atual incorreta.",
      400
    );
  }

  const hash = await bcrypt.hash(
    novaSenha,
    10
  );

  await prisma.usuario.update({
    where: { id },

    data: {
      senha: hash,
    },
  });

  return {
    mensagem:
      "Palavra-passe alterada com sucesso.",
  };
}


// ALTERAR ROLE
export async function alterarRole(
  id: number,
  role: any
) {
  return prisma.usuario.update({
    where: { id },

    data: {
      role,
    },
  });
}


// BLOQUEAR / DESBLOQUEAR
export async function alterarEstado(
  id: number,
  ativo: boolean
) {
  return prisma.usuario.update({
    where: { id },

    data: {
      ativo,
    },
  });
}


// REMOVER UTILIZADOR
export async function removerUtilizador(
  id: number
) {
  await prisma.usuario.delete({
    where: { id },
  });

  return {
    mensagem:
      "Utilizador removido com sucesso.",
  };
}