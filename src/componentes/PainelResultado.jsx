import Aviso from './Aviso';
import ResultadoCaminhoMinimo from './ResultadoCaminhoMinimo';
import ResultadoTodosCaminhos from './ResultadoTodosCaminhos';
import { IconeRede } from './Icones';
import { BUSCA_PADRAO, MAX_ARESTAS } from '../servicos/rede';
import { pluralizar } from '../utils/formatacao';

const descreverResultado = (resultado) => {
  if (!resultado) return '';

  if (resultado.tipo === BUSCA_PADRAO) {
    return resultado.caminho
      ? `Caminho mínimo encontrado com ${pluralizar(resultado.caminho.length - 1, 'aresta', 'arestas')}.`
      : 'Nenhum relacionamento encontrado entre os atores selecionados.';
  }

  return resultado.caminhos.length > 0
    ? `${pluralizar(resultado.caminhos.length, 'caminho encontrado', 'caminhos encontrados')} com até ${MAX_ARESTAS} arestas.`
    : `Nenhum caminho encontrado com até ${MAX_ARESTAS} arestas.`;
};

export default function PainelResultado({ resultado, onVerCaminhoMinimo, ref }) {
  const ehBuscaPadrao = resultado?.tipo === BUSCA_PADRAO;

  return (
    <section ref={ref} className="cartao resultado" aria-labelledby="titulo-resultado">
      <header className="cartao__cabecalho">
        <h2 id="titulo-resultado">Resultado</h2>
        {resultado && (
          <span className="selo selo--primario">
            {ehBuscaPadrao ? 'Busca em Largura (BFS)' : `BFS adaptada · até ${MAX_ARESTAS} arestas`}
          </span>
        )}
      </header>

      <p className="visualmente-oculto" role="status">
        {descreverResultado(resultado)}
      </p>

      {!resultado && (
        <Aviso icone={IconeRede} titulo="Pronto para explorar" tom="inicial">
          Escolha um ator de origem e um de destino e execute uma das buscas. O caminho entre eles vai aparecer
          aqui.
        </Aviso>
      )}

      {resultado && ehBuscaPadrao && <ResultadoCaminhoMinimo key={resultado.id} resultado={resultado} />}

      {resultado && !ehBuscaPadrao && (
        <ResultadoTodosCaminhos key={resultado.id} resultado={resultado} onVerCaminhoMinimo={onVerCaminhoMinimo} />
      )}
    </section>
  );
}
