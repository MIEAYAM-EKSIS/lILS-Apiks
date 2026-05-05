'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Link, Type, Sparkles, Loader2 } from 'lucide-react'

interface ConverterFormProps {
  onIconChange: (icon: string | null) => void
  onNameChange: (name: string) => void
  onUrlChange: (url: string) => void
}

export function ConverterForm({ onIconChange, onNameChange, onUrlChange }: ConverterFormProps) {
  const [iconPreview, setIconPreview] = useState<string | null>(null)
  const [appName, setAppName] = useState('')
  const [appUrl, setAppUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setIconPreview(result)
        onIconChange(result)
      }
      reader.readAsDataURL(file)
    }
  }, [onIconChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1,
    multiple: false
  })

  const removeIcon = () => {
    setIconPreview(null)
    onIconChange(null)
  }

  const handleGenerate = async () => {
    if (!appName || !appUrl) {
      alert('Isi nama apps dan URL dulu bos!')
      return
    }

    if (!appUrl.startsWith('http')) {
      alert('URL harus pake http:// atau https:// ya!')
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch('/api/generate-apk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appName,
          appUrl,
          iconBase64: iconPreview
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // Trigger download
        const link = document.createElement('a')
        link.href = data.downloadUrl
        link.download = `${appName.toLowerCase().replace(/\s/g, '_')}.apk`
        link.click()
      } else {
        alert('Gagal generate: ' + data.error)
      }
    } catch (error) {
      alert('Error: ' + error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Logo Upload */}
      <div>
        <label className="block text-white font-medium mb-2 flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Logo Aplikasi
        </label>
        {!iconPreview ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
              ${isDragActive ? 'border-purple-400 bg-purple-500/20' : 'border-gray-600 hover:border-purple-400'}`}
          >
            <input {...getInputProps()} />
            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-400">
              {isDragActive ? 'Drop gambar nya disini!' : 'Drag & drop logo disini, atau klik'}
            </p>
            <p className="text-gray-500 text-sm mt-1">PNG, JPG, WEBP (Max 2MB)</p>
          </div>
        ) : (
          <div className="relative inline-block">
            <img src={iconPreview} alt="Preview" className="w-24 h-24 rounded-2xl object-cover border-2 border-purple-400" />
            <button
              onClick={removeIcon}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        )}
      </div>

      {/* Nama Aplikasi */}
      <div>
        <label className="block text-white font-medium mb-2 flex items-center gap-2">
          <Type className="w-4 h-4" />
          Nama Aplikasi
        </label>
        <input
          type="text"
          value={appName}
          onChange={(e) => {
            setAppName(e.target.value)
            onNameChange(e.target.value)
          }}
          placeholder="Contoh: Nebolus Browser"
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition"
        />
      </div>

      {/* URL Website */}
      <div>
        <label className="block text-white font-medium mb-2 flex items-center gap-2">
          <Link className="w-4 h-4" />
          URL Website
        </label>
        <input
          type="url"
          value={appUrl}
          onChange={(e) => {
            setAppUrl(e.target.value)
            onUrlChange(e.target.value)
          }}
          placeholder="https://website-anda.com"
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !appName || !appUrl}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating APK...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate APK Sekarang!
          </>
        )}
      </button>
    </div>
  )
}