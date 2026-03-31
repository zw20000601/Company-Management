import React, { useState, useEffect } from 'react'
import {
  getApiKey, saveApiKey, clearApiKey,
  getSelectedModel, saveSelectedModel,
  testConnection
} from '../utils/apiClient'

const MODELS = [
  { value: 'claude', label: 'Claude (Anthropic)' },
  { value: 'openai', label: 'GPT-4 (OpenAI)' },
  { value: 'deepseek', label: 'DeepSeek' },
  { value: 'gemini', label: 'Gemini (Google)' }
]

export default function SettingsModal({ onClose }) {
  const [model, setModel] = useState(getSelectedModel())
  const [key, setKey] = useState('')
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState('')

  useEffect(() => {
    setKey(getApiKey(model))
    setTestResult('')
  }, [model])

  function handleSave() {
    saveSelectedModel(model)
    if (key.trim()) saveApiKey(model, key.trim())
    onClose()
  }

  function handleClear() {
    clearApiKey(model)
    setKey('')
    setTestResult('')
  }

  async function handleTest() {
    if (!key.trim()) {
      setTestResult('❌ 请先输入 API Key')
      return
    }
    setTesting(true)
    setTestResult('测试中...')
    const result = await testConnection(model, key.trim())
    setTestResult(result.message)
    setTesting(false)
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>⚙️ 设置中心</h2>
          <button
            className="btn btn-ghost"
            style={{ padding: '4px 10px', fontSize: 18 }}
            onClick={onClose}
          >×</button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>选择 AI 模型</label>
          <select
            className="input"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            {MODELS.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        {model === 'openai' && (
          <div style={{ marginBottom: 12, padding: '10px 14px', background: '#fff8e1', borderRadius: 8, fontSize: 13, color: '#e65100' }}>
            ⚠️ OpenAI 存在 CORS 限制，建议改用 DeepSeek 或 Claude 作为替代
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
            API Key
            {getApiKey(model) && <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--success)', fontWeight: 400 }}>（已保存）</span>}
          </label>
          <input
            type="password"
            className="input"
            placeholder={`请输入 ${MODELS.find(m => m.value === model)?.label} 的 API Key`}
            value={key}
            onChange={(e) => { setKey(e.target.value); setTestResult('') }}
          />
        </div>

        {testResult && (
          <div style={{
            marginBottom: 14,
            padding: '8px 12px',
            borderRadius: 8,
            background: testResult.includes('✅') ? '#e8f5e9' : '#ffebee',
            color: testResult.includes('✅') ? '#2e7d32' : '#c62828',
            fontSize: 13
          }}>
            {testResult}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={handleSave} style={{ flex: 1 }}>
            保存
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleTest}
            disabled={testing}
            style={{ flex: 1 }}
          >
            {testing ? '测试中...' : '测试连接'}
          </button>
          <button className="btn btn-ghost" onClick={handleClear}>
            清除 Key
          </button>
        </div>
      </div>
    </div>
  )
}
