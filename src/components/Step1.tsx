import { useState } from 'react'
import { useResumeStore } from '../store'
import { parseResumeFile, structureResumeText } from '../utils/fileParser'

const templates = [
  { id: 'modern', name: 'Modern', description: 'Clean, minimalist design', color: 'bg-blue-100', accent: 'blue' },
  { id: 'classic', name: 'Classic', description: 'Traditional professional layout', color: 'bg-green-100', accent: 'green' },
  { id: 'creative', name: 'Creative', description: 'For design & marketing roles', color: 'bg-purple-100', accent: 'purple' },
  { id: 'executive', name: 'Executive', description: 'Bold, leadership-focused', color: 'bg-amber-100', accent: 'amber' },
  { id: 'compact', name: 'Compact', description: 'One-page dense layout', color: 'bg-gray-100', accent: 'gray' },
]

const fontOptions = [
  { id: 'Helvetica', name: 'Helvetica (Sans-serif)' },
  { id: 'Times-Roman', name: 'Times New Roman (Serif)' },
  { id: 'Courier', name: 'Courier (Monospace)' },
]

const sizeOptions = [
  { id: 'small', name: 'Small', desc: '10pt' },
  { id: 'medium', name: 'Medium', desc: '11pt' },
  { id: 'large', name: 'Large', desc: '12pt' },
]

const marginOptions = [
  { id: 'narrow', name: 'Narrow', desc: '0.5 inch' },
  { id: 'normal', name: 'Normal', desc: '1 inch' },
  { id: 'wide', name: 'Wide', desc: '1.5 inch' },
]

const colorOptions = [
  { id: 'blue', name: 'Blue', hex: '#3B82F6' },
  { id: 'green', name: 'Green', hex: '#10B981' },
  { id: 'purple', name: 'Purple', hex: '#8B5CF6' },
  { id: 'amber', name: 'Amber', hex: '#F59E0B' },
  { id: 'red', name: 'Red', hex: '#EF4444' },
  { id: 'gray', name: 'Gray', hex: '#6B7280' },
]

