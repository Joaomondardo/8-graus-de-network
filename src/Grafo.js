export const ATOR = 'ator';
export const FILME = 'filme';

const limparTexto = (texto) => (typeof texto === 'string' ? texto.trim().replace(/\s+/g, ' ') : '');

const jaPercorreu = (passo, vertice) => {
  for (let atual = passo; atual; atual = atual.anterior) {
    if (atual.vertice === vertice) return true;
  }
  return false;
};

const montarCaminho = (passo) => {
  const caminho = [];
  for (let atual = passo; atual; atual = atual.anterior) caminho.push(atual.vertice);
  return caminho.reverse();
};

export default class Grafo {
  adjacencias = new Map();
  atores = new Map();
  filmes = new Map();

  get totalArestas() {
    let soma = 0;
    for (const adjacentes of this.adjacencias.values()) soma += adjacentes.length;
    return soma / 2;
  }

  adicionarVertice(tipo, chave, nome, id = chave) {
    const colecao = tipo === ATOR ? this.atores : this.filmes;

    if (!colecao.has(chave)) {
      const vertice = { chave: `${tipo}:${chave}`, tipo, id, nome };
      colecao.set(chave, vertice);
      this.adjacencias.set(vertice, []);
    }

    return colecao.get(chave);
  }

  adicionarAresta(verticeA, verticeB) {
    const adjacentesA = this.adjacencias.get(verticeA);
    if (adjacentesA.includes(verticeB)) return;

    adjacentesA.push(verticeB);
    this.adjacencias.get(verticeB).push(verticeA);
  }

  vizinhos(vertice) {
    return this.adjacencias.get(vertice) ?? [];
  }

  seed(listaFilmes) {
    for (const { id, title, cast } of listaFilmes) {
      const titulo = limparTexto(title);
      const elenco = Array.isArray(cast) ? cast.map(limparTexto).filter(Boolean) : [];
      if (!titulo) continue;

      // Entradas com o mesmo título viram um único vértice de filme, mesmo sem elenco.
      const filme = this.adicionarVertice(FILME, titulo, titulo, id);
      for (const nome of elenco) {
        this.adicionarAresta(filme, this.adicionarVertice(ATOR, nome, nome));
      }
    }

    return this;
  }

  show() {
    for (const [vertice, adjacentes] of this.adjacencias) {
      console.log(`[${vertice.tipo}] ${vertice.nome} -> ${adjacentes.map(({ nome }) => nome).join(' | ')}`);
    }
  }

  bfs(origem, destino) {
    if (!this.adjacencias.has(origem) || !this.adjacencias.has(destino)) {
      return { caminho: null, visitados: 0 };
    }
    if (origem === destino) return { caminho: [origem], visitados: 1 };

    const visitados = new Set([origem]);
    const pai = new Map();
    const fila = [origem];
    let inicio = 0;

    while (inicio < fila.length) {
      const atual = fila[inicio++];

      for (const vizinho of this.adjacencias.get(atual)) {
        if (visitados.has(vizinho)) continue;

        visitados.add(vizinho);
        pai.set(vizinho, atual);

        if (vizinho === destino) {
          return { caminho: this.#reconstruirCaminho(pai, destino), visitados: visitados.size };
        }
        fila.push(vizinho);
      }
    }

    return { caminho: null, visitados: visitados.size };
  }

  bfsAdaptada(origem, destino, maxArestas = 8, limiteCaminhos = 100000) {
    const resultado = { caminhos: [], limiteAtingido: false, explorados: 0 };
    if (!this.adjacencias.has(origem) || !this.adjacencias.has(destino) || origem === destino) {
      return resultado;
    }

    const distanciaAteDestino = this.#distanciasAte(destino, maxArestas);
    if (!distanciaAteDestino.has(origem)) return resultado;

    let nivel = [{ vertice: origem, anterior: null }];

    for (let arestas = 1; arestas <= maxArestas && nivel.length > 0; arestas++) {
      const proximoNivel = [];

      for (const passo of nivel) {
        for (const vizinho of this.adjacencias.get(passo.vertice)) {
          const faltam = distanciaAteDestino.get(vizinho) ?? Infinity;
          if (arestas + faltam > maxArestas || jaPercorreu(passo, vizinho)) continue;

          const novoPasso = { vertice: vizinho, anterior: passo };
          resultado.explorados++;

          if (vizinho !== destino) {
            proximoNivel.push(novoPasso);
            continue;
          }

          if (resultado.caminhos.length === limiteCaminhos) {
            resultado.limiteAtingido = true;
            return resultado;
          }
          resultado.caminhos.push(montarCaminho(novoPasso));
        }
      }

      nivel = proximoNivel;
    }

    return resultado;
  }

  #reconstruirCaminho(pai, destino) {
    const caminho = [destino];
    while (pai.has(caminho.at(-1))) caminho.push(pai.get(caminho.at(-1)));
    return caminho.reverse();
  }

  #distanciasAte(destino, limite) {
    const distancia = new Map([[destino, 0]]);
    const fila = [destino];
    let inicio = 0;

    while (inicio < fila.length) {
      const atual = fila[inicio++];
      const distanciaAtual = distancia.get(atual);
      if (distanciaAtual === limite) continue;

      for (const vizinho of this.adjacencias.get(atual)) {
        if (!distancia.has(vizinho)) {
          distancia.set(vizinho, distanciaAtual + 1);
          fila.push(vizinho);
        }
      }
    }

    return distancia;
  }
}
