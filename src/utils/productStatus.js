import { PRODUCT_STATUS } from '../constants/product'

export function calcularStatusValidade(dataValidade) {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  const validade = new Date(`${dataValidade}T00:00:00`)
  const diffMs = validade.getTime() - hoje.getTime()
  const diasRestantes = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diasRestantes < 0) {
    return {
      status: PRODUCT_STATUS.EXPIRED,
      classe: 'status-vencido',
      diasRestantes,
    }
  }

  if (diasRestantes <= 7) {
    return {
      status: PRODUCT_STATUS.NEAR_EXPIRY,
      classe: 'status-alerta',
      diasRestantes,
    }
  }

  return {
    status: PRODUCT_STATUS.VALID,
    classe: 'status-ok',
    diasRestantes,
  }
}