export default function Step1() {
  const { 
    selectedTemplate, setSelectedTemplate, 
    setCurrentStep, setResumeEn,
    fontFamily, setFontFamily,
    fontSize, setFontSize,
    marginSize, setMarginSize,
    colorScheme, setColorScheme
  } = useResumeStore()
  
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [manualText, setManualText] = useState('')
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    setUploadError(null)
    setUploadSuccess(false)
    setIsUploading(true)
    setShowManualEntry(false) // Hide manual entry when uploading new file
    
    try {
      const { text } = await parseResumeFile(file)
      const structured = structureResumeText(text)
      setResumeEn(structured)
      
      if (!selectedTemplate) {
        setSelectedTemplate('modern')
      }
      
      setUploadSuccess(true)
      alert(`Resume uploaded! Extracted ${text.length} characters.\n\nProceed to Step 2 to edit and translate.`)
    } catch (error: any) {
      console.error('Upload failed:', error)
      setUploadError(error.message || 'Failed to parse file.')
      
      // Try to read as plain text as fallback
      try {
        const reader = new FileReader()
        reader.onload = (e) => {
          const text = e.target?.result as string
          if (text && text.trim().length > 0) {
            setResumeEn({ rawText: text, name: '', contact: '', sections: {} })
            setUploadSuccess(true)
            alert('File uploaded as plain text (some formatting may be lost).')
          }
        }
        reader.readAsText(file)
      } catch (fallbackError) {
        // Ignore fallback error
      }
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }
  
  const handleUseManualText = () => {
    if (!manualText.trim()) {
      alert('Please enter your resume text.')
      return
    }
    
    const structured = structureResumeText(manualText)
    setResumeEn(structured)
    setUploadSuccess(true)
    setUploadError(null)
    setShowManualEntry(false)
    
    if (!selectedTemplate) {
      setSelectedTemplate('modern')
    }
    
    alert('Manual text saved! Proceed to Step 2 to edit and translate.')
  }
  
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
      
      {/* Template Grid */}
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
          </div>
        ))}
      </div>
      
      {/* Customize Button */}
      {selectedTemplate && (
        <div className="mb-6">
          <button
            onClick={() => setShowCustomize(!showCustomize)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <span>⚙️</span>
            <span className="font-medium">{showCustomize ? 'Hide Customization' : 'Customize Template'}</span>
          </button>
        </div>
      )}
      
      {/* Customization Panel */}
      {showCustomize && selectedTemplate && (
        <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Template Customization</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Font Family */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white"
              >
                {fontOptions.map(font => (
                  <option key={font.id} value={font.id}>{font.name}</option>
                ))}
              </select>
            </div>
            
            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
              <div className="flex gap-2">
                {sizeOptions.map(size => (
                  <button
                    key={size.id}
                    onClick={() => setFontSize(size.id)}
                    className={`flex-1 px-3 py-2 border rounded-lg transition ${fontSize === size.id ? 'bg-blue-100 border-blue-500' : 'bg-white hover:bg-gray-50'}`}
                  >
                    <div className="text-xs">{size.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Margins */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Page Margins</label>
              <div className="flex gap-2">
                {marginOptions.map(margin => (
                  <button
                    key={margin.id}
                    onClick={() => setMarginSize(margin.id)}
                    className={`flex-1 px-3 py-2 border rounded-lg transition ${marginSize === margin.id ? 'bg-blue-100 border-blue-500' : 'bg-white hover:bg-gray-50'}`}
                  >
                    <div className="text-xs">{margin.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Color Scheme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
              <div className="flex gap-2 flex-wrap">
                {colorOptions.map(color => (
                  <button
                    key={color.id}
                    onClick={() => setColorScheme(color.id)}
                    className={`w-8 h-8 rounded-full border-2 transition ${colorScheme === color.id ? 'border-gray-800 scale-110' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Preview */}
          <div className="mt-6 p-4 bg-white rounded-lg border">
            <p className="text-sm text-gray-600 mb-2">Current Settings:</p>
            <div className="flex gap-4 text-xs text-gray-500">
              <span>Font: {fontOptions.find(f => f.id === fontFamily)?.name}</span>
              <span>•</span>
              <span>Size: {sizeOptions.find(s => s.id === fontSize)?.desc}</span>
              <span>•</span>
              <span>Margin: {marginOptions.find(m => m.id === marginSize)?.desc}</span>
              <span>•</span>
              <span>Color: {colorOptions.find(c => c.id === colorScheme)?.name}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Upload Status */}
      {(uploadError || uploadSuccess) && (
        <div className={`mb-6 p-4 rounded-lg ${uploadError ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
          <div className="flex flex-col gap-2">
            <p className={uploadError ? 'text-red-800' : 'text-green-800'}>
              {uploadError ? '❌ ' + uploadError : '✅ Resume uploaded successfully!'}
            </p>
            
            {/* Manual entry option when upload fails */}
            {uploadError && !uploadSuccess && (
              <div className="mt-2">
                <button
                  onClick={() => setShowManualEntry(!showManualEntry)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {showManualEntry ? 'Hide manual entry' : '→ Enter resume text manually'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Manual Text Entry */}
      {showManualEntry && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-medium text-blue-800 mb-3">Enter Resume Text</h3>
          <p className="text-sm text-blue-600 mb-3">
            Paste your resume text below. You can copy from a PDF viewer or Word document.
          </p>
          <textarea
            className="w-full h-64 p-3 border rounded-lg mb-3"
            placeholder="Paste your resume text here...
Example:
John Doe
Software Engineer
john@example.com • (123) 456-7890

EXPERIENCE
Senior Developer, TechCorp (2020-Present)
• Led team of 5 developers
• Improved performance by 40%

SKILLS
Python, React, AWS"
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
          />
          <div className="flex gap-3">
            <button
              onClick={handleUseManualText}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={!manualText.trim()}
            >
              Use This Text
            </button>
            <button
              onClick={() => setShowManualEntry(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex justify-between items-center pt-6 border-t">
        <div>
          <p className="text-gray-700">
            Selected: <span className="font-semibold">{selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.name : 'None'}</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {!uploadSuccess ? 'Upload your resume or enter text manually, then proceed.' : 'Ready to proceed to Step 2.'}
          </p>
        </div>
        
        <div className="flex gap-4">
          <input
            type="file"
            id="resume-upload"
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <label
            htmlFor="resume-upload"
            className={`px-6 py-3 rounded-lg transition cursor-pointer ${isUploading ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {isUploading ? 'Parsing...' : '📤 Upload Resume'}
          </label>
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            onClick={handleNext}
            disabled={!selectedTemplate || !uploadSuccess}
          >
            Next: Fill & Translate →
          </button>
        </div>
      </div>
      
      {/* Supported Formats */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
        <p className="font-medium mb-1">📝 Tips for best results:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Text-based PDFs</strong> work best (not scanned/image PDFs)</li>
          <li>If PDF parsing fails, try <strong>saving as Word (.docx)</strong> first</li>
          <li>For scanned PDFs, use <strong>manual text entry</strong> (copy-paste from PDF viewer)</li>
          <li>Maximum file size: <strong>10MB</strong></li>
        </ul>
      </div>
    </div>
  )
}