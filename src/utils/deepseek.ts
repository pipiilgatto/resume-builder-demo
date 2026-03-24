// DeepSeek API integration
// User provides their own API key

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

export async function callDeepSeek(apiKey: string, prompt: string, systemPrompt?: string) {
  if (!apiKey) {
    throw new Error('DeepSeek API key not provided')
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  })

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ''
}

// Translation prompt for EN↔ZH
export function createTranslationPrompt(text: string, targetLang: 'zh' | 'en'): string {
  const direction = targetLang === 'zh' ? 'English to Chinese' : 'Chinese to English'
  return `Translate the following resume content professionally from ${direction}. Keep formatting, line breaks, and professional tone.\n\n${text}`
}

// Resume improvement prompt
export function createImprovementPrompt(resumeText: string, jobDescription: string): string {
  return `You are a resume expert. Given the job description below, suggest specific improvements to the resume.

Job Description:
${jobDescription}

Resume:
${resumeText}

Suggest 3-4 concrete improvements such as:
1. Keyword additions from job description
2. Bullet point restructuring for impact
3. Metrics or quantifiable results to add
4. Section reordering if beneficial

Provide your suggestions in clear, actionable bullet points.`
}