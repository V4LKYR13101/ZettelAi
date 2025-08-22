const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  toggleVisibility: () => ipcRenderer.invoke('toggle-visibility'),
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  quitApp: () => ipcRenderer.invoke('quit-app'),
  showSettings: () => ipcRenderer.invoke('show-settings'),
  showMainWindow: () => ipcRenderer.invoke('show-main-window'),
  updateSettings: (settings) => ipcRenderer.invoke('update-settings', settings),
  setClickThrough: (clickThrough) => ipcRenderer.invoke('set-click-through', clickThrough),
  setIgnoreMouseEvents: (ignore, options) => ipcRenderer.invoke('set-click-through', ignore),
  
  // Navigation functions
  navigateToChat: () => ipcRenderer.invoke('navigate-to-chat'),
  navigateToNotesList: () => ipcRenderer.invoke('navigate-to-notes-list'),
  navigateToNoteEditor: (noteId) => ipcRenderer.invoke('navigate-to-note-editor', noteId),
  
  // Listen for settings updates
  onSettingsUpdated: (callback) => {
    ipcRenderer.on('settings-updated', (event, settings) => callback(settings));
  },
  
  // Listen for window blur events
  onWindowBlur: (callback) => {
    ipcRenderer.on('window-blur', () => callback());
  }
});
