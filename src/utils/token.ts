// Gera código numérico de 6 dígitos
export function gerarCodigo(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}