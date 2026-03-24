import { useResumeStore } from './store'
import Step1 from './components/Step1'
import Step2 from './components/Step2'
import Step3 from './components/Step3'

function App() {
  const { currentStep } = useResumeStore()
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Resume Builder Demo</h1>
        <p className="text-gray-600 mt-2">Three-step bilingual resume builder with AI suggestions</p>
      </header>
      
      <div className="max-w-6xl mx-auto">
        {/* Step indicator */}
        <div className="flex justify-center mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                {step}
              </div>
              {step < 3 && <div className={`w-24 h-1 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-300'}`} />}
            </div>
          ))}
        </div>
        
        {/* Step content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {currentStep === 1 && <Step1 />}
          {currentStep === 2 && <Step2 />}
          {currentStep === 3 && <Step3 />}
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>This demo uses DeepSeek API for translation and suggestions. Provide your own API key.</p>
          <p className="mt-1">Deploys to GitHub Pages • Built with React + Tailwind</p>
        </div>
      </div>
    </div>
  )
}

export default App