import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// Register fonts if needed (optional)
// Font.register({ family: 'Inter', src: '/fonts/Inter-Regular.ttf' })

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 8,
  },
  contact: {
    fontSize: 10,
    color: '#6B7280',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 4,
  },
  item: {
    marginBottom: 12,
  },
  company: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 2,
  },
  period: {
    fontSize: 10,
    color: '#6B7280',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  bullet: {
    fontSize: 10,
    color: '#4B5563',
    marginLeft: 10,
    marginBottom: 2,
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  skillTag: {
    fontSize: 9,
    backgroundColor: '#F3F4F6',
    color: '#4B5563',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  education: {
    fontSize: 10,
    color: '#4B5563',
  },
})

// Parse plain text resume into structured data
function parseResumeText(text: string) {
  const lines = text.split('\n').filter(line => line.trim() !== '')
  const result: any = {
    name: '',
    title: '',
    contact: '',
    sections: [] as Array<{title: string, content: string[]}>,
  }
  
  let currentSection: {title: string, content: string[]} | null = null
  
  for (const line of lines) {
    // Detect section headers (all caps or common headers)
    const isSectionHeader = 
      line === line.toUpperCase() && 
      line.length > 3 && 
      !line.includes('@') && 
      !line.includes('•') &&
      !line.match(/^\d/)
    
    if (isSectionHeader) {
      if (currentSection) {
        result.sections.push(currentSection)
      }
      currentSection = { title: line, content: [] }
    } else if (!result.name) {
      result.name = line
    } else if (!result.title && line.includes('Engineer') || line.includes('Developer') || line.includes('Manager')) {
      result.title = line
    } else if (!result.contact && (line.includes('@') || line.includes('•') || line.includes('linkedin'))) {
      result.contact = line
    } else if (currentSection) {
      currentSection.content.push(line)
    }
  }
  
  if (currentSection) {
    result.sections.push(currentSection)
  }
  
  return result
}

interface ResumePDFProps {
  content: string
  language?: 'en' | 'zh'
  template?: string
}

const ResumePDF: React.FC<ResumePDFProps> = ({ content, language = 'en', template = 'modern' }) => {
  const parsed = parseResumeText(content)
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {parsed.name && <Text style={styles.name}>{parsed.name}</Text>}
          {parsed.title && <Text style={styles.title}>{parsed.title}</Text>}
          {parsed.contact && (
            <View style={styles.contact}>
              <Text>{parsed.contact}</Text>
            </View>
          )}
        </View>
        
        {/* Sections */}
        {parsed.sections.map((section: any, idx: number) => (
          <View key={idx} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            
            {section.title.toUpperCase().includes('EXPERIENCE') || section.title.toUpperCase().includes('工作经历') ? (
              // Experience items
              section.content.map((item: string, itemIdx: number) => {
                if (item.includes('•')) {
                  return (
                    <Text key={itemIdx} style={styles.bullet}>
                      {item.replace('•', '●')}
                    </Text>
                  )
                } else if (item.includes('(') && item.includes(')')) {
                  // Company with period
                  return (
                    <View key={itemIdx} style={styles.item}>
                      <Text style={styles.company}>{item.split('(')[0].trim()}</Text>
                      <Text style={styles.period}>({item.match(/\(([^)]+)\)/)?.[1]})</Text>
                    </View>
                  )
                } else {
                  return (
                    <Text key={itemIdx} style={{ fontSize: 10, color: '#4B5563', marginBottom: 4 }}>
                      {item}
                    </Text>
                  )
                }
              })
            ) : section.title.toUpperCase().includes('SKILLS') || section.title.toUpperCase().includes('技能') ? (
              // Skills tags
              <View style={styles.skills}>
                {section.content.flatMap(line => 
                  line.split(',').map(skill => skill.trim()).map((skill, skillIdx) => (
                    <Text key={skillIdx} style={styles.skillTag}>
                      {skill}
                    </Text>
                  ))
                )}
              </View>
            ) : (
              // Default rendering
              section.content.map((item: string, itemIdx: number) => (
                <Text key={itemIdx} style={{ fontSize: 10, color: '#4B5563', marginBottom: 4 }}>
                  {item}
                </Text>
              ))
            )}
          </View>
        ))}
        
        {/* Footer */}
        <View style={{ marginTop: 30, fontSize: 8, color: '#9CA3AF', textAlign: 'center' }}>
          <Text>Generated by Resume Builder Demo • {new Date().toLocaleDateString()}</Text>
        </View>
      </Page>
    </Document>
  )
}

export default ResumePDF
export { parseResumeText }