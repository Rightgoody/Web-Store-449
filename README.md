# Web Store 449

A simple TypeScript-based store website with a landing page and about us page.

## Features

- Modern, responsive design
- TypeScript-based frontend
- Simple navigation between pages
- Clean, professional styling
- Mobile-friendly layout

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── main.ts              # Main application entry point
├── pages/               # Page components
│   ├── HomePage.ts      # Landing page component
│   └── AboutPage.ts     # About us page component
└── styles/
    └── main.css         # Main stylesheet
```

## Technologies Used

- TypeScript
- Vite (build tool and dev server)
- Vanilla JavaScript (no frameworks)
- CSS3 with modern features

## Customization

The website is designed to be easily customizable:

- Update the store name in the navigation
- Modify colors and styling in `src/styles/main.css`
- Add new pages by creating new components in `src/pages/`
- Update content in the respective page components
