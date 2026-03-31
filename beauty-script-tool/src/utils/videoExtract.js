/**
 * Video script extraction via third-party API
 * Primary: pearktrue.cn video parser
 * Fallback: manual input
 */

export async function extractVideoScript(url) {
  try {
    // Use pearktrue.cn free video parse API to get video info
    const apiUrl = `https://api.pearktrue.cn/api/videojx/?url=${encodeURIComponent(url)}`
    const res = await fetch(apiUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (!res.ok) throw new Error(`HTTP_${res.status}`)

    const data = await res.json()

    // API returns different structures; try to extract subtitle/description text
    if (data.code === 200 && data.data) {
      const d = data.data
      // Try subtitle first, then description/title
      const text = d.subtitle || d.desc || d.title || ''
      if (text && text.trim().length > 10) {
        return { success: true, text: text.trim() }
      }
    }

    throw new Error('NO_CONTENT')
  } catch (err) {
    const reason = err.message === 'NO_CONTENT'
      ? '未能获取视频文案，请手动输入'
      : '接口请求失败，请手动输入文案'
    return { success: false, reason }
  }
}
