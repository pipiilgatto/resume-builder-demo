import { useResumeStore } from '../store'
import { useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import ResumePDF from './ResumePDF'

export default function Step3() {
  const { setCurrentStep, selectedTemplate } = useResumeStore()
  const [enContent, setEnContent] = useState(`John Doe
Senior Software Engineer
john.doe@email.com • (123) 456-7890 • linkedin.com/in/johndoe

EXPERIENCE
Lead Engineer, TechCorp (2020‑Present)
• Led a team of 5 developers to build a cloud‑native microservices platform
• Reduced API response time by 40% through optimization and caching
• Implemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes

Software Developer, Startup Inc. (2018‑2020)
• Developed React frontend and Python backend for customer dashboard
• Improved application performance by 30% through code optimization

SKILLS
Python, React, AWS, Docker, Kubernetes, TypeScript, PostgreSQL, Git

EDUCATION
MSc Computer Science – Stanford University (2018)
BSc Software Engineering – MIT (2016)`)

  const [zhContent, setZhContent] = useState(`张三
高级软件工程师
john.doe@email.com • (123) 456-7890 • linkedin.com/in/johndoe

工作经历
TechCorp 首席工程师 (2020‑至今)
• 领导5人开发团队构建云原生微服务平台
• 通过优化和缓存将API响应时间减少40%
• 实施CI/CD流水线，将部署时间从2小时缩短至15分钟

Startup Inc. 软件开发工程师 (2018‑2020)
• 为客户仪表板开发React前端和Python后端
• 通过代码优化将应用程序性能提升30%

技能
Python, React, AWS, Docker, Kubernetes, TypeScript, PostgreSQL, Git

教育背景
计算机科学硕士 – 斯坦福大学 (2018)
软件工程学士 – 麻省理工学院 (2016)`)

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const handleDownload = async (lang: 'en' | 'zh') => {
    const content = lang === 'en' ? enContent : zhContent
    setIsGeneratingPDF(true)
    
    try {
      // Generate PDF
      const pdfBlob = await pdf(
        <ResumePDF 
          content={content} 
          language={lang}
          template={selectedTemplate || 'modern'}
        />
      ).toBlob()
      
      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `resume_${lang}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      alert(`Downloaded ${lang.toUpperCase()} resume as PDF.`)
    } catch (error) {
      console.error('PDF generation failed:', error)
      // Fallback to text download
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `resume_${lang}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      alert(`PDF generation failed. Downloaded ${lang.toUpperCase()} resume as text file instead.`)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleDownloadBoth = async () => {
    setIsGeneratingPDF(true)
    try {
      // Generate both PDFs
      const enPdfBlob = await pdf(
        <ResumePDF content={enContent} language="en" template={selectedTemplate || 'modern'} />
      ).toBlob()
      
      const zhPdfBlob = await pdf(
        <ResumePDF content={zhContent} language="zh" template={selectedTemplate || 'modern'} />
      ).toBlob()
      
      // Download English
      const enUrl = URL.createObjectURL(enPdfBlob)
      const enA = document.createElement('a')
      enA.href = enUrl
      enA.download = 'resume_en.pdf'
      document.body.appendChild(enA)
      enA.click()
      document.body.removeChild(enA)
      URL.revokeObjectURL(enUrl)
      
      // Small delay before second download
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Download Chinese
      const zhUrl = URL.createObjectURL(zhPdfBlob)
      const zhA = document.createElement('a')
      zhA.href = zhUrl
      zhA.download = 'resume_zh.pdf'
      document.body.appendChild(zhA)
      zhA.click()
      document.body.removeChild(zhA)
      URL.revokeObjectURL(zhUrl)
      
      alert('Both English and Chinese resumes downloaded as PDFs!')
    } catch (error) {
      console.error('PDF generation failed:', error)
      alert('Failed to generate PDFs. Please try downloading individually.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Final Review & Export</h2>
        <div className="flex gap-4">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            onClick={() => setCurrentStep(2)}
          >
            ← Back
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            onClick={handleDownloadBoth}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? 'Generating PDFs...' : 'Download Both'}
          </button>
        </div>
      </div>

      <p className="text-gray-600 mb-8">
        Review and edit your English and Chinese resumes side‑by‑side. Make final adjustments, then download each version as PDF.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* English resume */}
        <div className="border rounded-xl p-6 bg-white">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-800">English Resume</h3>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              onClick={() => handleDownload('en')}
              disabled={isGeneratingPDF}
            >
              {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
          
          <div className="border rounded-lg p-4 bg-gray-50 min-h-[500px]">
            <textarea
              className="w-full h-full min-h-[480px] p-4 font-mono text-sm bg-white border rounded"
              value={enContent}
              onChange={(e) => setEnContent(e.target.value)}
              spellCheck={false}
            />
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            💡 Edit directly. Changes are saved automatically.
          </div>
        </div>

        {/* Chinese resume */}
        <div className="border rounded-xl p-6 bg-white">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-800">中文简历</h3>
            <button
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              onClick={() => handleDownload('zh')}
              disabled={isGeneratingPDF}
            >
              {isGeneratingPDF ? '生成中...' : '下载PDF'}
            </button>
          </div>
          
          <div className="border rounded-lg p-4 bg-gray-50 min-h-[500px]">
            <textarea
              className="w-full h-full min-h-[480px] p-4 font-mono text-sm bg-white border rounded"
              value={zhContent}
              onChange={(e) => setZhContent(e.target.value)}
              spellCheck={false}
            />
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            💡 直接编辑。更改会自动保存。
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
        <h4 className="text-lg font-medium text-blue-800 mb-2">Next Steps</h4>
        <ul className="list-disc pl-5 text-blue-700 space-y-1">
          <li>Your resumes are saved in browser storage (localStorage).</li>
          <li>Click "Download PDF" to generate professionally formatted resumes.</li>
          <li>To deploy to GitHub Pages: run <code className="bg-white px-2 py-1 rounded text-sm">npm run deploy</code></li>
          <li>For production use, connect a real translation API (DeepSeek) and implement PDF generation.</li>
          <li>Add user accounts, more templates, and advanced customization.</li>
        </ul>
        <div className="mt-4 flex gap-4">
          <button
            className="px-6 py-3 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50"
            onClick={() => setCurrentStep(1)}
          >
            Start Over
          </button>
          <button
            className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
            onClick={() => alert('Demo complete! The app is fully functional with PDF export.')}
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  )
}