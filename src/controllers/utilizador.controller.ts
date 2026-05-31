import { Request, Response } from "express";
import { ZodError } from "zod";

import * as utilizadoresService from "../services/utilizador.service";

import {
  atualizarPerfilSchema,
  alterarSenhaSchema,
  alterarRoleSchema,
  alterarEstadoSchema,
} from "../validations/utilizadores.validacao";

import { formatZodError } from "../utils/handleZodError";

import { AuthRequest } from "../middlewares/autenticar";


// LISTAR UTILIZADORES
export async function listarUtilizadores(
  req: Request,
  res: Response
) {
  try {
    const utilizadores =
      await utilizadoresService.listarUtilizadores();

    return res.json(utilizadores);

  } catch (error: any) {

    return res.status(400).json({
      erro: true,
      mensagem: error.message,
    });
  }
}


// MEU PERFIL
export async function meuPerfil(
  req: AuthRequest,
  res: Response
) {
  try {

    const utilizador =
      await utilizadoresService.meuPerfil(
        req.usuario!.id
      );

    return res.json(utilizador);

  } catch (error: any) {

    return res.status(400).json({
      erro: true,
      mensagem: error.message,
    });
  }
}


// VER UTILIZADOR
export async function verUtilizador(
  req: Request,
  res: Response
) {
  try {

    const utilizador =
      await utilizadoresService.verUtilizador(
        Number(req.params.id)
      );

    return res.json(utilizador);

  } catch (error: any) {

    return res.status(400).json({
      erro: true,
      mensagem: error.message,
    });
  }
}


// EDITAR PERFIL
export async function atualizarPerfil(
  req: AuthRequest,
  res: Response
) {
  try {

    const body =
      atualizarPerfilSchema.parse(req.body);

    const utilizador =
      await utilizadoresService.atualizarPerfil(
        req.usuario!.id,
        body
      );

    return res.json({
      mensagem:
        "Perfil atualizado com sucesso.",
      utilizador,
    });

  } catch (error: any) {

    if (error instanceof ZodError) {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro de validação",
        detalhes: formatZodError(error),
      });
    }

    return res.status(400).json({
      erro: true,
      mensagem: error.message,
    });
  }
}


// ALTERAR PALAVRA-PASSE
export async function alterarPalavraPasse(
  req: AuthRequest,
  res: Response
) {
  try {

    const body =
      alterarSenhaSchema.parse(req.body);

    const resultado =
      await utilizadoresService.alterarSenha(
        req.usuario!.id,
        body.senhaAtual,
        body.novaSenha
      );

    return res.json(resultado);

  } catch (error: any) {

    if (error instanceof ZodError) {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro de validação",
        detalhes: formatZodError(error),
      });
    }

    return res.status(400).json({
      erro: true,
      mensagem: error.message,
    });
  }
}


// ADMIN - ALTERAR ROLE
export async function alterarTipoUtilizador(
  req: Request,
  res: Response
) {
  try {

    const body =
      alterarRoleSchema.parse(req.body);

    const utilizador =
      await utilizadoresService.alterarRole(
        Number(req.params.id),
        body.role
      );

    return res.json({
      mensagem:
        "Tipo de utilizador alterado.",
      utilizador,
    });

  } catch (error: any) {

    if (error instanceof ZodError) {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro de validação",
        detalhes: formatZodError(error),
      });
    }

    return res.status(400).json({
      erro: true,
      mensagem: error.message,
    });
  }
}


// ADMIN - BLOQUEAR / DESBLOQUEAR
export async function alterarEstado(
  req: Request,
  res: Response
) {
  try {

    const body =
      alterarEstadoSchema.parse(req.body);

    const utilizador =
      await utilizadoresService.alterarEstado(
        Number(req.params.id),
        body.ativo
      );

    return res.json({
      mensagem:
        "Estado alterado com sucesso.",
      utilizador,
    });

  } catch (error: any) {

    if (error instanceof ZodError) {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro de validação",
        detalhes: formatZodError(error),
      });
    }

    return res.status(400).json({
      erro: true,
      mensagem: error.message,
    });
  }
}


// ADMIN - REMOVER UTILIZADOR
export async function removerUtilizador(
  req: Request,
  res: Response
) {
  try {

    const resultado =
      await utilizadoresService.removerUtilizador(
        Number(req.params.id)
      );

    return res.json(resultado);

  } catch (error: any) {

    return res.status(400).json({
      erro: true,
      mensagem: error.message,
    });
  }
}