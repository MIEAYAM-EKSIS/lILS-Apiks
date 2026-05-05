'use client'

import { Smartphone, Wifi, Battery, Signal } from 'lucide-react'

interface PreviewCardProps {
  appName: string
  appUrl: string
  appIcon: string | null
}

export function PreviewCard({ appName, appUrl, appIcon }: PreviewCardProps) {
  return (
    <div className="relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-lg opacity-50"></div>
      <div className="relative bg-black rounded-3xl p-3 shadow-2xl">
        {/* Mock Phone Frame */}
        <div className="bg-gray-900 rounded-2xl overflow-hidden">
          {/* Status Bar */}
          <div className="bg-black/50 px-4 py-2 flex justify-between text-xs text-white">
            <span>9:41</span>
            <div className="flex gap-1">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3 h-3" />
            </div>
          </div>
          
          {/* App Preview Header */}
          <div className="p-4 border-b border-gray-800 flex items-center gap-3">
            {appIcon ? (
              <img src={appIcon} alt={appName} className="w-10 h-10 rounded-xl object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
            )}
            <div>
              <h3 className="text-white font-semibold">{appName || 'Nama Apps'}</h3>
              <p className="text-gray-400 text-xs">{appUrl ? new URL(appUrl).hostname : 'website.com'}</p>
            </div>
          </div>
          
          {/* Webview Mock */}
          <div className="h-96 bg-gray-800 flex items-center justify-center">
            <div className="text-center">
              <Smartphone className="w-12 h-12 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Webview akan menampilkan:</p>
              <p className="text-purple-400 text-sm font-mono mt-1">{appUrl || 'https://website.com'}</p>
            </div>
          </div>
        </div>
        
        {/* Home Indicator */}
        <div className="flex justify-center py-2">
          <div className="w-32 h-1 bg-gray-600 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}