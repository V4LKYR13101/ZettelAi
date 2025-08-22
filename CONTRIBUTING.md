# Contributing to Zettel

Thank you for your interest in contributing to Zettel! This document provides guidelines for contributing to this project.

## Development Setup

1. **Prerequisites**
   ```bash
   Node.js 18+ 
   npm or yarn
   ```

2. **Installation**
   ```bash
   git clone <repository-url>
   cd Zettel
   npm install
   ```

3. **Development**
   ```bash
   npm run dev    # Start development mode
   npm run build  # Build for production
   ```

## Project Structure

```
src/
├── main.js              # Electron main process
├── preload.js           # Electron preload script
├── chat-new.html        # Main chat interface (SPA)
├── ai-service.js        # AI provider integrations
├── notes-list.html      # Standalone notes list page
├── note-editor.html     # Standalone note editor page
└── assets/              # Icons and static assets
```

## Key Features

- **AI Chat Interface**: Multi-provider support (OpenAI, Gemini, OpenRouter)
- **Advanced Notes**: Single-page application with search, tags, auto-save
- **Voice Integration**: Speech-to-text for chat and notes
- **Electron Desktop**: Translucent overlay, always-on-top widget
- **Export Features**: Markdown export, note management

## Code Style

- Use ES6+ JavaScript features
- Follow existing code formatting
- Add comments for complex logic
- Test your changes thoroughly

## Submitting Changes

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Reporting Issues

Please use the GitHub issue tracker to report bugs or request features.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
