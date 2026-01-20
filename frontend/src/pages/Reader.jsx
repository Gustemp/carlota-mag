import { useState, useRef, useEffect, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { Link, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, ZoomIn, ZoomOut, Maximize2, Download, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/api/client"
import { Document, Page, pdfjs } from "react-pdf"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

export default function Reader() {
  const [searchParams] = useSearchParams()
  const magazineId = searchParams.get("id")
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [pageHeight, setPageHeight] = useState(null)
  const [pageWidth, setPageWidth] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [scale, setScale] = useState(1)
  const containerRef = useRef(null)

  const { data: magazine, isLoading } = useQuery({
    queryKey: ['magazine', magazineId],
    queryFn: () => api.magazines.get(magazineId),
    enabled: !!magazineId,
  })

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
  }

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const headerHeight = 72
        const mobileFooterHeight = window.innerWidth < 640 ? 60 : 0
        const availableHeight = window.innerHeight - headerHeight - mobileFooterHeight - 40
        const availableWidth = window.innerWidth - 80 // padding + espaço para setas
        const mobile = window.innerWidth < 640
        
        setPageHeight(availableHeight)
        setPageWidth(availableWidth)
        setIsMobile(mobile)
      }
    }
    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  const goToPrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1))
  const goToNextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages || 1))
  
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 2.5))
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5))
  const handleResetZoom = () => setScale(1)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border border-black/20 rounded-full animate-spin border-t-black mx-auto mb-4" />
          <p className="text-neutral-400 text-sm tracking-wide">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!magazine) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-light text-black mb-4">Revista não encontrada</h2>
          <Link to="/">
            <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
              Voltar ao início
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-neutral-100 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 z-50 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link 
              to="/"
              className="flex items-center gap-2 text-neutral-500 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm tracking-wide hidden sm:inline">Voltar</span>
            </Link>
            <div className="h-6 w-px bg-neutral-200 hidden sm:block" />
            <div className="hidden sm:block">
              <p className="text-xs tracking-[0.2em] text-neutral-400 uppercase">
                {magazine.edition || "Edição"}
              </p>
              <h1 className="text-sm font-medium text-black tracking-wide">
                {magazine.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              className="w-9 h-9 text-neutral-500 hover:text-black disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs text-neutral-500 min-w-[60px] text-center">
              {pageNumber} / {numPages || "..."}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNextPage}
              disabled={pageNumber >= (numPages || 1)}
              className="w-9 h-9 text-neutral-500 hover:text-black disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <div className="h-6 w-px bg-neutral-200 mx-2" />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
              className="w-9 h-9 text-neutral-500 hover:text-black disabled:opacity-30"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-xs text-neutral-500 min-w-[50px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              disabled={scale >= 2.5}
              className="w-9 h-9 text-neutral-500 hover:text-black disabled:opacity-30"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleResetZoom}
              className="w-9 h-9 text-neutral-500 hover:text-black"
              title="Resetar zoom"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            <div className="h-6 w-px bg-neutral-200 mx-2" />
            {magazine.pdf_url && (
              <a 
                href={magazine.pdf_url} 
                target="_blank" 
                rel="noopener noreferrer"
                download
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-9 h-9 text-neutral-500 hover:text-black"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* PDF Viewer */}
      <main ref={containerRef} className={`flex-1 flex items-center justify-center p-4 relative ${isMobile ? 'overflow-hidden' : 'overflow-auto'}`}>
        {/* Seta Esquerda */}
        {pageNumber > 1 && (
          <button
            onClick={goToPrevPage}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-16 md:h-16 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition-all group"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:scale-110 transition-transform" />
          </button>
        )}

        {/* Seta Direita */}
        {pageNumber < (numPages || 1) && (
          <button
            onClick={goToNextPage}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-16 md:h-16 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition-all group"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:scale-110 transition-transform" />
          </button>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center"
          style={isMobile ? {} : { transform: `scale(${scale})`, transformOrigin: 'center center' }}
        >
          {magazine.pdf_url ? (
            <Document
              file={magazine.pdf_url}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="flex items-center justify-center">
                  <div className="w-10 h-10 border border-black/20 rounded-full animate-spin border-t-black" />
                </div>
              }
              error={
                <div className="text-center p-8 bg-white rounded shadow">
                  <p className="text-red-500">Erro ao carregar PDF</p>
                </div>
              }
            >
              <Page 
                pageNumber={pageNumber} 
                {...(isMobile ? { width: pageWidth } : { height: pageHeight })}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="shadow-2xl"
              />
            </Document>
          ) : (
            <div className="bg-white shadow-2xl p-20 text-center rounded">
              <p className="text-neutral-400">PDF não disponível</p>
            </div>
          )}
        </motion.div>
      </main>

      {/* Mobile Title Bar */}
      <div className="sm:hidden bg-white border-t border-neutral-100 px-4 py-3 flex-shrink-0">
        <p className="text-xs tracking-[0.2em] text-neutral-400 uppercase text-center">
          {magazine.edition || "Edição"}
        </p>
        <h1 className="text-sm font-medium text-black tracking-wide text-center">
          {magazine.title}
        </h1>
      </div>
    </div>
  )
}
