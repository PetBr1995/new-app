export function Tabs({ telaAtiva, onChange, totalAlertas }) {
  return (
    <nav className="tabs">
      <button
        type="button"
        className={telaAtiva === 'cadastro' ? 'tab ativo' : 'tab'}
        onClick={() => onChange('cadastro')}
      >
        Cadastro
      </button>
      <button
        type="button"
        className={telaAtiva === 'lista' ? 'tab ativo' : 'tab'}
        onClick={() => onChange('lista')}
      >
        Lista {totalAlertas > 0 && <span className="badge-alerta">{totalAlertas}</span>}
      </button>
    </nav>
  )
}
