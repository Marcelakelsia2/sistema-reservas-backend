import { Request, Response } from "express";
import * as service from "../services/tipoSala.service";
import { ZodError } from "zod";
import { formatZodError } from "../utils/handleZodError";
import { HttpError } from "../utils/httpError";

// CRIAR
export async function criar(req: Request, res: Response) {
  try {
    const { nome, descricao } = req.body;

    const tipo = await service.criar(nome, descricao);

    return res.status(201).json({
      mensagem: "Tipo de sala criado com sucesso.",
      data: tipo,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro de validação",
        detalhes: formatZodError(error),
      });
    }

    if (error instanceof HttpError) {
      return res.status(error.status).json({
        erro: true,
        mensagem: error.message,
      });
    }

    return res.status(500).json({
      erro: true,
      mensagem: "Erro interno do servidor",
    });
  }
}

// LISTAR
export async function listar(req: Request, res: Response) {
  const tipos = await service.listar();

  return res.json({
    mensagem: "Lista de tipos de sala",
    data: tipos,
  });
}

// VER POR ID
export async function ver(req: Request, res: Response) {
  const id = Number(req.params.id);

  const tipo = await service.verPorId(id);

  return res.json({
    mensagem: "Tipo de sala encontrado",
    data: tipo,
  });
}

// EDITAR
export async function editar(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const tipo = await service.editar(id, req.body);

    return res.json({
      mensagem: "Tipo de sala atualizado com sucesso.",
      data: tipo,
    });
  } catch (error: any) {
    if (error instanceof HttpError) {
      return res.status(error.status).json({
        erro: true,
        mensagem: error.message,
      });
    }

    return res.status(500).json({
      erro: true,
      mensagem: "Erro interno do servidor",
    });
  }
}

// REMOVER
export async function remover(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    await service.remover(id);

    return res.json({
      mensagem: "Tipo de sala removido com sucesso.",
    });
  } catch (error: any) {
    if (error instanceof HttpError) {
      return res.status(error.status).json({
        erro: true,
        mensagem: error.message,
      });
    }

    return res.status(500).json({
      erro: true,
      mensagem: "Erro interno do servidor",
    });
  }
}