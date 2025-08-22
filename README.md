# Zettel

A powerful AI-powered desktop assistant with integrated note-taking capabilities. Zettel combines intelligent conversation with a comprehensive note management system, all in a beautiful translucent desktop interface.

## Features

- 🤖 **AI Chat Interface**: Interactive conversations with multiple AI providers
- 📝 **Advanced Note-Taking**: Create, edit, search, and organize your notes
- 🎤 **Voice Recognition**: Built-in speech-to-text functionality
- 🔍 **Smart Search**: Find notes and information quickly
- ⚙️ **Settings Panel**: Comprehensive configuration interface
- 👻 **Translucent Design**: Beautiful, semi-transparent desktop overlay
- 📱 **Desktop Widget**: Always-on-top, doesn't show in taskbar
- ⌨️ **Keyboard Shortcuts**: Global hotkeys for easy access
- 💾 **Auto-Save**: Your notes and conversations are automatically saved
- 📤 **Export Options**: Export notes in various formats

## AI Providers Supported

### OpenAI
- GPT-4o, GPT-4o Mini, GPT-4 Turbo, GPT-3.5 Turbo
- Requires OpenAI API key

### Google Gemini
- Gemini 1.5 Pro, Gemini 1.5 Flash, Gemini Pro
- Requires Google AI API key

### OpenRouter
- Access to Claude 3.5 Sonnet, GPT-4o, Gemini Pro, Llama 3.1, and more
- Requires OpenRouter API key

## Installation

### Prerequisites
- Node.js 16+ installed
- Windows, macOS, or Linux

### Setup
1. Clone or download the project
2. Open terminal in the project directory
3. Install dependencies:
   ```
   npm install
   ```

## Usage

### Development
Run the application in development mode:
```
npm run dev
```

### Production Build
Build the application for distribution:
```
npm run build
```

### Platform-specific Builds
- Windows: `npm run build-win`
- macOS: `npm run build-mac`
- Linux: `npm run build-linux`

## Configuration

### Initial Setup
1. Launch the application
2. Click the settings (gear) icon
3. Select your preferred AI provider (OpenAI, Gemini, or OpenRouter)
4. Enter your API key for the chosen provider
5. Select the model you want to use
6. Customize behavior and appearance settings
7. Click "Test Connection" to verify your setup
8. Save your settings

### API Keys
- **OpenAI**: Get your API key from https://platform.openai.com/api-keys
- **Google Gemini**: Get your API key from https://makersuite.google.com/app/apikey
- **OpenRouter**: Get your API key from https://openrouter.ai/keys

### Advanced Settings
- **Temperature**: Controls AI creativity (0.0-1.0)
- **Max Tokens**: Limits response length
- **System Prompt**: Customize AI behavior
- **Opacity**: Adjust widget transparency
- **Position**: Choose widget placement on screen

## Using the Application

### Chat Interface
- Type messages or use voice input to chat with AI
- Click the microphone button or press Space to record voice
- Press Enter to send messages, Shift+Enter for new lines
- View conversation history in the chat panel

### Note-Taking System
- Click "Notes" to access the note management interface
- **Create Notes**: Click "New Note" to create a new note
- **Edit Notes**: Click on any note to edit it
- **Search Notes**: Use the search bar to find specific notes
- **Filter Notes**: Filter by tags, date, or content
- **Export Notes**: Export individual notes or collections
- **Voice to Notes**: Use voice input while taking notes

### Note Features
- **Auto-save**: Notes are automatically saved as you type
- **Rich Text**: Support for formatting and structure
- **Tags**: Organize notes with custom tags
- **Search**: Full-text search across all notes
- **Date Tracking**: Creation and modification dates
- **Export**: Export to text, markdown, or other formats

## Controls

### Voice Input
- **Click microphone**: Start/stop voice recording
- **Space key**: Hold to record (release to stop)
- **Enter**: Send typed message
- **Shift+Enter**: New line in text input

