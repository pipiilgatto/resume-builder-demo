import { useState } from 'react'
import { useResumeStore } from '../store'
import { callDeepSeek, createImprovementPrompt } from '../utils/deepseek'

export default function Step2() {
  const { jobDescription, setJobDescription, setCurrentStep, deepseekApiKey, setDeepseekApiKey } = useResumeStore()
  const [isChinese, setIsChinese] = useState(false)
  const [chatMessage, setChatMessage] = useState('')
  const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'ai', content: string}>>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return
    
    // Add user message
    const newHistory = [...chatHistory, { role: 'user', content: chatMessage }]
    setChatHistory(newHistory)
    setChatMessage('')
    
    if (deepseekApiKey) {
      setIsLoading(true)
      try {
        const prompt = createImprovementPrompt(
          '[Resume content would be here]', // In a real app, pass actual resume content
          jobDescription || 'No job description provided'
        )
        const aiResponse = await callDeepSeek(deepseekApiKey, prompt, 'You are a resume expert. Provide concise, actionable suggestions.')
        setChatHistory([...newHistory, { role: 'ai', content: aiResponse }])
      } catch (error: any) {
        setChatHistory([...newHistory, { 
          role: 'ai', 
          content: `Error calling DeepSeek API: ${error.message}. Using mock suggestion.` 
        }])
        // Fallback to mock after a delay
        setTimeout(() => {
          setChatHistory(prev => {
            // Replace the error message with mock
            const filtered = prev.filter(msg => !(msg.role === 'ai' && msg.content.includes('Error')))
            return [...filtered, {
              role: 'ai',
              content: 'I suggest emphasizing your Python experience in the Skills section and adding metrics to your project bullet points.'
            }]
          })
        }, 500)
      } finally {
        setIsLoading(false)
      }
    } else {
      // Mock AI response if no API key
      setTimeout(() => {
        setChatHistory([...newHistory, {
          role: 'ai',
          content: 'I suggest emphasizing your Python experience in the Skills section and adding metrics to your project bullet points. (Provide a DeepSeek API key for real AI suggestions)'
        }])
      }, 1000)
    }
  }
  
  const handleDeepSeekTranslate = async () => {
    if (!deepseekApiKey) {
      alert('Please enter your DeepSeek API key in settings first')
      return
    }
    // Mock translation toggle
    setIsChinese(!isChinese)
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Fill & Translate with AI</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-gray-600">DeepSeek API Key:</span>
            <input
              type="password"
              placeholder="sk-..."
              className="ml-2 px-3 py-1 border rounded"
              value={deepseekApiKey}
              onChange={(e) => setDeepseekApiKey(e.target.value)}
            />
          </div>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            onClick={() => setCurrentStep(1)}
          >
            ← Back
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => setCurrentStep(3)}
          >
            Next: Review →
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side: Job description & chat */}
        <div className="space-y-6">
          <div className="border rounded-xl p-6 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Job Description</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border rounded-lg text-sm">Paste Text</button>
                <button className="px-4 py-2 bg-white border rounded-lg text-sm">Upload Image</button>
                <button className="px-4 py-2 bg-white border rounded-lg text-sm">Enter URL</button>
              </div>
              <textarea
                className="w-full h-48 p-4 border rounded-lg"
                placeholder="Paste the job description here...\n\nExample:\n- 5+ years Python experience\n- Cloud infrastructure (AWS)\n- Team leadership skills"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <div className="text-sm text-gray-500">
                The AI will analyze this description and suggest resume improvements.
              </div>
            </div>
          </div>
          
          <div className="border rounded-xl p-6 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-800 mb-4">AI Suggestions</h3>
            <div className="h-64 overflow-y-auto mb-4 space-y-4">
              {chatHistory.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  Ask AI for suggestions like:<br/>
                  "Make this more technical"<br/>
                  "Add metrics to bullet points"<br/>
                  "Emphasize leadership experience"
                </div>
              ) : (
                chatHistory.map((msg, idx) => (
                  <div key={idx} className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-green-100 text-green-900'}`}>
                    <strong>{msg.role === 'user' ? 'You:' : 'AI:'}</strong> {msg.content}
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 p-3 border rounded-lg"
                placeholder="Type your instruction..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSendMessage}
                disabled={isLoading}
              >
                {isLoading ? 'Thinking...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Right side: Resume preview */}
        <div className="border rounded-xl p-6 bg-white">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-800">Resume Preview</h3>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Language:
                <button
                  className={`ml-2 px-4 py-1 rounded ${isChinese ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                  onClick={handleDeepSeekTranslate}
                >
                  {isChinese ? '中文' : 'English'}
                </button>
              </div>
              <button className="px-4 py-2 border rounded-lg text-sm">Edit Sections</button>
            </div>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 min-h-[500px]">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">📄</div>
              <h4 className="text-xl font-bold text-gray-800">John Doe</h4>
              <p className="text-gray-600">Senior Software Engineer</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h5 className="font-semibold text-gray-800 border-b pb-1">Experience</h5>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Led a team of 5 developers to build a cloud‑native microservices platform</li>
                  <li>Reduced API response time by 40% through optimization and caching</li>
                  <li>Implemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes</li>
                </ul>
              </div>
              
              <div>
                <h5 className="font-semibold text-gray-800 border-b pb-1">Skills</h5>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['Python', 'React', 'AWS', 'Docker', 'Kubernetes', 'TypeScript'].map(skill => (
                    <span key={skill} className="px-3 py-1 bg-gray-100 rounded-full text-sm">{skill}</span>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="font-semibold text-gray-800 border-b pb-1">Education</h5>
                <p className="mt-2">MSc Computer Science – Stanford University (2018)</p>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t text-sm text-gray-500 text-center">
              This is a preview. The actual resume will be generated from your data.
              {isChinese && <p className="mt-2">(中文翻译为示例，实际使用DeepSeek API进行专业翻译)</p>}
            </div>
          </div>
          
          <div className="mt-6 text-sm text-gray-600">
            <p>💡 <strong>AI Tip:</strong> Add metrics to your bullet points (e.g., "increased performance by 30%") to stand out.</p>
          </div>
        </div>
      </div>
    </div>
  )
}