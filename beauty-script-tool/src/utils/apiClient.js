/**
 * AI API Client
 * Supports: Claude, OpenAI/GPT-4, DeepSeek, Gemini
 * API Keys are read from localStorage only — never hardcoded.
 */

const STORAGE_KEYS = {
  claude: 'beauty-tool-claude-api-key',
  openai: 'beauty-tool-openai-api-key',
  deepseek: 'beauty-tool-deepseek-api-key',
  gemini: 'beauty-tool-gemini-api-key',
  model: 'beauty-tool-selected-model'
}

export function getApiKey(provider) {
  return localStorage.getItem(STORAGE_KEYS[provider]) || ''
}

export function saveApiKey(provider, key) {
  localStorage.setItem(STORAGE_KEYS[provider], key)
}

export function clearApiKey(provider) {
  localStorage.removeItem(STORAGE_KEYS[provider])
}

export function getSelectedModel() {
  return localStorage.getItem(STORAGE_KEYS.model) || 'claude'
}

export function saveSelectedModel(model) {
  localStorage.setItem(STORAGE_KEYS.model, model)
}

export function hasAnyApiKey() {
  return ['claude', 'openai', 'deepseek', 'gemini'].some(p => !!getApiKey(p))
}

/**
 * Send a chat message to the selected AI model.
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @returns {Promise<string>} assistant reply
 */
export async function callAI(systemPrompt, userPrompt) {
  const model = getSelectedModel()
  const apiKey = getApiKey(model)

  if (!apiKey) {
    throw new Error('NO_API_KEY')
  }

  switch (model) {
    case 'claude':
      return callClaude(apiKey, systemPrompt, userPrompt)
    case 'openai':
      return callOpenAI(apiKey, systemPrompt, userPrompt)
    case 'deepseek':
      return callDeepSeek(apiKey, systemPrompt, userPrompt)
    case 'gemini':
      return callGemini(apiKey, systemPrompt, userPrompt)
    default:
      throw new Error('UNKNOWN_MODEL')
  }
}

async function callClaude(apiKey, systemPrompt, userPrompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    })
  })
  return handleResponse(res, async (data) => data.content[0].text)
}

async function callOpenAI(apiKey, systemPrompt, userPrompt) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    })
  })
  return handleResponse(res, async (data) => data.choices[0].message.content)
}

async function callDeepSeek(apiKey, systemPrompt, userPrompt) {
  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    })
  })
  return handleResponse(res, async (data) => data.choices[0].message.content)
}

async function callGemini(apiKey, systemPrompt, userPrompt) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${systemPrompt}\n\n${userPrompt}` }
            ]
          }
        ]
      })
    }
  )
  return handleResponse(res, async (data) =>
    data.candidates[0].content.parts[0].text
  )
}

async function handleResponse(res, extractor) {
  if (res.status === 401) throw new Error('INVALID_KEY')
  if (res.status === 429) throw new Error('RATE_LIMIT')
  if (!res.ok) throw new Error(`HTTP_${res.status}`)
  const data = await res.json()
  return extractor(data)
}

/**
 * Test API connection with a minimal request
 */
export async function testConnection(provider, apiKey) {
  const testPrompt = '请回复"ok"'
  try {
    let result
    switch (provider) {
      case 'claude':
        result = await callClaude(apiKey, '你是助手', testPrompt)
        break
      case 'openai':
        result = await callOpenAI(apiKey, '你是助手', testPrompt)
        break
      case 'deepseek':
        result = await callDeepSeek(apiKey, '你是助手', testPrompt)
        break
      case 'gemini':
        result = await callGemini(apiKey, '你是助手', testPrompt)
        break
      default:
        throw new Error('UNKNOWN_MODEL')
    }
    return { success: true, message: '✅ 连接成功' }
  } catch (err) {
    if (err.message === 'INVALID_KEY') return { success: false, message: '❌ Key无效' }
    if (err.message === 'RATE_LIMIT') return { success: false, message: '❌ 额度不足或请求过频' }
    return { success: false, message: `❌ 连接失败：${err.message}` }
  }
}

export function getErrorMessage(err) {
  if (err.message === 'NO_API_KEY') return '请先在设置中填入 API Key'
  if (err.message === 'INVALID_KEY') return 'API Key 无效，请在设置中重新填入'
  if (err.message === 'RATE_LIMIT') return 'API 调用次数超限，请稍后重试或检查账户余额'
  return '网络请求失败，请检查网络连接后重试'
}
