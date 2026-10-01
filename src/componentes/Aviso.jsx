export default function Aviso({ icone: Icone, titulo, tom = 'neutro', children, acao }) {
  return (
    <div className={`aviso aviso--${tom}`}>
      <span className="aviso__icone">
        <Icone />
      </span>
      <div className="aviso__texto">
        <h3>{titulo}</h3>
        <p>{children}</p>
        {acao}
      </div>
    </div>
  );
}
