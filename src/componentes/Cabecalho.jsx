import { IconeRede } from './Icones';
import { formatarNumero } from '../utils/formatacao';

export default function Cabecalho({ estatisticas }) {
  return (
    <header className="topo">
      <h1 className="visualmente-oculto">8 Graus de Network</h1>

      <span className="topo__marca">
        <span className="topo__logo">
          <IconeRede />
        </span>
        Teoria dos Grafos · Busca em Largura
      </span>

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
