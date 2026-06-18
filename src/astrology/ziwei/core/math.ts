export function positiveModulo(value: number, modulo: number): number {
  return ((value % modulo) + modulo) % modulo;
}
