import { STORAGE_KEY } from '../constants/product'

function parseProdutos(valor) {
  if (!valor) {
    return []
  }

  try {
    const produtos = JSON.parse(valor)
    return Array.isArray(produtos) ? produtos : []
  } catch {
    return []
  }
}

function salvarProdutos(produtos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(produtos))
}

export const productRepository = {
  list() {
    return parseProdutos(localStorage.getItem(STORAGE_KEY))
  },

  create(produto) {
    const produtos = this.list()
    const novoProduto = { ...produto, id: crypto.randomUUID() }
    const atualizado = [novoProduto, ...produtos]
    salvarProdutos(atualizado)
    return atualizado
  },

  update(id, payload) {
    const atualizado = this.list().map((produto) =>
      produto.id === id ? { ...produto, ...payload } : produto
    )
    salvarProdutos(atualizado)
    return atualizado
  },

  remove(id) {
    const atualizado = this.list().filter((produto) => produto.id !== id)
    salvarProdutos(atualizado)
    return atualizado
  },

  clear() {
    salvarProdutos([])
    return []
  },
}
