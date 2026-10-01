export const normalizar = (texto) =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

export const localizar = (texto, consulta) => {
  if (texto.startsWith(consulta)) return 0;
  const inicioDePalavra = texto.indexOf(` ${consulta}`);
  return inicioDePalavra >= 0 ? inicioDePalavra + 1 : texto.indexOf(consulta);
};

const relevancia = (texto, consulta) => {
  if (texto === consulta) return 0;
  const posicao = localizar(texto, consulta);
  if (posicao < 0) return -1;
  if (posicao === 0) return 1;
  return texto[posicao - 1] === ' ' ? 2 : 3;
};

export const filtrarPorRelevancia = (itens, consulta) => {
  const grupos = [[], [], [], []];

  for (const item of itens) {
    const nivel = relevancia(item.busca, consulta);
    if (nivel >= 0) grupos[nivel].push(item);
  }

  return grupos.flat();
};
