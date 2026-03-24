// File parsing utilities for PDF and Word resumes

/**
 * Parse PDF file and extract text
 */
export async function parsePDF(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Check file size (max 10MB for PDF parsing)
    if (file.size > 10 * 1024 * 1024) {
      reject(new Error('PDF file is too large (max 10MB). Please compress or use a smaller file.'))
      return
    }
    
    // Check if file appears to be a PDF (basic check)
    if (file.type && file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      reject(new Error('File does not appear to be a PDF. Please upload a .pdf file.'))
      return
    }
    
    const reader = new FileReader()
    
    reader.onload = async (event) => {
      try {
        // Dynamically import pdf-parse (reduces bundle size)
        const pdfParse = await import('pdf-parse')
        const data = event.target?.result as ArrayBuffer
        const pdfData = new Uint8Array(data)
        const result = await pdfParse.default(pdfData)
        
        // Check if any text was extracted
        if (!result.text || result.text.trim().length === 0) {
          reject(new Error('PDF parsed but no text found. This may be a scanned/image-based PDF. Please use a text-based PDF or manually paste your resume.'))
          return
        }
        
        // Check if text extraction seems reasonable (at least 50 characters)
        if (result.text.length < 50) {
          console.warn('PDF extracted very little text:', result.text.length, 'characters')
          // Still resolve, but warn user
        }
        
        resolve(result.text)
      } catch (error: any) {
        console.error('PDF parsing failed:', error)
        
        // More specific error messages based on error type
        let errorMessage = 'Failed to parse PDF. '
        
        if (error.message && error.message.includes('encrypted')) {
          errorMessage += 'The PDF is password-protected or encrypted. Please remove password protection.'
        } else if (error.message && error.message.includes('corrupt')) {
          errorMessage += 'The PDF appears to be corrupted. Try opening it in a PDF viewer first.'
        } else if (error.message && error.message.includes('version')) {
          errorMessage += 'Unsupported PDF version. Try saving as PDF 1.4 or later.'
        } else {
          errorMessage += 'The file may be corrupted, encrypted, or scanned (image-based). Try converting to a text-based PDF.'
        }
        
        reject(new Error(errorMessage))
      }
    }
    
    reader.onerror = () => reject(new Error('Failed to read file. The file may be in use or corrupted.'))
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Parse Word (.docx) file and extract text
 */
export async function parseWord(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = async (event) => {
      try {
        // Dynamically import mammoth
        const mammoth = await import('mammoth')
        const arrayBuffer = event.target?.result as ArrayBuffer
        const result = await mammoth.extractRawText({ arrayBuffer })
        resolve(result.value)
      } catch (error) {
        console.error('Word parsing failed:', error)
        reject(new Error('Failed to parse Word document. Please ensure it is a .docx file.'))
      }
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Parse text file (plain text)
 */
export async function parseText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      resolve(event.target?.result as string)
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

/**
 * Parse any supported resume file (PDF, DOCX, TXT)
 */
export async function parseResumeFile(file: File): Promise<{ text: string; fileType: string }> {
  const fileType = file.type
  const fileName = file.name.toLowerCase()
  
  let text: string
  
  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    text = await parsePDF(file)
  } else if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileName.endsWith('.docx')
  ) {
    text = await parseWord(file)
  } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
    text = await parseText(file)
  } else {
    throw new Error(`Unsupported file type: ${fileType}. Please upload PDF, DOCX, or TXT.`)
  }
  
  return { text, fileType }
}

/**
 * Attempt to structure parsed resume text into sections
 */
export function structureResumeText(text: string): Record<string, any> {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line)
  
  const sections: Record<string, string[]> = {}
  let currentSection = 'Personal'
  sections[currentSection] = []
  
  // Common section headers (English and Chinese)
  const sectionPatterns = [
    { key: 'experience', patterns: ['EXPERIENCE', 'WORK EXPERIENCE', 'EMPLOYMENT', '工作经历', '工作经验'] },
    { key: 'education', patterns: ['EDUCATION', 'ACADEMIC', '教育背景', '学历'] },
    { key: 'skills', patterns: ['SKILLS', 'TECHNICAL SKILLS', '技能', '技术技能'] },
    { key: 'projects', patterns: ['PROJECTS', 'PROJECT EXPERIENCE', '项目经历', '项目经验'] },
    { key: 'certifications', patterns: ['CERTIFICATIONS', 'CERTIFICATES', '证书', '认证'] },
    { key: 'languages', patterns: ['LANGUAGES', '语言能力'] },
  ]
  
  for (const line of lines) {
    // Check if line matches a section header
    let matchedSection = null
    for (const { key, patterns } of sectionPatterns) {
      if (patterns.some(pattern => line.toUpperCase().includes(pattern.toUpperCase()))) {
        matchedSection = key
        break
      }
    }
    
    if (matchedSection) {
      currentSection = matchedSection
      sections[currentSection] = []
    } else {
      sections[currentSection].push(line)
    }
  }
  
  // Extract name (likely first line)
  const name = lines[0] || ''
  
  // Extract contact info (lines with @, phone, linkedin, etc.)
  const contactLines = lines.filter(line => 
    line.includes('@') || 
    line.match(/[\d\-\(\)\+ ]{7,}/) || // Phone-like
    line.includes('linkedin') ||
    line.includes('github')
  )
  
  return {
    name,
    contact: contactLines.join(' • '),
    sections,
    rawText: text
  }
}