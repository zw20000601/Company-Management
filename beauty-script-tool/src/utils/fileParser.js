/**
 * File parser for .txt / .pdf / .docx
 * Returns plain text content
 */

const MAX_SIZE = 1024 * 1024 // 1MB

export async function parseFile(file) {
  if (file.size > MAX_SIZE) {
    throw new Error('FILE_TOO_LARGE')
  }

  const ext = file.name.split('.').pop().toLowerCase()

  if (ext === 'txt') {
    return parseTxt(file)
  } else if (ext === 'pdf') {
    return parsePdf(file)
  } else if (ext === 'docx') {
    return parseDocx(file)
  } else {
    throw new Error('UNSUPPORTED_FORMAT')
  }
}

async function parseTxt(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = () => reject(new Error('READ_ERROR'))
    reader.readAsText(file, 'UTF-8')
  })
}

async function parsePdf(file) {
  const arrayBuffer = await file.arrayBuffer()
  // Dynamically import pdfjs-dist to avoid SSR issues
  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url
  ).toString()

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  let text = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    text += content.items.map((item) => item.str).join(' ') + '\n'
  }
  return text.trim()
}

async function parseDocx(file) {
  const arrayBuffer = await file.arrayBuffer()
  const mammoth = await import('mammoth')
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value.trim()
}

export function getFileError(err) {
  if (err.message === 'FILE_TOO_LARGE') return '文件过大，请精简后重试（限制 1MB）'
  if (err.message === 'UNSUPPORTED_FORMAT') return '请上传 .txt .pdf 或 .docx 格式的文件'
  return '文件读取失败，请重试'
}

export function countWords(text) {
  // Count Chinese characters + space-separated words
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  const otherWords = text.replace(/[\u4e00-\u9fa5]/g, '').trim().split(/\s+/).filter(Boolean).length
  return chineseChars + otherWords
}
