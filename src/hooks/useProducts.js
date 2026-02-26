import { useEffect, useMemo, useState } from 'react'
import { productRepository } from '../services/productRepository'
import { calcularStatusValidade } from '../utils/productStatus'

function normalizarQuantidade(valor) {
  return Number.isInteger(valor) && valor >= 0 ? valor : 0
}

export function useProducts() {
  const [produtos, setProdutos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ativo = true

    async function carregar() {
      setIsLoading(true)
      setError('')
      try {
        const lista = await productRepository.list()
        if (ativo) {
          setProdutos(Array.isArray(lista) ? lista : [])
        }
      } catch (err) {
        if (ativo) {
          setError('Nao foi possivel carregar os produtos.')
        }
      } finally {
        if (ativo) {
          setIsLoading(false)
        }
      }
    }

    carregar()
    return () => {
      ativo = false
    }
  }, [])

  const produtosComStatus = useMemo(
    () =>
      produtos.map((produto) => ({
        ...produto,
        quantidadeEstoque: normalizarQuantidade(produto.quantidadeEstoque),
        validadeInfo: calcularStatusValidade(produto.validade),
      })),
    [produtos]
  )

  const criarProduto = async (payload) => {
    setError('')
    try {
      const atualizado = await productRepository.create(payload)
      setProdutos(Array.isArray(atualizado) ? atualizado : [])
      return true
    } catch (err) {
      setError('Nao foi possivel cadastrar o produto.')
      return false
    }
  }

  const atualizarProduto = async (id, payload) => {
    setError('')
    try {
      const atualizado = await productRepository.update(id, payload)
      setProdutos(Array.isArray(atualizado) ? atualizado : [])
      return true
    } catch (err) {
      setError('Nao foi possivel atualizar o produto.')
      return false
    }
  }

  const removerProduto = async (id) => {
    setError('')
    try {
      const atualizado = await productRepository.remove(id)
      setProdutos(Array.isArray(atualizado) ? atualizado : [])
      return true
    } catch (err) {
      setError('Nao foi possivel remover o produto.')
      return false
    }
  }

  const limparProdutos = async () => {
    setError('')
    try {
      const atualizado = await productRepository.clear()
      setProdutos(Array.isArray(atualizado) ? atualizado : [])
      return true
    } catch (err) {
      setError('Nao foi possivel limpar a lista.')
      return false
    }
  }

  return {
    produtos,
    produtosComStatus,
    isLoading,
    error,
    criarProduto,
    atualizarProduto,
    removerProduto,
    limparProdutos,
  }
}
