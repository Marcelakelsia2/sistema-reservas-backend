import { Request, Response } from "express";
import * as service from "../services/tipoEquipamento.service";

// CRIAR
export async function criar(req: Request, res: Response) {
  const tipo = await service.criar(req.body);

  return res.status(201).json(tipo);
}

// LISTAR
export async function listar(req: Request, res: Response) {
  const tipos = await service.listar();

  return res.json(tipos);
}

// VER
export async function ver(req: Request, res: Response) {
  const tipo = await service.ver(
    Number(req.params.id)
  );

  return res.json(tipo);
}

// EDITAR
export async function editar(req: Request, res: Response) {
  const tipo = await service.editar(
    Number(req.params.id),
    req.body
  );

  return res.json(tipo);
}

// REMOVER
export async function remover(req: Request, res: Response) {
  await service.remover(
    Number(req.params.id)
  );

  return res.json({
    mensagem: "Tipo de equipamento removido com sucesso",
  });
}