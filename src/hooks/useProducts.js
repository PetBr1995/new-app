import { useMemo, useState } from 'react'
import { productRepository } from '../services/productRepository'
import { calcularStatusValidade } from '../utils/productStatus'

function normalizarQuantidade(valor) {
  return Number.isInteger(valor) && valor >= 0 ? valor : 0
}

export function useProducts() {
  const [produtos, setProdutos] = useState(() => productRepository.list())

  const produtosComStatus = useMemo(
    () =>
      produtos.map((produto) => ({
        ...produto,
        quantidadeEstoque: normalizarQuantidade(produto.quantidadeEstoque),
        validadeInfo: calcularStatusValidade(produto.validade),
      })),
    [produtos]
  )

  const criarProduto = (payload) => {
    setProdutos(productRepository.create(payload))
  }

  const atualizarProduto = (id, payload) => {
    setProdutos(productRepository.update(id, payload))
  }

  const removerProduto = (id) => {
    setProdutos(productRepository.remove(id))
  }

  const limparProdutos = () => {
    setProdutos(productRepository.clear())
  }

  return {
    produtos,
    produtosComStatus,
    criarProduto,
    atualizarProduto,
    removerProduto,
    limparProdutos,
  }
}
