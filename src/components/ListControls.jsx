export function ListControls({ busca, onBuscaChange, ordenacao, onOrdenacaoChange, onLimpar }) {
  return (
    <div className="filtros-lista">
      <input
        type="search"
        placeholder="Buscar por nome do produto"
        value={busca}
        onChange={(event) => onBuscaChange(event.target.value)}
      />
      <select value={ordenacao} onChange={(event) => onOrdenacaoChange(event.target.value)}>
        <option value="validade_asc">Validade mais proxima</option>
        <option value="validade_desc">Validade mais distante</option>
        <option value="nome_asc">Nome (A-Z)</option>
        <option value="entrada_desc">Entrada mais recente</option>
      </select>
      <button type="button" className="botao-secundario" onClick={onLimpar}>
        Limpar lista
      </button>
    </div>
  )
}
