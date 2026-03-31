import React, { useState, useEffect } from 'react'
import { callAI, getErrorMessage } from '../utils/apiClient'

const STATUS = {
  REWRITING: 'rewriting',
  READY: 'ready',
  CONFIRMED: 'confirmed'
}

function buildSystemPrompt(productDoc) {
  return `你是一名专业的美妆/护肤品短视频文案策划师。

## 产品介绍
${productDoc.content}

## 改写规则
1. 深度融入产品核心卖点，突出产品的差异化优势
2. 语气活泼、真实、有亲和力，符合抖音/小红书平台调性
3. 保留原始视频的叙事结构和情感共鸣点
4. 加入产品相关的使用场景和效果描述
5. 结尾引导用户互动（点赞/关注/购买）
6. 输出纯文本，不要加任何标题或解释说明`
}

export default function ReviewRewrite({ items, productDoc, onConfirmedAll }) {
  const [entries, setEntries] = useState(() =>
    items.map((item, i) => ({
      ...item,
      id: i,
      status: STATUS.REWRITING,
      rewrittenScript: '',
      error: ''
    }))
  )

  useEffect(() => {
    const systemPrompt = buildSystemPrompt(productDoc)
    // Concurrently rewrite all items
    entries.forEach((entry) => {
      callAI(systemPrompt, `请将以下视频文案改写为推广文案：\n\n${entry.rawScript}`)
        .then((result) => {
          setEntries(prev => prev.map(e =>
            e.id === entry.id
              ? { ...e, status: STATUS.READY, rewrittenScript: result }
              : e
          ))
        })
        .catch((err) => {
          setEntries(prev => prev.map(e =>
            e.id === entry.id
              ? { ...e, status: STATUS.READY, error: getErrorMessage(err) }
              : e
          ))
        })
    })
  }, [])

  function handleConfirm(id) {
    setEntries(prev => prev.map(e =>
      e.id === id ? { ...e, status: STATUS.CONFIRMED } : e
    ))
  }

  function handleConfirmAll() {
    setEntries(prev => prev.map(e =>
      e.status === STATUS.READY ? { ...e, status: STATUS.CONFIRMED } : e
    ))
  }

  function handleEditRewrite(id, value) {
    setEntries(prev => prev.map(e =>
      e.id === id ? { ...e, rewrittenScript: value } : e
    ))
  }

  const confirmedCount = entries.filter(e => e.status === STATUS.CONFIRMED).length
  const readyCount = entries.filter(e => e.status === STATUS.READY).length

  function handleGoToScripts() {
    const confirmed = entries.filter(e => e.status === STATUS.CONFIRMED)
    onConfirmedAll(confirmed)
  }

  return (
    <div>
      {/* Top action bar */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <span style={{ fontWeight: 600, fontSize: 16 }}>审核 & AI 改写</span>
            <span style={{ marginLeft: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
              已确认 {confirmedCount} / {entries.length} 条
            </span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {readyCount > 0 && (
              <button className="btn btn-secondary" onClick={handleConfirmAll}>
                全部确认并生成脚本
              </button>
            )}
            {confirmedCount > 0 && (
              <button className="btn btn-primary" onClick={handleGoToScripts}>
                查看脚本 →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Entry list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {entries.map((entry) => (
          <div key={entry.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', wordBreak: 'break-all', flex: 1, marginRight: 12 }}>
                {entry.url}
              </div>
              <span className={`badge ${
                entry.status === STATUS.REWRITING ? 'badge-processing' :
                entry.status === STATUS.CONFIRMED ? 'badge-success' : 'badge-pending'
              }`}>
                {entry.status === STATUS.REWRITING ? '改写中 ⏳' :
                 entry.status === STATUS.CONFIRMED ? '已确认 ✅' : '待确认'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {/* Left: original */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  原始文案
                </div>
                <div style={{
                  padding: '10px 12px',
                  background: 'var(--bg)',
                  borderRadius: 8,
                  fontSize: 13,
                  lineHeight: 1.7,
                  minHeight: 100,
                  maxHeight: 200,
                  overflowY: 'auto',
                  border: '1px solid var(--border)'
                }}>
                  {entry.rawScript}
                </div>
              </div>

              {/* Right: rewritten */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)', marginBottom: 6 }}>
                  AI 改写结果（可编辑）
                </div>
                {entry.status === STATUS.REWRITING ? (
                  <div style={{
                    padding: '10px 12px',
                    background: '#e3f2fd',
                    borderRadius: 8,
                    fontSize: 13,
                    color: '#1565c0',
                    minHeight: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    AI 改写中，请稍候...
                  </div>
                ) : entry.error ? (
                  <div style={{
                    padding: '10px 12px',
                    background: '#ffebee',
                    borderRadius: 8,
                    fontSize: 13,
                    color: 'var(--error)',
                    minHeight: 100
                  }}>
                    {entry.error}
                  </div>
                ) : (
                  <textarea
                    className="input"
                    style={{
                      minHeight: 100,
                      maxHeight: 200,
                      resize: 'vertical',
                      fontSize: 13,
                      lineHeight: 1.7,
                      background: entry.status === STATUS.CONFIRMED ? '#e8f5e9' : undefined
                    }}
                    value={entry.rewrittenScript}
                    onChange={(e) => handleEditRewrite(entry.id, e.target.value)}
                    disabled={entry.status === STATUS.CONFIRMED}
                  />
                )}
              </div>
            </div>

            {entry.status === STATUS.READY && !entry.error && (
              <div style={{ marginTop: 12, textAlign: 'right' }}>
                <button
                  className="btn btn-primary"
                  style={{ fontSize: 13 }}
                  onClick={() => handleConfirm(entry.id)}
                >
                  ✅ 确认，生成脚本
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
