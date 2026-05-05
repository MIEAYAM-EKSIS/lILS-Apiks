'use client'

import { useState } from 'react'
import { ConverterForm } from './components/ConverterForm'
import { PreviewCard } from './components/PreviewCard'
import { Sparkles, Shield, Zap, Globe } from 'lucide-react'

export default function Home() {
  const [appIcon, setAppIcon] = useState<string | null>(null)
  const [appName, setAppName] = useState('')
  const [appUrl, setAppUrl] = useState('')

  const features = [
    { icon: Zap, title: 'Super Cepat', desc: 'Konversi kurang dari 1 menit' },
    { icon: Shield, title: '100% Aman', desc: 'Tanpa data tersimpan' },
    { icon: Globe, title: 'Support All URL', desc: 'Bisa semua jenis website' },
    { icon: Sparkles, title: 'Custom Asset', desc: 'Logo + Splash Screen' },
  ]

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/50 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm">Powered by Nebolusverse</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Web to APK
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Ubah website lo jadi aplikasi Android keren dalam hitungan detik. 
            Custom logo, nama, siap install!
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {features.map((feat, i) => (
            <div key={i} className="glass-card p-4 text-center">
              <feat.icon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white">{feat.title}</h3>
              <p className="text-xs text-gray-400">{feat.desc}</p>
            </div>
          ))}
        </div>

        {/* Main Form */}
        <div className="glass-card p-6 md:p-8">
          <ConverterForm
            onIconChange={setAppIcon}
            onNameChange={setAppName}
            onUrlChange={setAppUrl}
          />
          
          {appName && appUrl && (
            <div className="mt-8">
              <PreviewCard appName={appName} appUrl={appUrl} appIcon={appIcon} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© 2025 Nebolusverse - Unlimited APK Generation</p>
        </div>
      </div>
    </main>
  )
}