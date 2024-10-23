export function generateSlug(title: string): string {
  return title
    .toLowerCase() // Transforma o texto em minúsculas
    .trim() // Remove espaços em branco nas extremidades
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hifens
    .replace(/--+/g, '-') // Substitui múltiplos hifens por um único
    .replace(/^-+|-+$/g, '') // Remove hifens extras no início ou no final
}
