import { z } from "zod";

export const registarSchema = z.object({
  nome: z.string()
    .min(5, "O nome deve ter pelo menos 2 palavras"),

  email: z.string().email("Email inválido"),

  telefone: z.string()
    .regex(/^\d{9}$/, "O telefone deve ter 9 dígitos"),

  senha: z.string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Za-z]/, "A senha deve conter letras")
    .regex(/[0-9]/, "A senha deve conter números"),
});

export const verificarEmailSchema = z.object({
  email: z.string().email(),
  codigo: z.string().length(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(1),
});

export const recuperarSenhaSchema = z.object({
  email: z.string().email(),
});

export const redefinirSenhaSchema = z.object({
  email: z.string().email(),
  codigo: z.string().length(6),
  novaSenha: z.string()
    .min(8)
    .regex(/[A-Za-z]/)
    .regex(/[0-9]/),
});