import { iniciais, matiz } from '../utils/formatacao';

export default function Avatar({ nome, tamanho = 'medio' }) {
  return (
    <span className={`avatar avatar--${tamanho}`} style={{ '--matiz': matiz(nome) }} aria-hidden="true">
      {iniciais(nome)}
    </span>
  );
}
