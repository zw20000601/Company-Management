/**
 * Validate and parse video links for Douyin and Xiaohongshu
 */

const DOUYIN_PATTERN = /https?:\/\/(www\.)?(v\.douyin\.com|douyin\.com)\/[^\s]+/i
const XHS_PATTERN = /https?:\/\/(www\.)?(xiaohongshu\.com|xhslink\.com)\/[^\s]+/i

export const MAX_LINKS = 100

export function detectPlatform(url) {
  if (DOUYIN_PATTERN.test(url)) return 'douyin'
  if (XHS_PATTERN.test(url)) return 'xhs'
  return null
}

export function parseLinks(rawText) {
  const lines = rawText.split('\n')
  const valid = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    // Extract URL from line (handles lines with extra text)
    const urlMatch = trimmed.match(/https?:\/\/[^\s]+/)
    if (!urlMatch) continue

    const url = urlMatch[0]
    const platform = detectPlatform(url)
    if (!platform) continue

    valid.push({ url, platform })
  }

  // Deduplicate by URL
  const seen = new Set()
  return valid.filter(({ url }) => {
    if (seen.has(url)) return false
    seen.add(url)
    return true
  })
}
