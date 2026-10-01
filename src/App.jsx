import { useRef, useState } from 'react';
import './App.css';
import Cabecalho from './componentes/Cabecalho';
import CampoAtor from './componentes/CampoAtor';
import ListaAdjacencias from './componentes/ListaAdjacencias';
import PainelResultado from './componentes/PainelResultado';
import { IconeCaminho, IconeDado, IconeRede, IconeSeta, IconeTrocar } from './componentes/Icones';
import {
  BUSCA_ADAPTADA,
  BUSCA_PADRAO,
  MAX_ARESTAS,
  buscarCaminhoMinimo,
  buscarTodosCaminhos,
  estatisticas,
  exemplos,
  grafo,
  indiceAtores,
  sortearPar,
} from './servicos/rede';

const mensagemDeErro = (texto, papel) =>
  texto.trim() ? 'Ator não encontrado. Escolha um nome da lista de sugestões.' : `Escolha o ator de ${papel}.`;

const validar = (textos, origem, destino) => {
  const erros = {};
  if (!origem) erros.origem = mensagemDeErro(textos.origem, 'origem');
  if (!destino) erros.destino = mensagemDeErro(textos.destino, 'destino');
  if (origem && origem === destino) erros.destino = 'Escolha um ator diferente do ator de origem.';
  return erros;
};

const rolarAte = (elemento) => {
  if (!elemento || elemento.getBoundingClientRect().top < window.innerHeight * 0.6) return;
  const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  elemento.scrollIntoView({ behavior: reduzirMovimento ? 'auto' : 'smooth', block: 'start' });
};

export default function App() {
  const [textos, setTextos] = useState({ origem: '', destino: '' });
  const [erros, setErros] = useState({});
  const [resultado, setResultado] = useState(null);
  const campoOrigemRef = useRef(null);
  const campoDestinoRef = useRef(null);
  const resultadoRef = useRef(null);
  const totalBuscasRef = useRef(0);

  const preencher = (origem, destino) => {
    setTextos({ origem, destino });
    setErros({});
    setResultado(null);
  };

  const alterarCampo = (campo, texto) => {
    setTextos((atuais) => ({ ...atuais, [campo]: texto }));
    setErros((atuais) => ({ ...atuais, [campo]: null }));
    setResultado(null);
  };

  const buscar = (tipo) => {
    const origem = indiceAtores.encontrar(textos.origem)?.vertice;
    const destino = indiceAtores.encontrar(textos.destino)?.vertice;
    const novosErros = validar(textos, origem, destino);
    setErros(novosErros);

    if (novosErros.origem || novosErros.destino) {
      setResultado(null);
      (novosErros.origem ? campoOrigemRef : campoDestinoRef).current?.focus();
      return;
    }

    const executarBusca = tipo === BUSCA_PADRAO ? buscarCaminhoMinimo : buscarTodosCaminhos;
    totalBuscasRef.current += 1;
    setResultado({ id: totalBuscasRef.current, tipo, origem, destino, ...executarBusca(origem, destino) });
    rolarAte(resultadoRef.current);
  };

  const aoEnviar = (evento) => {
    evento.preventDefault();
    buscar(BUSCA_PADRAO);
  };

  return (
    <div className="aplicacao">
      <Cabecalho estatisticas={estatisticas} />

      <main className="conteudo">
        <form className="cartao busca" onSubmit={aoEnviar} noValidate>
          <header className="cartao__cabecalho">
            <div>
              <h2>Quem você quer conectar?</h2>
              <p className="cartao__descricao">
                Cada ator e cada filme é um vértice do grafo, e cada participação de um ator em um filme é uma aresta.
              </p>
            </div>
          </header>

          <div className="busca__campos">
            <CampoAtor
              ref={campoOrigemRef}
              id="ator-origem"
              rotulo="Ator de origem"
              placeholder="Ex.: Kevin Bacon"
              valor={textos.origem}
              erro={erros.origem}
              indice={indiceAtores}
              onChange={(texto) => alterarCampo('origem', texto)}
            />

            <button
              type="button"
              className="busca__trocar"
              aria-label="Inverter origem e destino"
              title="Inverter origem e destino"
              onClick={() => preencher(textos.destino, textos.origem)}
            >
              <IconeTrocar />
            </button>

            <CampoAtor
              ref={campoDestinoRef}
              id="ator-destino"
              rotulo="Ator de destino"
              placeholder="Ex.: Tom Hanks"
              valor={textos.destino}
              erro={erros.destino}
              indice={indiceAtores}
              onChange={(texto) => alterarCampo('destino', texto)}
            />
          </div>

          <div className="busca__sugestoes">
            <span className="busca__sugestoes-rotulo">Experimente:</span>
            {exemplos.map(([origem, destino]) => (
              <button
                key={`${origem}-${destino}`}
                type="button"
                className="chip"
                onClick={() => preencher(origem, destino)}
              >
                {origem}
                <IconeSeta />
                {destino}
              </button>
            ))}
            <button type="button" className="chip chip--sortear" onClick={() => preencher(...sortearPar())}>
              <IconeDado />
              Sortear atores
            </button>
          </div>

          <div className="busca__acoes">
            <button type="submit" className="botao botao--primario">
              <IconeCaminho />
              <span>
                <strong>Busca em Largura (BFS)</strong>
                <small>Encontra o caminho mínimo entre os dois</small>
              </span>
            </button>

            <button type="button" className="botao botao--secundario" onClick={() => buscar(BUSCA_ADAPTADA)}>
              <IconeRede />
              <span>
                <strong>BFS Adaptada</strong>
                <small>Todos os caminhos com até {MAX_ARESTAS} arestas</small>
              </span>
            </button>
          </div>
        </form>

        <PainelResultado
          ref={resultadoRef}
          resultado={resultado}
          onVerCaminhoMinimo={() => buscar(BUSCA_PADRAO)}
        />

        <ListaAdjacencias grafo={grafo} />
      </main>

      <footer className="rodape">
        Grafo não direcionado representado por lista de adjacências · Busca em Largura (BFS)
      </footer>
    </div>
  );
}
