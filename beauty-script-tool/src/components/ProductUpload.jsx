import React, { useRef } from 'react'
import { parseFile, getFileError, countWords } from '../utils/fileParser'

export default function ProductUpload({ productDoc, onDocLoaded, onDocCleared }) {
  const fileInputRef = useRef()

  async function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    e.target.value = ''

    try {
      const content = await parseFile(file)
      const wordCount = countWords(content)
      onDocLoaded({ name: file.name, wordCount, content })
    } catch (err) {
      alert(getFileError(err))
    }
  }

  return (
    <div className="card">
      <div className="step-header">
        <div className="step-number">1</div>
        <span className="step-title">上传产品文档</span>
      </div>

      {productDoc ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{
            flex: 1,
            padding: '10px 14px',
            background: '#e8f5e9',
            borderRadius: 8,
            fontSize: 14,
            color: '#2e7d32',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span>📄</span>
            <span>
              已加载：<strong>{productDoc.name}</strong>（共 {productDoc.wordCount.toLocaleString()} 字）
            </span>
          </div>
          <button className="btn btn-ghost" onClick={onDocCleared}>
            清除文档
          </button>
        </div>
      ) : (
        <div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 14, fontSize: 13 }}>
            上传本次推广产品的介绍文档，AI 将基于此文档改写视频文案
          </p>
          <div
            style={{
              border: '2px dashed var(--border)',
              borderRadius: 10,
              padding: '28px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'border-color 0.2s, background 0.2s'
            }}
            onClick={() => fileInputRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              const file = e.dataTransfer.files[0]
              if (file) {
                const fakeEvent = { target: { files: [file], value: '' } }
                handleFileChange(fakeEvent)
              }
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>📁</div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>点击选择或拖拽文件至此处</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              支持 .txt · .pdf · .docx，文件大小不超过 1MB
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,.docx"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  )
}
