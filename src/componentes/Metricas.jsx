export default function Metricas({ itens }) {
  return (
    <dl className="metricas">
      {itens.map(({ rotulo, valor, destaque }) => (
        <div key={rotulo} className={destaque ? 'metrica metrica--destaque' : 'metrica'}>
          <dt>{rotulo}</dt>
          <dd>{valor}</dd>
        </div>
      ))}
    </dl>
  );
}
