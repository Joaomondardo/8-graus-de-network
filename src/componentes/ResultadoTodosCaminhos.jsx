import { useMemo, useState } from 'react';
import Aviso from './Aviso';
import CaminhoVisual from './CaminhoVisual';
import Metricas from './Metricas';
import { IconeAlerta, IconeDesconectado, IconeSeta, IconeSucesso } from './Icones';
import { MAX_ARESTAS } from '../servicos/rede';
import { formatarNumero, formatarTempo, pluralizar } from '../utils/formatacao';

const POR_PAGINA = 20;

const comprimentoDe = (caminho) => caminho.length - 1;

const chaveDoCaminho = (caminho) => caminho.map(({ chave }) => chave).join('>');

const contarPorComprimento = (caminhos) => {
  const contagem = new Map();
  for (const caminho of caminhos) {
    const comprimento = comprimentoDe(caminho);
    contagem.set(comprimento, (contagem.get(comprimento) ?? 0) + 1);
  }
  return [...contagem].sort(([a], [b]) => a - b);
};

function SemCaminhos({ origem, destino, comprimentoMinimo, onVerCaminhoMinimo }) {
  if (comprimentoMinimo === null) {
    return (
      <Aviso icone={IconeDesconectado} titulo="Nenhum relacionamento encontrado" tom="erro">
        Não existe nenhuma sequência de filmes ligando <strong>{origem.nome}</strong> a{' '}
        <strong>{destino.nome}</strong> nesta base: eles estão em partes desconectadas do grafo.
      </Aviso>
    );
  }

  return (
    <Aviso
      icone={IconeAlerta}
      titulo={`Nenhum caminho com até ${MAX_ARESTAS} arestas`}
      tom="alerta"
      acao={
        <button type="button" className="botao-link" onClick={onVerCaminhoMinimo}>
          Ver o caminho mínimo
          <IconeSeta />
        </button>
      }
    >
      <strong>{origem.nome}</strong> e <strong>{destino.nome}</strong> estão conectados, mas o caminho mínimo
      entre eles tem {pluralizar(comprimentoMinimo, 'aresta', 'arestas')}, acima do limite de {MAX_ARESTAS}.
    </Aviso>
  );
}

export default function ResultadoTodosCaminhos({ resultado, onVerCaminhoMinimo }) {
  const { origem, destino, caminhos, limiteAtingido, explorados, tempo, comprimentoMinimo } = resultado;
  const [filtro, setFiltro] = useState(null);
  const [quantidade, setQuantidade] = useState(POR_PAGINA);

  const grupos = useMemo(() => contarPorComprimento(caminhos), [caminhos]);
  const filtrados = useMemo(
    () => (filtro === null ? caminhos : caminhos.filter((caminho) => comprimentoDe(caminho) === filtro)),
    [caminhos, filtro],
  );

  if (caminhos.length === 0) {
    return (
      <SemCaminhos
        origem={origem}
        destino={destino}
        comprimentoMinimo={comprimentoMinimo}
        onVerCaminhoMinimo={onVerCaminhoMinimo}
      />
    );
  }

  const menor = comprimentoDe(caminhos[0]);
  const visiveis = filtrados.slice(0, quantidade);
  const restantes = filtrados.length - visiveis.length;
  const opcoesFiltro = [[null, caminhos.length], ...grupos];

  const filtrar = (comprimento) => {
    setFiltro(comprimento);
    setQuantidade(POR_PAGINA);
  };

  return (
    <div className="resultado__conteudo">
      <div className="resultado__resumo">
        <span className="selo selo--sucesso">
          <IconeSucesso />
          {pluralizar(caminhos.length, 'caminho encontrado', 'caminhos encontrados')}
        </span>
        <h3 className="resultado__titulo">
          {origem.nome}
          <IconeSeta />
          {destino.nome}
        </h3>
      </div>

      <Metricas
        itens={[
          {
            rotulo: `Caminhos com até ${MAX_ARESTAS} arestas`,
            valor: `${formatarNumero(caminhos.length)}${limiteAtingido ? '+' : ''}`,
            destaque: true,
          },
          { rotulo: 'Comprimento mínimo', valor: pluralizar(menor, 'aresta', 'arestas') },
          { rotulo: 'Caminhos parciais explorados', valor: formatarNumero(explorados) },
          { rotulo: 'Tempo da busca', valor: formatarTempo(tempo) },
        ]}
      />

      {limiteAtingido && (
        <p className="resultado__nota resultado__nota--alerta">
          <IconeAlerta />
          Existem mais caminhos do que o limite de {formatarNumero(caminhos.length)}. A lista mostra os mais curtos.
        </p>
      )}

      <section className="resultado__secao">
        <div className="resultado__barra">
          <h4 className="resultado__subtitulo">Caminhos encontrados</h4>
          {grupos.length > 1 && (
            <div className="filtros" role="group" aria-label="Filtrar caminhos por comprimento">
              {opcoesFiltro.map(([comprimento, total]) => (
                <button
                  key={comprimento ?? 'todos'}
                  type="button"
                  className="filtro"
                  aria-pressed={filtro === comprimento}
                  onClick={() => filtrar(comprimento)}
                >
                  {comprimento === null ? 'Todos' : `${comprimento} arestas`}
                  <span className="filtro__quantidade">{formatarNumero(total)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <ol className="lista-caminhos">
          {visiveis.map((caminho, posicao) => {
            const comprimento = comprimentoDe(caminho);
            return (
              <li key={chaveDoCaminho(caminho)} className="lista-caminhos__item">
                <div className="lista-caminhos__cabecalho">
                  <span className="lista-caminhos__numero">#{formatarNumero(posicao + 1)}</span>
                  <span className="selo">{pluralizar(comprimento, 'aresta', 'arestas')}</span>
                  {comprimento === menor && <span className="selo selo--sucesso">mínimo</span>}
                </div>
                <CaminhoVisual caminho={caminho} compacto />
              </li>
            );
          })}
        </ol>

        <div className="paginacao">
          <p className="resultado__nota">
            Mostrando {formatarNumero(visiveis.length)} de {pluralizar(filtrados.length, 'caminho', 'caminhos')}
          </p>
          {restantes > 0 && (
            <button type="button" className="botao-mais" onClick={() => setQuantidade((atual) => atual + POR_PAGINA)}>
              Mostrar mais {formatarNumero(Math.min(POR_PAGINA, restantes))}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
