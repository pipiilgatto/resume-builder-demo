// File parsing utilities for PDF and Word resumes

/**
 * Parse PDF file and extract text
 */
export async function parsePDF(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = async (event) => {
      try {
        // Dynamically import pdf-parse (reduces bundle size)
        const pdfParse = await import('pdf-parse')
        const data = event.target?.result as ArrayBuffer
        const pdfData = new Uint8Array(data)
        const result = await pdfParse.default(pdfData)
        resolve(result.text)
      } catch (error) {
        console.error('PDF parsing failed:', error)
        reject(new Error('Failed to parse PDF. The file may be corrupted or encrypted.'))
      }
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
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