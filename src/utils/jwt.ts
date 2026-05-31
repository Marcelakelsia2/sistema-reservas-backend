import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

interface PayloadToken {
  id: number;
  role: Role;
}

const segredo = process.env.JWT_SECRET as string;

// Gera token JWT
export function gerarToken(payload: PayloadToken): string {
  return jwt.sign(payload, segredo, { expiresIn: "1d" });
}

// Verifica token JWT
export function verificarToken(token: string): PayloadToken {
  return jwt.verify(token, segredo) as PayloadToken;
}