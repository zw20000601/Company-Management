import { scriptToMarkdown } from './ScriptView'

/**
 * Export all scripts as a .txt file
 */
export function exportAllScripts(scripts) {
  const doneScripts = scripts.filter(s => s.scriptStatus === 'done')
  if (doneScripts.length === 0) {
    alert('暂无已生成的脚本可导出')
    return
  }

  const separator = '\n\n' + '='.repeat(60) + '\n\n'
  const content = doneScripts.map(s => scriptToMarkdown(s)).join(separator)

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `美妆视频脚本_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
