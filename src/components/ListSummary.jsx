export function ListSummary({ total, proximos, vencidos }) {
  return (
    <div className="resumo-cards">
      <article>
        <small>Total</small>
        <strong>{total}</strong>
      </article>
      <article>
        <small>Proximos</small>
        <strong>{proximos}</strong>
      </article>
      <article>
        <small>Vencidos</small>
        <strong>{vencidos}</strong>
      </article>
    </div>
  )
}
