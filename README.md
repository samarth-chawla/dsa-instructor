
# DSA Instructor

An intelligent AI-powered chatbot designed to teach **Data Structures and Algorithms (DSA)** through interactive guidance. Get expert-level instruction on problem-solving, algorithmic patterns, and competitive programming using Google's Gemini 2.5 Flash model.

## Features

✨ **AI-Powered Learning**: Leverages Google Gemini 2.5 Flash for intelligent, expert DSA instruction
📚 **Pedagogical Approach**: Uses the Socratic method to guide you toward solutions without direct code spoilers
💬 **Real-Time Streaming**: Experience smooth, streaming responses as the AI explains concepts
🎨 **Modern UI**: Clean, dark-themed interface built with Tailwind CSS
📖 **Markdown Support**: Beautiful formatting for code snippets, explanations, and complexity analysis
⚡ **Fast & Responsive**: Built on Next.js 16 with Edge runtime for optimal performance

## Key Learning Features

The instructor follows these teaching principles:

1. **Conceptual Understanding First** - Explains the core intuition behind problems
2. **Brute Force Analysis** - Discusses naive approaches and their complexity
3. **Optimization Techniques** - Teaches optimized solutions with pattern recognition (Sliding Window, DP, Two Pointers, etc.)
4. **Guided Learning** - Encourages you to code the solution yourself with hints

## Prerequisites

- Node.js 18+ and npm
- Google API Key for Gemini (get it from [Google AI Studio](https://aistudio.google.com/apikey))

## Installation

1. Clone or setup the project:
```bash
npm install
```

2. Create a `.env.local` file and add your Google API key:
```env
GEMINI_API_KEY=your_api_key_here
```

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser and start asking DSA questions!

## Build & Deploy

**Build for production:**
```bash
npm run build
npm start
```

**Lint your code:**
```bash
npm run lint
```

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4
- **Backend**: Next.js 16 (App Router, Edge Runtime)
- **AI**: Google GenAI (Gemini 2.5 Flash)
- **UI Components**: Lucide React icons, React Markdown
- **Styling**: PostCSS with Tailwind CSS

## Project Structure

```
app/
├── page.tsx           # Main chat interface component
├── layout.tsx         # Root layout wrapper
├── api/
│   └── chat/
│       └── route.ts   # Gemini API integration & streaming
└── globals.css        # Global styles
```

## Usage Tips

- Ask about **any DSA topic**: sorting, searching, trees, graphs, dynamic programming, etc.
- Mention your **approach** if stuck - the instructor will guide you better
- The AI will **decline non-DSA topics** - it's specialized for problem-solving education
- Request **pseudocode hints** if you struggle with implementation after understanding the approach

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |

## Learning Resources

While using DSA Instructor, consider supplementing with:

- [LeetCode](https://leetcode.com) - Practice problems
- [GeeksforGeeks](https://geeksforgeeks.org) - Detailed DSA tutorials
- [Codeforces](https://codeforces.com) - Competitive programming

## Deployment

Deploy easily on **Vercel** (recommended for Next.js):

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Add `GEMINI_API_KEY` to your environment variables
4. Deploy!

## License

This project is open source and available for educational purposes.
