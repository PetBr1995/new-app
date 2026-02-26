import { useMemo, useState } from 'react'
import './App.css'
import { Tabs } from './components/Tabs'
import { useProducts } from './hooks/useProducts'
import { CadastroPage } from './pages/CadastroPage'
import { ListaPage } from './pages/ListaPage'
import { dataHoje } from './utils/date'

const initialForm = {
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
  const { produtosComStatus, criarProduto, atualizarProduto, removerProduto, limparProdutos } = useProducts()

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

  const handleSubmitCadastro = (event) => {
    event.preventDefault()

    const payload = parseProdutoForm(form)
    if (!payload) {
      return
    }

    criarProduto(payload)
    setForm(initialForm)
  }

  return (
    <main className="poc-container">
      <header>
        <p className="kicker">POC - ENTRADA DE PRODUTOS</p>
        <h1>Cadastro simples com persistencia em localStorage</h1>
      </header>

      <Tabs telaAtiva={telaAtiva} onChange={setTelaAtiva} totalAlertas={totalAlertas} />

      {telaAtiva === 'cadastro' && (
        <CadastroPage form={form} onChange={handleChangeCadastro} onSubmit={handleSubmitCadastro} />
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
