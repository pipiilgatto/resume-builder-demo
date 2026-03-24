# Resume Builder Demo

A three‑step bilingual resume builder with AI‑powered suggestions. Built for GitHub Pages deployment.

## Features

**Step 1 – Template Gallery**
- Choose from 5 professional resume templates
- Upload existing resume (PDF/Word) – mock for demo
- Customize sections, fonts, margins

**Step 2 – Split‑Screen Editor**
- Left: Job description input (paste text, upload image, enter URL)
- AI chat interface for resume improvement suggestions
- Right: Resume preview with English/Chinese toggle
- DeepSeek API integration (user provides own key)

**Step 3 – Bilingual Review**
- Side‑by‑side editable English and Chinese resumes
- Direct text editing for final adjustments
- Download each version as text file (PDF in production)

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** (fast build tool)
- **Tailwind CSS** (styling)
- **Zustand** (state management)
- **DeepSeek API** (AI translation & suggestions)
- **GitHub Pages** (hosting)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## DeepSeek Integration

1. Get an API key from [DeepSeek Platform](https://platform.deepseek.com/)
2. Enter your key in the settings panel (Step 2)
3. The app will use DeepSeek for:
   - English ↔ Chinese translation
   - Job‑description‑driven resume suggestions

## Deployment to GitHub Pages

1. Create a new GitHub repository
2. Push this code to the `main` branch
3. Run `npm run deploy` – this builds and pushes to the `gh‑pages` branch
4. Enable GitHub Pages in repo settings (source: `gh‑pages` branch)
5. Your app will be live at: `https://[username].github.io/resume-builder-demo/`

## Project Structure

```
src/
├── components/
│   ├── Step1.tsx    # Template selection
│   ├── Step2.tsx    # Split‑screen editor
│   └── Step3.tsx    # Bilingual review
├── store.ts         # Zustand state management
├── utils/
│   └── deepseek.ts  # DeepSeek API integration
└── App.tsx          # Main app with step router
```

## Next Steps (Production)

1. **Real file upload** with PDF/Word parsing
2. **PDF generation** using @react‑pdf/renderer
3. **User accounts** and resume storage
4. **More templates** with advanced customization
5. **OCR integration** for job‑description images

## License

MIT