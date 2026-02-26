import { useMemo, useState } from 'react'
import './App.css'
import { Tabs } from './components/Tabs'
import { useProducts } from './hooks/useProducts'
import { CadastroPage } from './pages/CadastroPage'
import { ListaPage } from './pages/ListaPage'
import { productDataSource } from './services/productRepository'
import { dataHoje } from './utils/date'

const initialForm = {
  codigoBarras: '',
  nome: '',
  dataEntrada: dataHoje(),
  pesoKg: '',
  quantidadeEstoque: '',
  validade: '',
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

function App() {
  const [telaAtiva, setTelaAtiva] = useState('cadastro')
  const [form, setForm] = useState(initialForm)
  const { produtosComStatus, isLoading, error, criarProduto, atualizarProduto, removerProduto, limparProdutos } =
    useProducts()

  const totalAlertas = useMemo(
    () =>
      produtosComStatus.filter((produto) => {
        const dias = produto.validadeInfo.diasRestantes
        return dias <= 7
      }).length,
    [produtosComStatus]
  )

  const handleChangeCadastro = (event) => {
    const { name, value } = event.target
    setForm((estadoAnterior) => ({ ...estadoAnterior, [name]: value }))
  }

  const handleSubmitCadastro = async (event) => {
    event.preventDefault()

    const payload = parseProdutoForm(form)
    if (!payload) {
      return
    }

    const ok = await criarProduto(payload)
    if (ok) {
      setForm(initialForm)
    }
  }

  return (
    <main className="poc-container">
      <header>
        <p className="kicker">POC - ENTRADA DE PRODUTOS</p>
        <h1>Cadastro simples pronto para backend</h1>
        <p className="fonte-dados">Fonte de dados ativa: {productDataSource}</p>
      </header>

      {isLoading && <p className="feedback">Carregando produtos...</p>}
      {error && <p className="feedback erro">{error}</p>}

      <Tabs telaAtiva={telaAtiva} onChange={setTelaAtiva} totalAlertas={totalAlertas} />

      {telaAtiva === 'cadastro' && (
        <CadastroPage
          form={form}
          onChange={handleChangeCadastro}
          onSetCodigoBarras={(codigoBarras) =>
            setForm((estadoAnterior) => ({ ...estadoAnterior, codigoBarras }))
          }
          onSubmit={handleSubmitCadastro}
        />
      )}

      {telaAtiva === 'lista' && (
        <ListaPage
          produtosComStatus={produtosComStatus}
          onAtualizar={atualizarProduto}
          onRemover={removerProduto}
          onLimpar={limparProdutos}
        />
      )}
    </main>
  )
}

export default App
