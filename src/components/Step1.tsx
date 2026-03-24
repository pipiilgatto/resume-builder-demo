import { useResumeStore } from '../store'

const templates = [
  { id: 'modern', name: 'Modern', description: 'Clean, minimalist design', color: 'bg-blue-100' },
  { id: 'classic', name: 'Classic', description: 'Traditional professional layout', color: 'bg-green-100' },
  { id: 'creative', name: 'Creative', description: 'For design & marketing roles', color: 'bg-purple-100' },
  { id: 'executive', name: 'Executive', description: 'Bold, leadership-focused', color: 'bg-amber-100' },
  { id: 'compact', name: 'Compact', description: 'One-page dense layout', color: 'bg-gray-100' },
]

export default function Step1() {
  const { selectedTemplate, setSelectedTemplate, setCurrentStep } = useResumeStore()
  
  const handleNext = () => {
    if (!selectedTemplate) {
      alert('Please select a template first')
      return
    }
    setCurrentStep(2)
  }
  
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Choose a Template</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${selectedTemplate === template.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <div className={`h-40 rounded-lg mb-4 ${template.color} flex items-center justify-center`}>
              <div className="text-4xl">📄</div>
            </div>
            <h3 className="text-lg font-medium text-gray-800">{template.name}</h3>
            <p className="text-gray-600 mt-1">{template.description}</p>
            <div className="mt-4 text-sm text-gray-500">
              • Adjustable sections<br/>
              • Custom fonts & margins<br/>
              • Bilingual support
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center pt-6 border-t">
        <div>
          <p className="text-gray-700">
            Selected: <span className="font-semibold">{selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.name : 'None'}</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">You can customize fonts, margins, and section order after selection.</p>
        </div>
        
        <div className="flex gap-4">
          <button
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            onClick={() => {/* upload resume */}}
          >
            Upload Resume (PDF/Word)
          </button>
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleNext}
            disabled={!selectedTemplate}
          >
            Next: Fill & Translate →
          </button>
        </div>
      </div>
    </div>
  )
}