# 8 Graus de Network

Aplicação em React + Vite que encontra o relacionamento mais próximo entre dois atores usando Busca em Largura (BFS) em um grafo de filmes e atores.

## Como executar

bash
npm install
npm run dev

Depois, abra `http://localhost:5173`.

## Modelagem do grafo

- Cada filme e cada ator é um **vértice**; cada participação de um ator em um filme é uma **aresta**.
- O grafo é **não direcionado** e usa **lista de adjacências** (`Map<vértice, vértice[]>`): toda aresta é registrada no filme e no ator.
- A base `latest_movies.json` gera **10.375 vértices** (8.905 atores e 1.470 filmes) e **14.323 arestas**.
- Filmes com o mesmo título são vértices diferentes, identificados pelo `id` do JSON.

## Funções do grafo (`src/Grafo.js`)

| Função | Descrição |
| `seed(filmes)` | Carrega o JSON no grafo, ignorando filmes sem título ou sem elenco e nomes vazios ou repetidos. |
| `show()` | Exibe no console cada vértice e a sua lista de adjacentes. |
| `bfs(origem, destino)` | Busca em Largura padrão. Retorna o caminho mínimo e quantos vértices foram visitados. Complexidade O(V + E). |
| `bfsAdaptada(origem, destino, 8)` | BFS em que a fila guarda caminhos em vez de vértices. Lista, do mais curto ao mais longo, todos os caminhos simples com até 8 arestas. Uma BFS a partir do destino calcula as distâncias usadas para descartar ramos que não chegariam ao destino dentro do limite. |

Como o grafo é bipartido (ator → filme → ator), um caminho entre dois atores sempre tem comprimento par: 8 arestas equivalem a até 4 filmes e 3 atores intermediários.

## Interface

- Campos de origem e destino com sugestões alimentadas pelos vértices de atores, busca sem acento e navegação por teclado.
- Botão para a BFS padrão (caminho mínimo) e botão para a BFS adaptada (todos os caminhos com até 8 arestas).
- Resultado com o caminho percorrido, o comprimento, os graus de separação e um resumo em texto de como os atores se conectam.
- Na BFS adaptada, filtro por comprimento e paginação dos caminhos.
- Mensagens para atores não encontrados, atores sem relacionamento e caminhos acima do limite de 8 arestas.
- Painel com a lista de adjacências, filtro por nome e tipo, e botão que executa `show()` no console.
- Tema claro ou escuro conforme o sistema e layout adaptado para celular.

## Estrutura

src/
 Grafo.js              estrutura de dados e algoritmos
 servicos/rede.js      carga da base, índice de atores e execução das buscas
 componentes/          componentes da interface
 utils/                normalização de texto e formatação
 App.jsx               tela principal
 App.css               estilos dos componentes
 index.css             tema e estilos globais
 main.jsx              ponto de entrada

