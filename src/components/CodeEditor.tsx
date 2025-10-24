import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Download } from 'lucide-react'

interface CodeEditorProps {
  code: string
  onChange: (code: string) => void
  onRun?: () => void
  isRunning?: boolean
  language?: string
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  onRun,
  isRunning,
  language = 'csharp'
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([code], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `code.${language === 'csharp' ? 'cs' : language}`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-white font-bold">✍️ Code-Editor</h3>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded transition"
            title="Code kopieren"
          >
            <Copy size={14} />
            {copied ? 'Kopiert!' : 'Kopieren'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded transition"
            title="Code herunterladen"
          >
            <Download size={14} />
            Download
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 border border-purple-500/20 space-y-2">
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-80 bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm border border-gray-700 focus:border-purple-500 focus:outline-none resize-none"
          spellCheck="false"
        />

        {onRun && (
          <button
            onClick={onRun}
            disabled={isRunning}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105 active:scale-95"
          >
            {isRunning ? (
              <>
                <span className="inline-block animate-spin mr-2">⏳</span>
                Wird ausgeführt...
              </>
            ) : (
              <>▶️ Code ausführen</>
            )}
          </button>
        )}
      </div>
    </motion.div>
  )
}

