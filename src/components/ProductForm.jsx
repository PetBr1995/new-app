export function ProductForm({ form, onChange, onSubmit, submitLabel, className = 'form-produto' }) {
  return (
    <form className={className} onSubmit={onSubmit}>
      <div className="form-grid">
        <label>
          Nome
          <input
            name="nome"
            value={form.nome}
            onChange={onChange}
            placeholder="Ex: Leite Integral"
            required
          />
        </label>

        <label>
          Data de entrada
          <input
            name="dataEntrada"
            type="date"
            value={form.dataEntrada}
            onChange={onChange}
            required
          />
        </label>

        <label>
          Peso (kg)
          <input
            name="pesoKg"
            type="number"
            step="0.01"
            min="0.01"
            value={form.pesoKg}
            onChange={onChange}
            placeholder="0.00"
            required
          />
        </label>

        <label>
          Quantidade em estoque
          <input
            name="quantidadeEstoque"
            type="number"
            step="1"
            min="0"
            value={form.quantidadeEstoque}
            onChange={onChange}
            placeholder="0"
            required
          />
        </label>

        <label>
          Validade
          <input
            name="validade"
            type="date"
            value={form.validade}
            onChange={onChange}
            required
          />
        </label>
      </div>

      <button type="submit">{submitLabel}</button>
    </form>
  )
}
