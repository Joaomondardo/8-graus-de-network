# 8 Graus de Network

Descubra como dois atores se conectam pelos filmes em que atuaram juntos. A aplicação monta um grafo de atores e filmes e usa **Busca em Largura (BFS)** para encontrar o caminho entre eles.

Feita com React + Vite.

## Como rodar

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`.

## Como funciona

- Cada **ator** e cada **filme** é um vértice. Cada participação de um ator em um filme é uma aresta.
- O grafo é não direcionado e guardado como **lista de adjacências**.
- A base `src/latest_movies.json` gera **8.905 atores**, **1.447 filmes**, **10.352 vértices** e **14.315 arestas**. Filmes com o mesmo título viram um único vértice.
- Como o caminho sempre alterna ator → filme → ator, ele tem número par de arestas: 2 arestas = 1 grau de separação.

## As duas buscas

| Busca | O que faz |
| --- | --- |
| **BFS** | Encontra o caminho mais curto entre os dois atores. |
| **BFS Adaptada** | Lista todos os caminhos com até 8 arestas, do mais curto ao mais longo. |

As funções ficam em `src/Grafo.js`: `seed()` carrega a base, `show()` imprime a lista de adjacências no console, `bfs()` e `bfsAdaptada()` fazem as buscas.

## Na tela

- Campos com sugestões de atores, busca com ou sem acento e atalhos de exemplo.
- Resultado com o caminho desenhado, métricas e um resumo de como os atores se conectam.
- Lista de adjacências com filtro por nome e por tipo (atores ou filmes).
- Tema claro e escuro automático, layout para celular e botão de voltar ao topo.

## Estrutura

```
src/
  Grafo.js          grafo e algoritmos de busca
  servicos/rede.js  carga da base e execução das buscas
  componentes/      componentes da interface
  utils/            busca sem acento e formatação
  App.jsx           tela principal
  App.css           estilos dos componentes
  index.css         cores, fontes e estilos globais
```

## Créditos

A fonte dos títulos, `public/fontes/bonum-condensada-bold.woff2`, é uma versão condensada da [TeX Gyre Bonum](https://www.gust.org.pl/projects/e-foundry/tex-gyre/bonum), distribuída sob a GUST Font License.
