import React, { useState, useEffect } from 'react'
import { callAI, getErrorMessage } from '../utils/apiClient'

const SCRIPT_SYSTEM_PROMPT = `你是一名专业的短视频分镜脚本策划师，擅长为美妆/护肤类短视频设计详细拍摄脚本。`

function buildScriptPrompt(rewrittenScript) {
  return `请根据以下推广文案，生成一份详细的短视频分镜拍摄脚本。

## 推广文案
${rewrittenScript}

## 脚本要求
- 总时长控制在 30-60 秒
- 分镜数量 8-15 个
- 包含开头钩子（前3秒抓眼球）、产品展示、使用效果展示、结尾引导关注/购买
- 每个分镜包含：分镜编号、时长、景别、画面描述、旁白/口播文案、拍摄要点

## 输出格式
请严格按照以下格式输出，不要有任何其他内容：

视频标题建议：[标题]
预计总时长：[时长]秒

| 分镜编号 | 时长 | 景别 | 画面描述 | 旁白/口播文案 | 拍摄要点 |
|------|------|------|------|------|------|
| 01 | Xs | [景别] | [画面描述] | [旁白] | [拍摄要点] |
...以此类推`
}

function parseScriptOutput(text) {
  const titleMatch = text.match(/视频标题建议[：:]\s*(.+)/)
  const durationMatch = text.match(/预计总时长[：:]\s*(.+)/)

  const title = titleMatch ? titleMatch[1].trim() : ''
  const duration = durationMatch ? durationMatch[1].trim() : ''

  // Parse table rows
  const rows = []
  const tableRegex = /\|\s*(\d+)\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|/g
  let match
  while ((match = tableRegex.exec(text)) !== null) {
    rows.push({
      index: match[1].trim(),
      duration: match[2].trim(),
      shot: match[3].trim(),
      scene: match[4].trim(),
      narration: match[5].trim(),
      tips: match[6].trim()
    })
  }

  return { title, duration, rows, raw: text }
}

const ScriptTable = ({ script }) => {
  if (!script.rows || script.rows.length === 0) {
    return (
      <pre style={{ fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {script.raw}
      </pre>
    )
  }

  return (
    <div>
      {script.title && (
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontWeight: 600 }}>视频标题建议：</span>
          <span style={{ color: 'var(--primary)' }}>{script.title}</span>
        </div>
      )}
      {script.duration && (
        <div style={{ marginBottom: 14, fontSize: 13, color: 'var(--text-secondary)' }}>
          预计总时长：{script.duration}
        </div>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table className="script-table">
          <thead>
            <tr>
              <th>分镜</th>
              <th>时长</th>
              <th>景别</th>
              <th>画面描述</th>
              <th>旁白/口播</th>
              <th>拍摄要点</th>
            </tr>
          </thead>
          <tbody>
            {script.rows.map((row, i) => (
              <tr key={i}>
                <td style={{ textAlign: 'center', fontWeight: 600 }}>{row.index}</td>
                <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>{row.duration}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{row.shot}</td>
                <td>{row.scene}</td>
                <td style={{ color: 'var(--primary-dark)' }}>{row.narration}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{row.tips}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function ScriptView({ confirmedItems, onExport }) {
  const [scripts, setScripts] = useState(() =>
    confirmedItems.map((item, i) => ({
      ...item,
      scriptId: i,
      scriptStatus: 'generating',
      scriptData: null,
      scriptError: ''
    }))
  )
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    scripts.forEach((item) => {
      callAI(SCRIPT_SYSTEM_PROMPT, buildScriptPrompt(item.rewrittenScript))
        .then((result) => {
          const parsed = parseScriptOutput(result)
          setScripts(prev => prev.map(s =>
            s.scriptId === item.scriptId
              ? { ...s, scriptStatus: 'done', scriptData: parsed }
              : s
          ))
        })
        .catch((err) => {
          setScripts(prev => prev.map(s =>
            s.scriptId === item.scriptId
              ? { ...s, scriptStatus: 'error', scriptError: getErrorMessage(err) }
              : s
          ))
        })
    })
  }, [])

  const doneCount = scripts.filter(s => s.scriptStatus === 'done').length
  const active = scripts[activeIdx]

  return (
    <div>
      {/* Header */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <span style={{ fontWeight: 600, fontSize: 16 }}>分镜脚本</span>
            <span style={{ marginLeft: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
              已生成 {doneCount} / {scripts.length} 条
            </span>
          </div>
          <button className="btn btn-primary" onClick={() => onExport(scripts)}>
            导出全部脚本
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        {scripts.map((s, i) => (
          <button
            key={s.scriptId}
            className={`btn ${activeIdx === i ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: 13, padding: '6px 14px' }}
            onClick={() => setActiveIdx(i)}
          >
            脚本 {i + 1}
            {s.scriptStatus === 'generating' && ' ⏳'}
            {s.scriptStatus === 'done' && ' ✅'}
            {s.scriptStatus === 'error' && ' ❌'}
          </button>
        ))}
      </div>

      {/* Active script */}
      {active && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', wordBreak: 'break-all', flex: 1 }}>
              {active.url}
            </div>
            {active.scriptStatus === 'done' && (
              <button
                className="btn btn-secondary"
                style={{ fontSize: 13, flexShrink: 0 }}
                onClick={() => {
                  const md = scriptToMarkdown(active)
                  navigator.clipboard.writeText(md)
                    .then(() => alert('已复制到剪贴板'))
                }}
              >
                复制当前脚本
              </button>
            )}
          </div>

          {active.scriptStatus === 'generating' && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#1565c0' }}>
              脚本生成中，请稍候...
            </div>
          )}

          {active.scriptStatus === 'error' && (
            <div style={{ padding: '20px', background: '#ffebee', borderRadius: 8, color: 'var(--error)' }}>
              {active.scriptError}
            </div>
          )}

          {active.scriptStatus === 'done' && active.scriptData && (
            <ScriptTable script={active.scriptData} />
          )}
        </div>
      )}
    </div>
  )
}

export function scriptToMarkdown(script) {
  const s = script.scriptData
  if (!s) return ''

  let md = `# 脚本 - ${script.url}\n\n`
  md += `**改写文案：**\n${script.rewrittenScript}\n\n`

  if (s.title) md += `**视频标题建议：** ${s.title}\n`
  if (s.duration) md += `**预计总时长：** ${s.duration}\n\n`

  if (s.rows && s.rows.length > 0) {
    md += `| 分镜 | 时长 | 景别 | 画面描述 | 旁白/口播 | 拍摄要点 |\n`
    md += `|------|------|------|------|------|------|\n`
    s.rows.forEach(r => {
      md += `| ${r.index} | ${r.duration} | ${r.shot} | ${r.scene} | ${r.narration} | ${r.tips} |\n`
    })
  } else {
    md += s.raw
  }

  return md
}
