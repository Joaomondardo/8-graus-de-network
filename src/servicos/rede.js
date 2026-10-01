import Grafo from '../Grafo';
import dadosFilmes from '../latest_movies.json';
import { filtrarPorRelevancia, normalizar } from '../utils/busca';

export const MAX_ARESTAS = 8;
export const BUSCA_PADRAO = 'padrao';
export const BUSCA_ADAPTADA = 'adaptada';

const TOTAL_SUGESTOES = 50;
const TOTAL_POPULARES = 8;
const MIN_FILMES_SORTEIO = 3;

export const grafo = new Grafo().seed(dadosFilmes);

export const estatisticas = [
  { rotulo: 'atores', valor: grafo.atores.size },
  { rotulo: 'filmes', valor: grafo.filmes.size },
  { rotulo: 'vértices', valor: grafo.adjacencias.size },
  { rotulo: 'arestas', valor: grafo.totalArestas },
];

const atores = Array.from(grafo.atores.values(), (vertice) => ({
  vertice,
  nome: vertice.nome,
  busca: normalizar(vertice.nome),
  filmes: grafo.vizinhos(vertice).length,
})).sort((a, b) => b.filmes - a.filmes || a.nome.localeCompare(b.nome, 'pt-BR'));

const atoresPorBusca = new Map(atores.map((ator) => [ator.busca, ator]));
const candidatosSorteio = atores.filter((ator) => ator.filmes >= MIN_FILMES_SORTEIO);

export const indiceAtores = {
  total: atores.length,
  encontrar: (texto) => atoresPorBusca.get(normalizar(texto)) ?? null,
  filtrar: (texto) => {
    const consulta = normalizar(texto);
    if (!consulta) return atores.slice(0, TOTAL_POPULARES);
    return filtrarPorRelevancia(atores, consulta).slice(0, TOTAL_SUGESTOES);
  },
};

export const exemplos = [
  ['Kevin Bacon', 'Keanu Reeves'],
  ['Wagner Moura', 'Tom Hanks'],
  ['Zendaya', 'Tom Hanks'],
  ['Pedro Pascal', 'Meryl Streep'],
].filter((par) => par.every((nome) => grafo.atores.has(nome)));

export const sortearPar = () => {
  const total = candidatosSorteio.length;
  const primeiro = Math.floor(Math.random() * total);
  const segundo = (primeiro + 1 + Math.floor(Math.random() * (total - 1))) % total;
  return [candidatosSorteio[primeiro].nome, candidatosSorteio[segundo].nome];
};

const medir = (executarBusca) => {
  const inicio = performance.now();
  const resultado = executarBusca();
  return { ...resultado, tempo: performance.now() - inicio };
};

export const buscarCaminhoMinimo = (origem, destino) => medir(() => grafo.bfs(origem, destino));

export const buscarTodosCaminhos = (origem, destino) => {
  const resultado = medir(() => grafo.bfsAdaptada(origem, destino, MAX_ARESTAS));
  if (resultado.caminhos.length > 0) return resultado;

  const { caminho } = grafo.bfs(origem, destino);
  return { ...resultado, comprimentoMinimo: caminho ? caminho.length - 1 : null };
};
