import { BarcodeScanner } from '../components/BarcodeScanner'
import { ProductForm } from '../components/ProductForm'

export function CadastroPage({ form, onChange, onSetCodigoBarras, onSubmit }) {
  return (
    <>
      <BarcodeScanner onDetected={onSetCodigoBarras} />
      <ProductForm form={form} onChange={onChange} onSubmit={onSubmit} submitLabel="Dar entrada no produto" />
    </>
  )
}
