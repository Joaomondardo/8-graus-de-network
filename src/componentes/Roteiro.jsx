const agruparConexoes = (caminho) =>
  Array.from({ length: Math.floor(caminho.length / 2) }, (_, indice) => ({
    ator: caminho[indice * 2],
    filme: caminho[indice * 2 + 1],
    parceiro: caminho[indice * 2 + 2],
  }));

export default function Roteiro({ caminho }) {
  return (
    <ol className="roteiro">
      {agruparConexoes(caminho).map(({ ator, filme, parceiro }) => (
        <li key={filme.chave} className="roteiro__item">
          <p>
            <strong>{ator.nome}</strong> e <strong>{parceiro.nome}</strong> atuaram juntos em{' '}
            <cite>{filme.nome}</cite>.
          </p>
        </li>
      ))}
    </ol>
  );
}
