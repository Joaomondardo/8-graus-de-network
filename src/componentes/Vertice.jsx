import { ATOR } from '../Grafo';
import Avatar from './Avatar';
import { IconeFilme } from './Icones';

export default function Vertice({ vertice, tamanho = 'medio', destaque = false }) {
  const ehAtor = vertice.tipo === ATOR;
  const classes = ['vertice', `vertice--${vertice.tipo}`, `vertice--${tamanho}`, destaque && 'vertice--destaque'];
  const dica = ehAtor ? `Ator: ${vertice.nome}` : `Filme: ${vertice.nome} (id ${vertice.id})`;

  return (
    <span className={classes.filter(Boolean).join(' ')} title={dica}>
      {ehAtor ? (
        <Avatar nome={vertice.nome} tamanho={tamanho} />
      ) : (
        <span className="vertice__icone" aria-hidden="true">
          <IconeFilme />
        </span>
      )}
      <span className="visualmente-oculto">{ehAtor ? 'Ator:' : 'Filme:'}</span>
      <span className="vertice__nome">{vertice.nome}</span>
    </span>
  );
}
