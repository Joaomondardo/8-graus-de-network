import { useMemo, useRef, useState } from 'react';
import { ATOR, FILME } from '../Grafo';
import Vertice from './Vertice';
import { IconeExpandir, IconeLista, IconeTerminal } from './Icones';
import { filtrarPorRelevancia, normalizar } from '../utils/busca';
import { formatarNumero, pluralizar } from '../utils/formatacao';

const POR_PAGINA = 25;
const TODOS = 'todos';
const TIPOS = [
  { valor: TODOS, rotulo: 'Todos' },
  { valor: ATOR, rotulo: 'Atores' },
  { valor: FILME, rotulo: 'Filmes' },
];

function ExploradorAdjacencias({ grafo }) {
  const [busca, setBusca] = useState('');
  const [tipo, setTipo] = useState(TODOS);
  const [quantidade, setQuantidade] = useState(POR_PAGINA);
  const [mensagem, setMensagem] = useState('');
  const controlesRef = useRef(null);

  const entradas = useMemo(
    () =>
      Array.from(grafo.adjacencias, ([vertice, adjacentes]) => ({
        vertice,
        adjacentes,
        busca: normalizar(vertice.nome),
      })),
    [grafo],
  );

  const filtradas = useMemo(() => {
    const doTipo = tipo === TODOS ? entradas : entradas.filter(({ vertice }) => vertice.tipo === tipo);
    const consulta = normalizar(busca);
    return consulta ? filtrarPorRelevancia(doTipo, consulta) : doTipo;
  }, [entradas, busca, tipo]);

  const visiveis = filtradas.slice(0, quantidade);
  const restantes = filtradas.length - visiveis.length;

  const filtrar = (texto, novoTipo) => {
    setBusca(texto);
    setTipo(novoTipo);
    setQuantidade(POR_PAGINA);
  };

  const navegarPara = (vertice) => {
    filtrar(vertice.nome, TODOS);
    controlesRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  };

  const exibirNoConsole = () => {
    grafo.show();
    setMensagem(
      `${formatarNumero(grafo.adjacencias.size)} vértices exibidos no console do navegador (F12 › Console).`,
    );
  };

  return (
    <div className="adjacencias__conteudo">
      <p className="adjacencias__descricao">
        Cada vértice aparece com a sua lista de adjacentes. Como o grafo é não direcionado, toda aresta entre
        filme e ator aparece nas duas listas. Clique em um adjacente para navegar até ele.
      </p>

      <div ref={controlesRef} className="adjacencias__controles">
        <input
          type="search"
          className="campo-texto"
          placeholder="Filtrar vértices pelo nome"
          aria-label="Filtrar vértices pelo nome"
          value={busca}
          onChange={(evento) => filtrar(evento.target.value, tipo)}
        />

        <div className="segmentado" role="group" aria-label="Tipo de vértice">
          {TIPOS.map(({ valor, rotulo }) => (
            <button key={valor} type="button" aria-pressed={tipo === valor} onClick={() => filtrar(busca, valor)}>
              {rotulo}
            </button>
          ))}
        </div>

        <button type="button" className="botao-pequeno" onClick={exibirNoConsole}>
          <IconeTerminal />
          Exibir no console
        </button>
      </div>

      {mensagem && (
        <p className="adjacencias__mensagem" role="status">
          {mensagem}
        </p>
      )}

      {visiveis.length === 0 ? (
        <p className="adjacencias__vazio">Nenhum vértice encontrado com esse nome.</p>
      ) : (
        <ul className="adjacencias__lista">
          {visiveis.map(({ vertice, adjacentes }) => (
            <li key={vertice.chave} className="adjacencia">
              <div className="adjacencia__vertice">
                <Vertice vertice={vertice} />
                <span className="adjacencia__grau">
                  grau {formatarNumero(adjacentes.length)}
                  {vertice.tipo === FILME && ` · id ${vertice.id}`}
                </span>
              </div>

              <ul className="adjacencia__vizinhos" aria-label={`Adjacentes de ${vertice.nome}`}>
                {adjacentes.map((vizinho) => (
                  <li key={vizinho.chave}>
                    <button type="button" className="adjacencia__vizinho" onClick={() => navegarPara(vizinho)}>
                      <Vertice vertice={vizinho} tamanho="pequeno" />
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}

      <div className="paginacao">
        <p className="resultado__nota">
          Mostrando {formatarNumero(visiveis.length)} de {pluralizar(filtradas.length, 'vértice', 'vértices')}
        </p>
        {restantes > 0 && (
          <button type="button" className="botao-mais" onClick={() => setQuantidade((atual) => atual + POR_PAGINA)}>
            Mostrar mais {formatarNumero(Math.min(POR_PAGINA, restantes))}
          </button>
        )}
      </div>
    </div>
  );
}

export default function ListaAdjacencias({ grafo }) {
  const [aberta, setAberta] = useState(false);

  return (
    <details className="cartao adjacencias" onToggle={(evento) => setAberta(evento.currentTarget.open)}>
      <summary className="adjacencias__resumo">
        <span className="adjacencias__icone">
          <IconeLista />
        </span>
        <span className="adjacencias__titulo">
          <strong>Lista de adjacências</strong>
          <small>Explore os vértices do grafo e seus adjacentes, como na função show()</small>
        </span>
        <IconeExpandir className="adjacencias__seta" />
      </summary>

      {aberta && <ExploradorAdjacencias grafo={grafo} />}
    </details>
  );
}