### Window Controls
- **Settings button**: Open configuration panel
- **Notes button**: Access note-taking interface
- **Ctrl+Shift+G**: Toggle widget visibility
- **Minimize button**: Hide widget
- **Close button**: Quit application

### Navigation
- **Chat**: Main AI conversation interface
- **Notes**: Access note list and editor
- **Settings**: Configure AI providers and appearance

## Project Structure

### Main Application Files
```
src/
├── main.js              # Main Electron process
├── preload.js           # Preload script for security
├── chat-new.html        # Main application interface
├── renderer.js          # Core frontend logic
├── chat-renderer.js     # Chat-specific functionality
├── ai-service.js        # AI provider integrations
├── settings.js          # Settings management
├── styles.css           # Main styling
├── chat.css             # Chat-specific styling
└── settings.css         # Settings panel styling

assets/                  # Icons and resources
package.json            # Dependencies and build config
```

### Note Management
The application includes a comprehensive note-taking system integrated into the main interface:
- Notes are stored locally using browser localStorage
- Full-text search capabilities across all notes
- Tag-based organization system
- Auto-save functionality
- Export options for individual notes or collections

## Window Behavior
- Always stays on top of other windows
- Translucent background with blur effect
- Draggable by clicking and dragging the main area
- Doesn't appear in taskbar or Alt+Tab switcher
- Resizable interface that adapts to content
- Remembers position and size preferences

## Customization

### Styling
Edit the CSS files to customize appearance:
- `src/styles.css`: Main application styling
- `src/chat.css`: Chat interface styling
- `src/settings.css`: Settings panel styling

### Functionality
Modify the JavaScript files to add features:
- `src/chat-renderer.js`: Chat and note functionality
- `src/ai-service.js`: AI provider integrations
- `src/settings.js`: Configuration options

### Window Properties
Adjust `src/main.js` for:
- Default position and size
- Transparency settings
- Always-on-top behavior
- Global keyboard shortcuts

## Distribution

### Building Installers
The application uses electron-builder for creating installers:

- **Windows**: Creates NSIS installer (.exe)
- **macOS**: Creates DMG file
- **Linux**: Creates AppImage

### Customizing Build
Edit the `build` section in `package.json` to:
- Change app name and description
- Set custom icons
- Configure installer options
- Add code signing certificates

## Development

### Adding Features
1. Modify the UI in the appropriate HTML file
2. Update styles in the corresponding CSS file
3. Add functionality in the relevant JavaScript file
4. Update main process in `main.js` if needed
5. Test thoroughly in development mode

### Data Storage
- **Notes**: Stored in localStorage as JSON
- **Settings**: Stored in localStorage
- **Chat History**: Maintained in memory during session
- **AI Conversations**: Can be saved to notes for persistence

## Troubleshooting

### Speech Recognition Not Working
- Ensure you're using a Chromium-based engine
- Check microphone permissions in your browser/system
- Verify internet connection (required for speech recognition)
- Test microphone functionality in other applications

### AI Responses Not Working
- Verify your API key is entered correctly
- Check your internet connection
- Ensure you have sufficient API credits/quota
- Test connection using the "Test Connection" button in settings

### Window Not Staying on Top
- Check if other applications have conflicting "always on top" settings
- Restart the application
- Verify window settings in `main.js`

### Notes Not Saving
- Check browser localStorage permissions
- Ensure sufficient disk space
- Try refreshing the application
- Check browser console for error messages

### Build Issues
- Ensure all dependencies are installed: `npm install`
- Clear node_modules and reinstall if needed: `rm -rf node_modules && npm install`
- Check Node.js version compatibility (16+ required)
- Verify electron-builder configuration in package.json

## License

MIT License - feel free to modify and distribute as needed.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly in development mode
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Submit a pull request

## Support

For issues and feature requests, please create an issue in the repository or contact the development team.

## Roadmap

### Planned Features
- Cloud synchronization for notes
- Additional AI providers
- Plugin system for extensions
- Advanced note formatting options
- Collaborative note sharing
- Mobile companion app
- Custom themes and layouts
- Integration with popular productivity tools
