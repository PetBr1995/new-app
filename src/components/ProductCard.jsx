import { formatarData } from '../utils/date'
import { ProductForm } from './ProductForm'

export function ProductCard({
  produto,
  emEdicao,
  formEdicao,
  onIniciarEdicao,
  onSalvarEdicao,
  onCancelarEdicao,
  onChangeEdicao,
  onRemover,
}) {
  const { validadeInfo } = produto

  return (
    <article className="painel card-produto">
      {!emEdicao && (
        <>
          <div className="cabecalho-card">
            <strong className="nome-card">{produto.nome}</strong>
            <strong className={`status ${validadeInfo.classe}`}>{validadeInfo.status}</strong>
          </div>

          <div className="linha">
            <span>Codigo de barras</span>
            <strong>{produto.codigoBarras || '-'}</strong>
          </div>
          <div className="linha">
            <span>Data de entrada</span>
            <strong>{formatarData(produto.dataEntrada)}</strong>
          </div>
          <div className="linha">
            <span>Peso</span>
            <strong>{produto.pesoKg.toFixed(2)} kg</strong>
          </div>
          <div className="linha">
            <span>Quantidade em estoque</span>
            <strong>{produto.quantidadeEstoque} un.</strong>
          </div>
          <div className="linha">
            <span>Validade</span>
            <strong>{formatarData(produto.validade)}</strong>
          </div>
          <div className="resumo">
            <p>
              Dias restantes para vencer: <strong>{Math.max(validadeInfo.diasRestantes, 0)}</strong>
            </p>
          </div>
          <div className="acoes-card">
            <button type="button" className="botao-editar" onClick={() => onIniciarEdicao(produto)}>
              Editar produto
            </button>
            <button type="button" className="botao-remover" onClick={() => onRemover(produto.id)}>
              Remover produto
            </button>
          </div>
        </>
      )}

      {emEdicao && (
        <ProductForm
          form={formEdicao}
          onChange={onChangeEdicao}
          onSubmit={(event) => onSalvarEdicao(event, produto.id)}
          submitLabel="Salvar alteracoes"
          className="form-edicao"
        />
      )}

      {emEdicao && (
        <div className="acoes-card">
          <button type="button" className="botao-secundario" onClick={onCancelarEdicao}>
            Cancelar
          </button>
        </div>
      )}
    </article>
  )
}
