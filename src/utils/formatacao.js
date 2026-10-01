export const formatarNumero = (numero) => numero.toLocaleString('pt-BR');

export const pluralizar = (quantidade, singular, plural) =>
  `${formatarNumero(quantidade)} ${quantidade === 1 ? singular : plural}`;

export const formatarTempo = (milissegundos) =>
  milissegundos < 1 ? 'menos de 1 ms' : `${formatarNumero(Math.round(milissegundos))} ms`;

export const iniciais = (nome) => {
  const palavras = nome.match(/[\p{L}\p{N}][\p{L}\p{N}'’.-]*/gu) ?? [];
  if (palavras.length === 0) return '?';

  const primeira = palavras[0][0];
  const ultima = palavras.length > 1 ? palavras.at(-1)[0] : '';
  return `${primeira}${ultima}`.toUpperCase();
};

export const matiz = (nome) => {
  let soma = 0;
  for (const caractere of nome) soma = (soma * 31 + caractere.codePointAt(0)) % 360;
  return soma;
};
