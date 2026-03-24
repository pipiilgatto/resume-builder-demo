import { create } from 'zustand'

interface ResumeStore {
  // Step 1
  selectedTemplate: string | null
  setSelectedTemplate: (template: string) => void
  
  // Step 2
  jobDescription: string
  setJobDescription: (desc: string) => void
  
  // Resume content
  resumeEn: Record<string, any>
  resumeZh: Record<string, any>
  setResumeEn: (data: Record<string, any>) => void
  setResumeZh: (data: Record<string, any>) => void
  
  // UI state
  currentStep: 1 | 2 | 3
  setCurrentStep: (step: 1 | 2 | 3) => void
  
  // DeepSeek API
  deepseekApiKey: string
  setDeepseekApiKey: (key: string) => void
}

export const useResumeStore = create<ResumeStore>((set) => ({
  selectedTemplate: null,
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
  
  jobDescription: '',
  setJobDescription: (desc) => set({ jobDescription: desc }),
  
  resumeEn: {},
  resumeZh: {},
  setResumeEn: (data) => set({ resumeEn: data }),
  setResumeZh: (data) => set({ resumeZh: data }),
  
  currentStep: 1,
  setCurrentStep: (step) => set({ currentStep: step }),
  
  deepseekApiKey: '',
  setDeepseekApiKey: (key) => set({ deepseekApiKey: key }),
}))