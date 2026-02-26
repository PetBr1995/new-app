import { ProductForm } from '../components/ProductForm'

export function CadastroPage({ form, onChange, onSubmit }) {
  return <ProductForm form={form} onChange={onChange} onSubmit={onSubmit} submitLabel="Dar entrada no produto" />
}
