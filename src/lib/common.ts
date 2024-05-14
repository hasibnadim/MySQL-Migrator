export function green(v: string): string {
  return "\x1b[32m" + v + "\x1b[0m";
}
export function red(v: string): string {
  return "\x1b[31m" + v + "\x1b[0m";
}
export function magenta(v: string): string{
  return "\x1b[35m" + v + "\x1b[0m";
}