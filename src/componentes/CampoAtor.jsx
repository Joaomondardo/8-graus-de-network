import { useImperativeHandle, useMemo, useRef, useState } from 'react';
import Avatar from './Avatar';
import { IconeAlerta, IconeBusca, IconeFechar } from './Icones';
import { localizar, normalizar } from '../utils/busca';
import { formatarNumero, pluralizar } from '../utils/formatacao';

const manterFoco = (evento) => evento.preventDefault();

function NomeDestacado({ nome, busca, consulta }) {
  const inicio = consulta && busca.length === nome.length ? localizar(busca, consulta) : -1;
  if (inicio < 0) return nome;

  const fim = inicio + consulta.length;
  return (
    <>
      {nome.slice(0, inicio)}
      <mark>{nome.slice(inicio, fim)}</mark>
      {nome.slice(fim)}
    </>
  );
}

function Ajuda({ id, erro, selecionado, totalAtores }) {
  if (erro) {
    return (
      <p id={id} className="campo-ator__ajuda campo-ator__ajuda--erro">
        <IconeAlerta />
        {erro}
      </p>
    );
  }

  return (
    <p id={id} className="campo-ator__ajuda">
      {selecionado
        ? `Atuou em ${pluralizar(selecionado.filmes, 'filme', 'filmes')} desta base`
        : `Busque entre ${formatarNumero(totalAtores)} atores, com ou sem acento`}
    </p>
  );
}

export default function CampoAtor({ id, rotulo, placeholder, valor, erro, indice, onChange, ref }) {
  const [aberto, setAberto] = useState(false);
  const [destacado, setDestacado] = useState(0);
  const entradaRef = useRef(null);
  const listaRef = useRef(null);

  useImperativeHandle(ref, () => ({ focus: () => entradaRef.current?.focus() }), []);

  const consulta = normalizar(valor);
  const opcoes = useMemo(() => indice.filtrar(valor), [indice, valor]);
  const selecionado = indice.encontrar(valor);
  const ativo = destacado < opcoes.length ? destacado : 0;
  const painelVisivel = aberto && (opcoes.length > 0 || consulta !== '');
  const idLista = `${id}-lista`;
  const idAjuda = `${id}-ajuda`;
  const idOpcao = (posicao) => `${id}-opcao-${posicao}`;

  const digitar = (texto) => {
    onChange(texto);
    setDestacado(0);
    setAberto(true);
  };

  const escolher = (opcao) => {
    onChange(opcao.nome);
    setAberto(false);
  };

  const limpar = () => {
    digitar('');
    entradaRef.current?.focus();
  };

  const mover = (passo) => {
    if (!aberto) {
      setAberto(true);
      return;
    }
    if (opcoes.length === 0) return;

    const proximo = (ativo + passo + opcoes.length) % opcoes.length;
    setDestacado(proximo);
    listaRef.current?.children[proximo]?.scrollIntoView({ block: 'nearest' });
  };

  const aoPressionarTecla = (evento) => {
    if (evento.key === 'ArrowDown' || evento.key === 'ArrowUp') {
      evento.preventDefault();
      mover(evento.key === 'ArrowDown' ? 1 : -1);
    } else if (evento.key === 'Enter' && painelVisivel && opcoes[ativo]) {
      evento.preventDefault();
      escolher(opcoes[ativo]);
    } else if (evento.key === 'Escape' && painelVisivel) {
      evento.preventDefault();
      setAberto(false);
    }
  };

  const classes = ['campo-ator', selecionado && 'campo-ator--selecionado', erro && 'campo-ator--erro'];

  return (
    <div className={classes.filter(Boolean).join(' ')}>
      <label className="campo-ator__rotulo" htmlFor={id}>
        {rotulo}
      </label>

      <div className="campo-ator__ancora">
        <div className="campo-ator__caixa">
          <span className="campo-ator__prefixo" aria-hidden="true">
            {selecionado ? <Avatar nome={selecionado.nome} tamanho="pequeno" /> : <IconeBusca />}
          </span>

          <input
            ref={entradaRef}
            id={id}
            className="campo-ator__entrada"
            type="text"
            role="combobox"
            autoComplete="off"
            spellCheck={false}
            placeholder={placeholder}
            value={valor}
            aria-autocomplete="list"
            aria-expanded={painelVisivel}
            aria-controls={painelVisivel ? idLista : undefined}
            aria-activedescendant={painelVisivel && opcoes.length > 0 ? idOpcao(ativo) : undefined}
            aria-invalid={Boolean(erro)}
            aria-describedby={idAjuda}
            onChange={(evento) => digitar(evento.target.value)}
            onClick={() => setAberto(true)}
            onBlur={() => setAberto(false)}
            onKeyDown={aoPressionarTecla}
          />

          {valor && (
            <button
              type="button"
              className="campo-ator__limpar"
              aria-label={`Limpar ${rotulo.toLowerCase()}`}
              onMouseDown={manterFoco}
              onClick={limpar}
            >
              <IconeFechar />
            </button>
          )}
        </div>

        {painelVisivel && (
          <div className="campo-ator__painel">
            {!consulta && <p className="campo-ator__titulo-lista">Mais frequentes na base</p>}

            {opcoes.length > 0 ? (
              <ul ref={listaRef} id={idLista} role="listbox" aria-label={rotulo} className="campo-ator__lista">
                {opcoes.map((opcao, posicao) => (
                  <li
                    key={opcao.nome}
                    id={idOpcao(posicao)}
                    role="option"
                    aria-selected={posicao === ativo}
                    className={posicao === ativo ? 'campo-ator__opcao campo-ator__opcao--ativa' : 'campo-ator__opcao'}
                    onMouseDown={manterFoco}
                    onMouseEnter={() => setDestacado(posicao)}
                    onClick={() => escolher(opcao)}
                  >
                    <Avatar nome={opcao.nome} tamanho="pequeno" />
                    <span className="campo-ator__nome">
                      <NomeDestacado nome={opcao.nome} busca={opcao.busca} consulta={consulta} />
                    </span>
                    <span className="campo-ator__filmes">{pluralizar(opcao.filmes, 'filme', 'filmes')}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p id={idLista} className="campo-ator__vazio" role="status">
                Nenhum ator encontrado para “{valor.trim()}”.
              </p>
            )}
          </div>
        )}
      </div>

      <Ajuda id={idAjuda} erro={erro} selecionado={selecionado} totalAtores={indice.total} />
    </div>
  );
}
