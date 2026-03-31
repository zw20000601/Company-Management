import React, { useState } from 'react'
import { parseLinks, MAX_LINKS } from '../utils/linkValidator'

const PLATFORM_LABELS = { douyin: '抖音', xhs: '小红书' }

export default function LinkInput({ productDoc, hasApiKey, onStartExtract }) {
  const [rawText, setRawText] = useState('')
  const validLinks = parseLinks(rawText)

  function handleStart() {
    if (!productDoc) {
      alert('请先上传产品文档')
      return
    }
    if (!hasApiKey) {
      alert('请先在右上角设置中填入 API Key')
      return
    }
    if (validLinks.length === 0) {
      return
    }
    if (validLinks.length > MAX_LINKS) {
      alert(`建议每次不超过 ${MAX_LINKS} 条，以保证处理稳定性`)
      return
    }
    onStartExtract(validLinks)
  }

  return (
    <div className="card">
      <div className="step-header">
        <div className="step-number">2</div>
        <span className="step-title">批量输入对标视频链接</span>
      </div>

      <p style={{ color: 'var(--text-secondary)', marginBottom: 12, fontSize: 13 }}>
        每行粘贴一条链接，支持抖音 / 小红书
      </p>

      <textarea
        className="input"
        style={{ minHeight: 140, resize: 'vertical', lineHeight: 1.8 }}
        placeholder={`https://v.douyin.com/xxxxx\nhttps://www.xiaohongshu.com/explore/xxxxx\n...`}
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ fontSize: 13 }}>
          {rawText.trim() === '' ? (
            <span style={{ color: 'var(--text-secondary)' }}>请粘贴视频链接</span>
          ) : validLinks.length === 0 ? (
            <span style={{ color: 'var(--error)' }}>未识别到有效链接（支持抖音/小红书）</span>
          ) : (
            <span style={{ color: 'var(--success)' }}>
              识别到 <strong>{validLinks.length}</strong> 条有效链接
              {validLinks.length > MAX_LINKS && (
                <span style={{ color: 'var(--error)', marginLeft: 6 }}>
                  （超出 {MAX_LINKS} 条限制）
                </span>
              )}
              &nbsp;— {
                Object.entries(
                  validLinks.reduce((acc, l) => {
                    acc[l.platform] = (acc[l.platform] || 0) + 1
                    return acc
                  }, {})
                ).map(([p, c]) => `${PLATFORM_LABELS[p]} ${c} 条`).join('，')
              }
            </span>
          )}
        </div>

        <button
          className="btn btn-primary"
          onClick={handleStart}
          disabled={validLinks.length === 0 || validLinks.length > MAX_LINKS}
        >
          开始提取 →
        </button>
      </div>
    </div>
  )
}
