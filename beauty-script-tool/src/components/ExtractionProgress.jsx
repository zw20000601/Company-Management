import React, { useState, useEffect } from 'react'
import { extractVideoScript } from '../utils/videoExtract'

const STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  FAILED: 'failed',
  MANUAL: 'manual'
}

const StatusBadge = ({ status }) => {
  const map = {
    [STATUS.PENDING]: { cls: 'badge-pending', label: '等待中' },
    [STATUS.PROCESSING]: { cls: 'badge-processing', label: '提取中 ⏳' },
    [STATUS.SUCCESS]: { cls: 'badge-success', label: '提取成功 ✅' },
    [STATUS.FAILED]: { cls: 'badge-error', label: '提取失败 ❌' },
    [STATUS.MANUAL]: { cls: 'badge-manual', label: '手动输入 ✏️' }
  }
  const { cls, label } = map[status] || map[STATUS.PENDING]
  return <span className={`badge ${cls}`}>{label}</span>
}

export default function ExtractionProgress({ links, onComplete }) {
  const [items, setItems] = useState(() =>
    links.map((l, i) => ({
      ...l,
      id: i,
      status: STATUS.PENDING,
      rawScript: '',
      failReason: '',
      manualInput: ''
    }))
  )
  const [manualEditing, setManualEditing] = useState({})

  useEffect(() => {
    runExtraction()
  }, [])

  async function runExtraction() {
    for (let i = 0; i < items.length; i++) {
      setItems(prev => prev.map((item, idx) =>
        idx === i ? { ...item, status: STATUS.PROCESSING } : item
      ))

      const result = await extractVideoScript(items[i].url)

      setItems(prev => prev.map((item, idx) => {
        if (idx !== i) return item
        if (result.success) {
          return { ...item, status: STATUS.SUCCESS, rawScript: result.text }
        } else {
          return { ...item, status: STATUS.FAILED, failReason: result.reason }
        }
      }))
    }
  }

  function handleManualSave(id) {
    const text = manualEditing[id] || ''
    if (!text.trim()) return
    setItems(prev => prev.map(item =>
      item.id === id
        ? { ...item, status: STATUS.MANUAL, rawScript: text.trim() }
        : item
    ))
    setManualEditing(prev => { const n = { ...prev }; delete n[id]; return n })
  }

  const done = items.filter(i =>
    i.status === STATUS.SUCCESS || i.status === STATUS.MANUAL
  ).length
  const total = items.length
  const allReady = items.every(i =>
    i.status === STATUS.SUCCESS || i.status === STATUS.MANUAL || i.status === STATUS.FAILED
  )
  const hasReady = done > 0

  function handleGoToReview() {
    const readyItems = items.filter(i =>
      i.status === STATUS.SUCCESS || i.status === STATUS.MANUAL
    )
    onComplete(readyItems)
  }

  return (
    <div>
      {/* Overall progress */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontWeight: 600 }}>批量文案提取</span>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {done} / {total} 成功
          </span>
        </div>
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${total ? (done / total) * 100 : 0}%` }}
          />
        </div>
        {allReady && hasReady && (
          <div style={{ marginTop: 14, textAlign: 'right' }}>
            <button className="btn btn-primary" onClick={handleGoToReview}>
              进入审核改写 →
            </button>
          </div>
        )}
      </div>

      {/* Per-item list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((item) => (
          <div key={item.id} className="card" style={{ padding: '14px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4, wordBreak: 'break-all' }}>
                  {item.url}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <StatusBadge status={item.status} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    {item.platform === 'douyin' ? '抖音' : '小红书'}
                  </span>
                </div>
              </div>
            </div>

            {item.status === STATUS.SUCCESS && item.rawScript && (
              <div style={{
                marginTop: 10,
                padding: '8px 12px',
                background: 'var(--bg)',
                borderRadius: 6,
                fontSize: 13,
                color: 'var(--text)',
                maxHeight: 80,
                overflowY: 'auto'
              }}>
                {item.rawScript}
              </div>
            )}

            {item.status === STATUS.FAILED && (
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 13, color: 'var(--error)', marginBottom: 8 }}>
                  {item.failReason}
                </div>
                {manualEditing[item.id] !== undefined ? (
                  <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                    <textarea
                      className="input"
                      style={{ minHeight: 80, resize: 'vertical', fontSize: 13 }}
                      placeholder="请粘贴该视频的文案内容..."
                      value={manualEditing[item.id]}
                      onChange={(e) => setManualEditing(prev => ({ ...prev, [item.id]: e.target.value }))}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={() => handleManualSave(item.id)}>
                        确认保存
                      </button>
                      <button className="btn btn-ghost" style={{ fontSize: 13 }}
                        onClick={() => setManualEditing(prev => { const n = { ...prev }; delete n[item.id]; return n })}>
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="btn btn-secondary"
                    style={{ fontSize: 13 }}
                    onClick={() => setManualEditing(prev => ({ ...prev, [item.id]: '' }))}
                  >
                    ✏️ 手动输入文案
                  </button>
                )}
              </div>
            )}

            {item.status === STATUS.MANUAL && (
              <div style={{
                marginTop: 10,
                padding: '8px 12px',
                background: '#f3e5f5',
                borderRadius: 6,
                fontSize: 13,
                color: '#4a148c',
                maxHeight: 80,
                overflowY: 'auto'
              }}>
                {item.rawScript}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
