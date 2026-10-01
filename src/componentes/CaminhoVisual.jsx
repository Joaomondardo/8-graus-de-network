import Vertice from './Vertice';

export default function CaminhoVisual({ caminho, compacto = false }) {
  const ultimo = caminho.length - 1;

  return (
    <ol className={compacto ? 'caminho caminho--compacto' : 'caminho'}>
      {caminho.map((vertice, posicao) => (
        <li key={vertice.chave} className="caminho__passo">
          <Vertice
            vertice={vertice}
            tamanho={compacto ? 'pequeno' : 'medio'}
            destaque={posicao === 0 || posicao === ultimo}
          />
        </li>
      ))}
    </ol>
  );
}
