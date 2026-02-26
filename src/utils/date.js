export function dataHoje() {
  const hoje = new Date()
  const ano = hoje.getFullYear()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  const dia = String(hoje.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

export function formatarData(dataIso) {
  const data = new Date(`${dataIso}T00:00:00`)
  return new Intl.DateTimeFormat('pt-BR').format(data)
}
