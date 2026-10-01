import Aviso from './Aviso';
import CaminhoVisual from './CaminhoVisual';
import Metricas from './Metricas';
import Roteiro from './Roteiro';
import { IconeDesconectado, IconeSeta, IconeSucesso } from './Icones';
import { formatarNumero, formatarTempo, pluralizar } from '../utils/formatacao';

export default function ResultadoCaminhoMinimo({ resultado }) {
  const { origem, destino, caminho, visitados, tempo } = resultado;

  if (!caminho) {
    return (
      <Aviso icone={IconeDesconectado} titulo="Nenhum relacionamento encontrado" tom="erro">
        Não existe nenhuma sequência de filmes ligando <strong>{origem.nome}</strong> a{' '}
        <strong>{destino.nome}</strong> nesta base: eles estão em partes desconectadas do grafo. A busca
        percorreu todos os {formatarNumero(visitados)} vértices alcançáveis a partir da origem.
      </Aviso>
    );
  }

  const comprimento = caminho.length - 1;

  return (
    <div className="resultado__conteudo">
      <div className="resultado__resumo">
        <span className="selo selo--sucesso">
          <IconeSucesso />
          Caminho mínimo encontrado
        </span>
        <h3 className="resultado__titulo">
          {origem.nome}
          <IconeSeta />
          {destino.nome}
        </h3>
      </div>

      <Metricas
        itens={[
          { rotulo: 'Comprimento', valor: pluralizar(comprimento, 'aresta', 'arestas'), destaque: true },
          { rotulo: 'Graus de separação', valor: formatarNumero(comprimento / 2) },
          { rotulo: 'Vértices visitados', valor: formatarNumero(visitados) },
          { rotulo: 'Tempo da busca', valor: formatarTempo(tempo) },
        ]}
      />

      <section className="resultado__secao">
        <h4 className="resultado__subtitulo">Caminho percorrido</h4>
        <CaminhoVisual caminho={caminho} />
      </section>

      <section className="resultado__secao">
        <h4 className="resultado__subtitulo">Como eles se conectam</h4>
        <Roteiro caminho={caminho} />
      </section>
    </div>
  );
}
