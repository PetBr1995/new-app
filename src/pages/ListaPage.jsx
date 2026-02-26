import { useMemo, useState } from 'react'
import { AlertsPanel } from '../components/AlertsPanel'
import { ListControls } from '../components/ListControls'
import { ListSummary } from '../components/ListSummary'
import { ProductCard } from '../components/ProductCard'

function ordenarProdutos(produtos, ordenacao) {
  const ordenados = [...produtos]

  if (ordenacao === 'validade_desc') {
    return ordenados.sort((a, b) => b.validade.localeCompare(a.validade))
  }

  if (ordenacao === 'nome_asc') {
    return ordenados.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
  }

  if (ordenacao === 'entrada_desc') {
    return ordenados.sort((a, b) => b.dataEntrada.localeCompare(a.dataEntrada))
  }

  return ordenados.sort((a, b) => a.validade.localeCompare(b.validade))
}

const emptyEditForm = {
  codigoBarras: '',
  nome: '',
  dataEntrada: '',
  pesoKg: '',
  quantidadeEstoque: '',
  validade: '',
}

function mapProdutoParaForm(produto) {
  return {
    codigoBarras: produto.codigoBarras || '',
    nome: produto.nome,
    dataEntrada: produto.dataEntrada,
    pesoKg: String(produto.pesoKg),
    quantidadeEstoque: String(produto.quantidadeEstoque),
    validade: produto.validade,
  }
}

function parseProdutoForm(form) {
  const peso = Number(form.pesoKg)
  const quantidade = Number(form.quantidadeEstoque)
  const quantidadeInvalida = !Number.isInteger(quantidade) || quantidade < 0

  const invalido =
    !form.nome.trim() ||
    !form.dataEntrada ||
    !form.validade ||
    !peso ||
    peso <= 0 ||
    quantidadeInvalida

  if (invalido) {
    return null
  }

  return {
    codigoBarras: form.codigoBarras.trim(),
    nome: form.nome.trim(),
    dataEntrada: form.dataEntrada,
    pesoKg: peso,
    quantidadeEstoque: quantidade,
    validade: form.validade,
  }
}

export function ListaPage({ produtosComStatus, onAtualizar, onRemover, onLimpar }) {
  const [busca, setBusca] = useState('')
  const [ordenacao, setOrdenacao] = useState('validade_asc')
  const [produtoEmEdicao, setProdutoEmEdicao] = useState(null)
  const [formEdicao, setFormEdicao] = useState(emptyEditForm)

  const produtosVencidos = useMemo(
    () => produtosComStatus.filter((produto) => produto.validadeInfo.diasRestantes < 0),
    [produtosComStatus]
  )

  const produtosProximos = useMemo(
    () =>
      produtosComStatus.filter((produto) => {
        const dias = produto.validadeInfo.diasRestantes
        return dias >= 0 && dias <= 7
      }),
    [produtosComStatus]
  )

  const produtosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return produtosComStatus.filter((produto) => produto.nome.toLowerCase().includes(termo))
  }, [busca, produtosComStatus])

  const produtosOrdenados = useMemo(
    () => ordenarProdutos(produtosFiltrados, ordenacao),
    [ordenacao, produtosFiltrados]
  )

  const iniciarEdicao = (produto) => {
    setProdutoEmEdicao(produto.id)
    setFormEdicao(mapProdutoParaForm(produto))
  }

  const cancelarEdicao = () => {
    setProdutoEmEdicao(null)
    setFormEdicao(emptyEditForm)
  }

  const handleChangeEdicao = (event) => {
    const { name, value } = event.target
    setFormEdicao((estadoAnterior) => ({ ...estadoAnterior, [name]: value }))
  }

  const salvarEdicao = async (event, id) => {
    event.preventDefault()

    const payload = parseProdutoForm(formEdicao)
    if (!payload) {
      return
    }

    const ok = await onAtualizar(id, payload)
    if (ok) {
      cancelarEdicao()
    }
  }

  const removerProduto = async (id) => {
    const ok = await onRemover(id)
    if (ok && produtoEmEdicao === id) {
      cancelarEdicao()
    }
  }

  const limparProdutos = async () => {
    const confirmou = window.confirm('Deseja remover todos os produtos cadastrados?')
    if (!confirmou) {
      return
    }

    const ok = await onLimpar()
    if (ok) {
      cancelarEdicao()
    }
  }

  return (
    <section className="lista-produtos">
      <section className="lista-topo">
        <ListSummary
          total={produtosComStatus.length}
          proximos={produtosProximos.length}
          vencidos={produtosVencidos.length}
        />

        <ListControls
          busca={busca}
          onBuscaChange={setBusca}
          ordenacao={ordenacao}
          onOrdenacaoChange={setOrdenacao}
          onLimpar={limparProdutos}
        />
      </section>

      <AlertsPanel produtosProximos={produtosProximos} produtosVencidos={produtosVencidos} />

      {produtosComStatus.length === 0 && <p className="vazio">Nenhum produto cadastrado no storage.</p>}

      {produtosComStatus.length > 0 && produtosOrdenados.length === 0 && (
        <p className="vazio">Nenhum produto encontrado para a busca informada.</p>
      )}

      {produtosOrdenados.map((produto) => (
        <ProductCard
          key={produto.id}
          produto={produto}
          emEdicao={produtoEmEdicao === produto.id}
          formEdicao={formEdicao}
          onIniciarEdicao={iniciarEdicao}
          onSalvarEdicao={salvarEdicao}
          onCancelarEdicao={cancelarEdicao}
          onChangeEdicao={handleChangeEdicao}
          onRemover={removerProduto}
        />
      ))}
    </section>
  )
}
