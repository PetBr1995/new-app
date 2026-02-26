import { useEffect, useMemo, useRef, useState } from 'react'

const FORMATS = ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'itf', 'qr_code']

export function BarcodeScanner({ onDetected }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const rafRef = useRef(null)
  const detectorRef = useRef(null)

  const [isScanning, setIsScanning] = useState(false)
  const [status, setStatus] = useState('')

  const isSupported = useMemo(() => {
    return typeof window !== 'undefined' && 'BarcodeDetector' in window && navigator.mediaDevices
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
    if (!isSupported) {
      setStatus('Leitura por camera nao suportada neste navegador.')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      })

      streamRef.current = stream

      if (!detectorRef.current) {
        detectorRef.current = new window.BarcodeDetector({ formats: FORMATS })
      }

      const video = videoRef.current
      if (!video) {
        return
      }

      video.srcObject = stream
      await video.play()
      setStatus('Aponte a camera para o codigo de barras.')
      setIsScanning(true)
      rafRef.current = requestAnimationFrame(tick)
    } catch {
      setStatus('Nao foi possivel acessar a camera.')
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
      {!isSupported && <p className="scanner-status erro">Seu navegador nao suporta BarcodeDetector.</p>}
    </section>
  )
}
