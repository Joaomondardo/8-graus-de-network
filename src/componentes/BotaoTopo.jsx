import { useEffect, useState } from 'react';
import { IconeSubir } from './Icones';

const passouDoLimite = () => window.scrollY > window.innerHeight * 1.5;

export default function BotaoTopo() {
  const [visivel, setVisivel] = useState(passouDoLimite);

  useEffect(() => {
    const atualizar = () => setVisivel(passouDoLimite());
    window.addEventListener('scroll', atualizar, { passive: true });
    return () => window.removeEventListener('scroll', atualizar);
  }, []);

  if (!visivel) return null;

  const subir = () => {
    const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduzirMovimento ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      className="botao-topo"
      aria-label="Voltar ao topo da página"
      title="Voltar ao topo da página"
      onClick={subir}
    >
      <IconeSubir />
    </button>
  );
}
