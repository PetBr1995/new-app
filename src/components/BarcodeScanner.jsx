import { useEffect, useMemo, useRef, useState } from 'react'

const FORMATS = ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'itf', 'qr_code']

export function BarcodeScanner({ onDetected }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const rafRef = useRef(null)
  const detectorRef = useRef(null)

  const [isScanning, setIsScanning] = useState(false)
  const [status, setStatus] = useState('')

  const hasCameraSupport = useMemo(() => {
    return typeof window !== 'undefined' && !!navigator.mediaDevices?.getUserMedia
  }, [])

  const hasNativeBarcodeDetector = useMemo(() => {
    return typeof window !== 'undefined' && 'BarcodeDetector' in window
  }, [])

  const stopScan = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setIsScanning(false)
  }

  const tick = async () => {
    if (!videoRef.current || !detectorRef.current) {
      return
    }

    try {
      const barcodes = await detectorRef.current.detect(videoRef.current)
      if (barcodes.length > 0 && barcodes[0].rawValue) {
        const valorLido = barcodes[0].rawValue
        onDetected(valorLido)
        setStatus(`Codigo lido: ${valorLido}`)
        stopScan()
        return
      }
    } catch {
      setStatus('Nao foi possivel ler o codigo. Tente novamente.')
      stopScan()
      return
    }

    rafRef.current = requestAnimationFrame(tick)
  }

  const startScan = async () => {
    if (!hasCameraSupport) {
      setStatus('Este navegador nao permite acesso a camera.')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      })

      streamRef.current = stream

      if (hasNativeBarcodeDetector && !detectorRef.current) {
        detectorRef.current = new window.BarcodeDetector({ formats: FORMATS })
      }

      const video = videoRef.current
      if (!video) {
        return
      }

      video.srcObject = stream
      await video.play()
      setIsScanning(true)

      if (hasNativeBarcodeDetector) {
        setStatus('Aponte a camera para o codigo de barras.')
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setStatus(
          'Camera ativa, mas leitura automatica nao suportada neste navegador. Digite o codigo manualmente.'
        )
      }
    } catch {
      setStatus(
        'Nao foi possivel acessar a camera. Use https ou localhost e verifique a permissao da camera.'
      )
      stopScan()
    }
  }

  useEffect(() => {
    return () => {
      stopScan()
    }
  }, [])

  return (
    <section className="scanner-box">
      <div className="scanner-acoes">
        {!isScanning && (
          <button type="button" className="botao-scanner" onClick={startScan}>
            Ler codigo pela camera
          </button>
        )}
        {isScanning && (
          <button type="button" className="botao-secundario" onClick={stopScan}>
            Parar leitura
          </button>
        )}
      </div>

      {isScanning && <video ref={videoRef} className="scanner-video" muted playsInline />}
      {status && <p className="scanner-status">{status}</p>}
      {!hasNativeBarcodeDetector && (
        <p className="scanner-status erro">
          Leitura automatica indisponivel neste navegador sem biblioteca extra.
        </p>
      )}
    </section>
  )
}
