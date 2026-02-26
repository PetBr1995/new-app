import { calcularStatusValidade } from '../utils/productStatus'

export function AlertsPanel({ produtosProximos, produtosVencidos }) {
  if (produtosProximos.length === 0 && produtosVencidos.length === 0) {
    return null
  }

  return (
    <section className="alertas">
      {produtosProximos.length > 0 && (
        <article className="alerta alerta-proximo">
          <h2>Alerta: produtos proximos de vencer ({produtosProximos.length})</h2>
          <ul>
            {produtosProximos.map((produto) => {
              const { diasRestantes } = calcularStatusValidade(produto.validade)
              return (
                <li key={`proximo-${produto.id}`}>
                  {produto.nome} - vence em {diasRestantes} dia(s)
                </li>
              )
            })}
          </ul>
        </article>
      )}

      {produtosVencidos.length > 0 && (
        <article className="alerta alerta-vencido">
          <h2>Alerta: produtos vencidos ({produtosVencidos.length})</h2>
          <ul>
            {produtosVencidos.map((produto) => {
              const { diasRestantes } = calcularStatusValidade(produto.validade)
              return (
                <li key={`vencido-${produto.id}`}>
                  {produto.nome} - vencido ha {Math.abs(diasRestantes)} dia(s)
                </li>
              )
            })}
          </ul>
        </article>
      )}
    </section>
  )
}
