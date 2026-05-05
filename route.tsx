import { NextRequest, NextResponse } from 'next/server'
import { generateAPK } from '@/lib/apk-generator'
import { writeFile, unlink } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const { appName, appUrl, iconBase64 } = await req.json()

    if (!appName || !appUrl) {
      return NextResponse.json({ success: false, error: 'Nama apps dan URL wajib diisi' }, { status: 400 })
    }

    // Validate URL
    try {
      new URL(appUrl)
    } catch {
      return NextResponse.json({ success: false, error: 'URL tidak valid' }, { status: 400 })
    }

    // Generate APK
    const apkBuffer = await generateAPK({
      appName,
      appUrl,
      iconBase64: iconBase64 || null
    })

    // Save temporary file
    const tempPath = path.join('/tmp', `${Date.now()}.apk`)
    await writeFile(tempPath, apkBuffer)

    // Return file URL (in production, upload to storage)
    const fileBase64 = apkBuffer.toString('base64')

    // Clean up
    await unlink(tempPath).catch(() => {})

    return NextResponse.json({
      success: true,
      downloadUrl: `data:application/vnd.android.package-archive;base64,${fileBase64}`
    })

  } catch (error: any) {
    console.error('APK generation error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}