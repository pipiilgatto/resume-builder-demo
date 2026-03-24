# Deployment Guide – GitHub Pages

## Prerequisites

1. **GitHub account**
2. **Node.js** installed (for building)
3. **Git** installed

## Step‑by‑Step

### 1. Create GitHub Repository

- Go to https://github.com/new
- Repository name: `resume-builder-demo` (or any name)
- **Public** (GitHub Pages works with public repos)
- Don't initialize with README (we'll push existing code)

### 2. Push Code to GitHub

```bash
# Initialize git (already done in this project)
git add .
git commit -m "Initial commit: resume builder demo"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/resume-builder-demo.git

# Push to main branch
git branch -M main
git push -u origin main
```

### 3. Configure GitHub Pages

- Go to your repo on GitHub → **Settings** → **Pages**
- **Source**: select `gh‑pages` branch
- **Folder**: `/ (root)`
- Click **Save**

### 4. Deploy

```bash
# Install gh‑pages globally (if not already)
npm install -g gh-pages

# Deploy (this builds and pushes to gh‑pages branch)
npm run deploy
```

**What `npm run deploy` does:**
1. Runs `npm run build` – creates `dist/` folder
2. Uses `gh‑pages` to push `dist/` to `gh‑pages` branch
3. GitHub Pages automatically serves from that branch

### 5. Access Your Live App

Your resume builder will be available at:
```
https://YOUR_USERNAME.github.io/resume-builder-demo/
```

(Replace `YOUR_USERNAME` with your GitHub username.)

## Troubleshooting

**Page shows 404 or blank screen?**
- Wait 1‑2 minutes after deployment
- Check that `base` in `vite.config.ts` matches repository name
- Inspect browser console for errors

**Build fails?**
- Ensure all dependencies installed: `npm install`
- Check Node.js version ≥18

**DeepSeek API CORS error?**
- The demo uses DeepSeek API directly from browser
- If CORS blocks, you may need a simple proxy server
- For demo purposes, mock responses are used

## Custom Domain (Optional)

To use a custom domain:
1. Add `CNAME` file to `public/` folder with your domain
2. Configure DNS with GitHub Pages IP addresses
3. Update GitHub Pages settings with custom domain

## Updating

After making changes:
```bash
git add .
git commit -m "Update feature X"
git push origin main
npm run deploy
```

The live site will update within a minute.

---

**Demo note:** This is a client‑only application. No backend server required. All data stays in browser localStorage.