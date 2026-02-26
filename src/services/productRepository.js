import { productApiRepository } from './productApiRepository'
import { productLocalRepository } from './productLocalRepository'

const DATA_SOURCE = import.meta.env.VITE_PRODUCTS_DATA_SOURCE || 'local'

export const productRepository = DATA_SOURCE === 'api' ? productApiRepository : productLocalRepository

export const productDataSource = DATA_SOURCE
