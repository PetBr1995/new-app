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

export const productLocalRepository = {
  async list() {
    return parseProdutos(localStorage.getItem(STORAGE_KEY))
  },

  async create(produto) {
    const produtos = await this.list()
    const novoProduto = { ...produto, id: crypto.randomUUID() }
    const atualizado = [novoProduto, ...produtos]
    salvarProdutos(atualizado)
    return atualizado
  },

  async update(id, payload) {
    const produtos = await this.list()
    const atualizado = produtos.map((produto) =>
      produto.id === id ? { ...produto, ...payload } : produto
    )
    salvarProdutos(atualizado)
    return atualizado
  },

  async remove(id) {
    const produtos = await this.list()
    const atualizado = produtos.filter((produto) => produto.id !== id)
    salvarProdutos(atualizado)
    return atualizado
  },

  async clear() {
    salvarProdutos([])
    return []
  },
}
