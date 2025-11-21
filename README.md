# PDF Citation Viewer

An interactive React application for viewing PDFs with citation-based text highlighting. Built with React, Vite, and react-pdf.

## Features

- 📄 **Split-pane Layout**: Resizable PDF viewer and notes panel
- 🔍 **Citation Highlighting**: Click citations to jump to referenced text in the PDF
- 📖 **Full PDF Navigation**: Scroll through pages, zoom in/out
- ✨ **Smart Text Highlighting**: Automatically highlights cited text in yellow
- 🎨 **Modern UI**: Clean, professional design with Tailwind CSS

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install dependencies:
```bash
npm install
```

3. Add your PDF file:
   - Place your PDF file in the `public` folder
   - Name it `maersk.pdf` (or update the file path in `src/pages/Index.tsx`)

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:8080`

## Usage

### Adding Citations

Citations are defined in `src/components/NotesPanel.tsx`. Each citation requires:

```typescript
{
  number: 3,              // Citation number [3]
  page: 15,               // Target page in PDF
  text: "Text to search", // Text to highlight
  searchText: "Exact text in PDF to highlight"
}
```

### How It Works

1. Click any citation (e.g., [3]) in the notes panel
2. The PDF viewer scrolls to the specified page
3. The exact text is highlighted in yellow
4. The highlight persists as you scroll

## Project Structure

```
src/
├── components/
│   ├── PDFViewer.tsx       # Main PDF rendering component
│   ├── NotesPanel.tsx      # Citation and notes display
│   ├── Citation.tsx        # Clickable citation badge
│   └── ui/                 # Shadcn UI components
├── hooks/
│   └── useHighlight.ts     # Highlighting state management
├── pages/
│   └── Index.tsx           # Main application page
└── index.css               # Design system & styles
```

## Technologies

- **React 18** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **react-pdf** - PDF rendering
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Radix UI** - Accessible primitives

## Customization

### Changing the PDF

Replace `/public/maersk.pdf` with your own PDF file.

Update the file path in `src/pages/Index.tsx`:
```tsx
<PDFViewer file="/your-pdf-name.pdf" />
```

### Adding More Citations

Edit `src/components/NotesPanel.tsx` and add entries to the `citations` array:

```typescript
const citations = [
  {
    number: 4,
    page: 20,
    text: "Your citation text",
    searchText: "Exact text to highlight in PDF"
  }
];
```

### Styling

The design system is defined in:
- `src/index.css` - Color tokens and CSS variables
- `tailwind.config.ts` - Tailwind configuration

Modify these files to customize colors, spacing, and typography.

## Build for Production

```bash
npm run build
```

The production files will be in the `dist` folder.

## Deployment

This project can be deployed to:
- Lovable (click "Publish" in the editor)
- Vercel
- Netlify
- Any static hosting service

## License

MIT License - Feel free to use this project for your own needs.

## Support

For issues or questions, please create an issue in the repository.
