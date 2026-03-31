import React, { useState, useEffect } from 'react'
import SettingsModal from './components/SettingsModal'
import ProductUpload from './components/ProductUpload'
import LinkInput from './components/LinkInput'
import ExtractionProgress from './components/ExtractionProgress'
import ReviewRewrite from './components/ReviewRewrite'
import ScriptView from './components/ScriptView'
import { exportAllScripts } from './components/ExportPanel'
import { hasAnyApiKey, getSelectedModel } from './utils/apiClient'

const STEPS = {
  PREPARE: 'prepare',
  EXTRACT: 'extract',
  REVIEW: 'review',
  SCRIPTS: 'scripts'
}

const MODEL_LABELS = {
  claude: 'Claude',
  openai: 'GPT-4',
  deepseek: 'DeepSeek',
  gemini: 'Gemini'
}

export default function App() {
  const [step, setStep] = useState(STEPS.PREPARE)
  const [showSettings, setShowSettings] = useState(false)
  const [showApiGuide, setShowApiGuide] = useState(false)
  const [productDoc, setProductDoc] = useState(null)
  const [extractLinks, setExtractLinks] = useState([])
  const [reviewItems, setReviewItems] = useState([])
  const [scriptItems, setScriptItems] = useState([])
  const [apiKeyExists, setApiKeyExists] = useState(hasAnyApiKey())

  useEffect(() => {
    if (!hasAnyApiKey()) {
      setShowApiGuide(true)
    }
  }, [])

  function refreshApiKey() {
    setApiKeyExists(hasAnyApiKey())
  }

  function handleStartExtract(links) {
    setExtractLinks(links)
    setStep(STEPS.EXTRACT)
  }

  function handleExtractionComplete(items) {
    setReviewItems(items)
    setStep(STEPS.REVIEW)
  }

  function handleConfirmedAll(confirmedItems) {
    setScriptItems(confirmedItems)
    setStep(STEPS.SCRIPTS)
  }

  const selectedModel = getSelectedModel()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #e91e8c 0%, #c2185b 100%)',
        color: '#fff',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 12px rgba(233,30,140,0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>💄</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>美妆视频脚本助手</div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>批量创作 · AI改写 · 分镜脚本</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {apiKeyExists && (
            <div style={{
              fontSize: 12,
              background: 'rgba(255,255,255,0.2)',
              padding: '3px 10px',
              borderRadius: 99
            }}>
              {MODEL_LABELS[selectedModel] || selectedModel}
            </div>
          )}
          <button
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              borderRadius: 8,
              padding: '6px 14px',
              cursor: 'pointer',
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
            onClick={() => { setShowSettings(true); setShowApiGuide(false) }}
          >
            ⚙️ 设置
          </button>
        </div>
      </header>

      {/* Step progress indicator */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid var(--border)',
        padding: '10px 24px',
        display: 'flex',
        gap: 4,
        alignItems: 'center',
        fontSize: 13
      }}>
        {[
          { key: STEPS.PREPARE, label: '准备工作' },
          { key: STEPS.EXTRACT, label: '文案提取' },
          { key: STEPS.REVIEW, label: '审核改写' },
          { key: STEPS.SCRIPTS, label: '脚本生成' }
        ].map((s, i, arr) => (
          <React.Fragment key={s.key}>
            <span style={{
              padding: '3px 12px',
              borderRadius: 99,
              background: step === s.key ? 'var(--primary)' : 'var(--border)',
              color: step === s.key ? '#fff' : 'var(--text-secondary)',
              fontWeight: step === s.key ? 600 : 400,
              fontSize: 12
            }}>
              {s.label}
            </span>
            {i < arr.length - 1 && (
              <span style={{ color: 'var(--border)', fontSize: 16 }}>›</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Main content */}
      <main style={{ flex: 1, padding: '24px', maxWidth: 960, width: '100%', margin: '0 auto' }}>

        {/* API Key guide overlay */}
        {showApiGuide && (
          <div className="modal-overlay" onClick={() => setShowApiGuide(false)}>
            <div className="modal-box" style={{ textAlign: 'center' }} onClick={e => e.stopPropagation()}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>⚙️</div>
              <h2 style={{ marginBottom: 10 }}>欢迎使用美妆视频脚本助手</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.7 }}>
                请先在右上角 <strong>⚙️ 设置</strong> 中填入 AI 模型的 API Key 才能使用本工具
              </p>
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => { setShowApiGuide(false); setShowSettings(true) }}
              >
                立即去设置
              </button>
            </div>
          </div>
        )}

        {/* Step: Prepare */}
        {step === STEPS.PREPARE && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <ProductUpload
              productDoc={productDoc}
              onDocLoaded={setProductDoc}
              onDocCleared={() => setProductDoc(null)}
            />
            <LinkInput
              productDoc={productDoc}
              hasApiKey={apiKeyExists}
              onStartExtract={handleStartExtract}
            />
          </div>
        )}

        {/* Step: Extract */}
        {step === STEPS.EXTRACT && (
          <div>
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                className="btn btn-ghost"
                style={{ fontSize: 13 }}
                onClick={() => setStep(STEPS.PREPARE)}
              >
                ← 返回
              </button>
              <span style={{ fontSize: 15, fontWeight: 600 }}>批量文案提取</span>
            </div>
            <ExtractionProgress
              links={extractLinks}
              onComplete={handleExtractionComplete}
            />
          </div>
        )}

        {/* Step: Review */}
        {step === STEPS.REVIEW && (
          <div>
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                className="btn btn-ghost"
                style={{ fontSize: 13 }}
                onClick={() => setStep(STEPS.EXTRACT)}
              >
                ← 返回
              </button>
            </div>
            <ReviewRewrite
              items={reviewItems}
              productDoc={productDoc}
              onConfirmedAll={handleConfirmedAll}
            />
          </div>
        )}

        {/* Step: Scripts */}
        {step === STEPS.SCRIPTS && (
          <div>
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                className="btn btn-ghost"
                style={{ fontSize: 13 }}
                onClick={() => setStep(STEPS.REVIEW)}
              >
                ← 返回审核
              </button>
            </div>
            <ScriptView
              confirmedItems={scriptItems}
              onExport={exportAllScripts}
            />
          </div>
        )}
      </main>

      {/* Settings modal */}
      {showSettings && (
        <SettingsModal
          onClose={() => { setShowSettings(false); refreshApiKey() }}
        />
      )}
    </div>
  )
}
