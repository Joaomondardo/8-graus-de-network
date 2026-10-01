import { IconeRede } from './Icones';
import { formatarNumero } from '../utils/formatacao';

export default function Cabecalho({ estatisticas }) {
  return (
    <header className="topo">
      <span className="topo__marca">
        <span className="topo__logo">
          <IconeRede />
        </span>
        Teoria dos Grafos · Busca em Largura
      </span>

      <h1 className="topo__titulo">
        <span className="topo__destaque">8 Graus</span> de Network
      </h1>

      <p className="topo__descricao">
        Descubra como dois atores se conectam pelos filmes em que atuaram juntos.
      </p>

      <ul className="estatisticas" aria-label="Tamanho do grafo">
        {estatisticas.map(({ rotulo, valor }) => (
          <li key={rotulo}>
            <strong>{formatarNumero(valor)}</strong> {rotulo}
          </li>
        ))}
      </ul>
    </header>
  );
}
