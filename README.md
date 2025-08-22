# Zettel Widget

A beautiful desktop widget application with speech-to-text### Controls

### Voice Input
- **Click microphone**: Start/stop voice recording
- **Space key**: Hold to record (release to stop)
- **Enter**: Send typed message
- **Shift+Enter**: New line in text input

### Window Controls
- **Settings button**: Open configuration panel
- **Ctrl+Shift+G**: Toggle widget visibility
- **Minimize button**: Hide widget
- **Close button**: Quit application

### Quick Actions
- **Meeting Mode**: Get meeting assistance
- **Quick Search**: Focus input for searching
- **Take Notes**: Start note-taking mode

## Configuration

### Initial Setup
1. Click the settings (gear) icon in the widget
2. Select your preferred AI provider (OpenAI, Gemini, or OpenRouter)
3. Enter your API key for the chosen provider
4. Select the model you want to use
5. Customize behavior and appearance settings
6. Click "Test Connection" to verify your setup
7. Save your settings

### API Keys
- **OpenAI**: Get your API key from https://platform.openai.com/api-keys
- **Google Gemini**: Get your API key from https://makersuite.google.com/app/apikey
- **OpenRouter**: Get your API key from https://openrouter.ai/keys

### Advanced Settings
- **Temperature**: Controls creativity (0.0-1.0)
- **Max Tokens**: Limits response length
- **System Prompt**: Customize AI behavior
- **Opacity**: Adjust widget transparency
- **Position**: Choose widget placementon and AI integration capabilities, inspired by Cluely.com. This application runs as an always-on-top translucent overlay that doesn't appear in the taskbar.

## Features

- 🎤 **Voice Recognition**: Built-in Chrome speech-to-text functionality
- 🤖 **AI Integration**: Connect to OpenAI, Google Gemini, or OpenRouter
- ⚙️ **Settings Panel**: Comprehensive configuration interface
- 🔍 **AI Assistance**: Real-time intelligent responses to your questions
- 👻 **Translucent Design**: Beautiful, semi-transparent interface
- 📱 **Desktop Widget**: Always-on-top, doesn't show in taskbar
- ⌨️ **Keyboard Shortcuts**: Global hotkeys for easy access
- 🎨 **Beautiful UI**: Modern design inspired by Cluely.com

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
1. Open terminal in the project directory
2. Install dependencies:
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

## Controls

### Voice Input
- **Click microphone**: Start/stop voice recording
- **Space key**: Hold to record (release to stop)
- **Enter**: Send typed message
- **Shift+Enter**: New line in text input

### Window Controls
- **Ctrl+Shift+G**: Toggle widget visibility
- **Minimize button**: Hide widget
- **Close button**: Quit application

### Quick Actions
- **Meeting Mode**: Get meeting assistance
- **Quick Search**: Focus input for searching
- **Take Notes**: Start note-taking mode

## Features

### Speech Recognition
The widget uses Chrome's built-in Web Speech API for accurate speech-to-text conversion. Simply click the microphone button or press and hold the space key to start recording.

### AI Responses
Currently includes demo responses for:
- Greetings
- Time and date queries
- Weather inquiries
- Meeting assistance
- General help

### Window Behavior
- Always stays on top of other windows
- Translucent background with blur effect
- Draggable by clicking and dragging the main area
- Doesn't appear in taskbar or Alt+Tab switcher
- Positioned in top-right corner by default

## Customization

### Styling
Edit `src/styles.css` to customize the appearance:
- Colors and gradients
- Transparency levels
- Animations and transitions
- Layout and spacing

### Functionality
Modify `src/renderer.js` to add:
- New voice commands
- Custom AI integrations
- Additional quick actions
- Enhanced speech recognition

### Window Properties
Adjust `src/main.js` for:
- Default position and size
- Transparency settings
- Always-on-top behavior
- Keyboard shortcuts

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
- Add code signing

## Development

### Project Structure
```
src/
├── main.js          # Main Electron process
├── preload.js       # Preload script for security
├── index.html       # Main UI
├── styles.css       # Styling
└── renderer.js      # Frontend logic

assets/              # Icons and resources
package.json         # Dependencies and build config
```

### Adding Features
1. Modify the UI in `index.html`
2. Update styles in `styles.css`
3. Add functionality in `renderer.js`
4. Update main process in `main.js` if needed

## Troubleshooting

### Speech Recognition Not Working
- Ensure you're using Chrome or Chromium-based browser engine
- Check microphone permissions
- Verify internet connection (required for speech recognition)

### Window Not Staying on Top
- Check if other applications have "always on top" priority
- Restart the application
- Verify window settings in `main.js`

### Build Issues
- Ensure all dependencies are installed: `npm install`
- Clear node_modules and reinstall if needed
- Check Node.js version compatibility

## License

MIT License - feel free to modify and distribute as needed.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and feature requests, please create an issue in the repository or contact the development team.
