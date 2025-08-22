// Note Editor JavaScript
class NoteEditor {
    constructor() {
        this.noteId = null;
        this.note = null;
        this.isVisible = false;
        this.isDirty = false;
        this.autoSaveTimer = null;
        this.isRecording = false;
        this.recognition = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadNote();
        this.setupAutoSave();
        this.setupSpeechRecognition();
        this.setupTrigger();
    }

    initializeElements() {
        this.editorPanel = document.getElementById('editorPanel');
        this.backBtn = document.getElementById('backBtn');
        this.voiceBtn = document.getElementById('voiceBtn');
        this.saveBtn = document.getElementById('saveBtn');
        this.optionsBtn = document.getElementById('optionsBtn');
        this.optionsDropdown = document.getElementById('optionsDropdown');
        
        this.statusIndicator = document.getElementById('statusIndicator');
        this.statusText = document.getElementById('statusText');
        
        this.titleInput = document.getElementById('noteTitleInput');
        this.contentTextarea = document.getElementById('noteContentTextarea');
        this.tagsInput = document.getElementById('tagsInput');
        this.tagsDisplay = document.getElementById('tagsDisplay');
        
        this.wordCount = document.getElementById('wordCount');
        this.charCount = document.getElementById('charCount');
        this.lastModified = document.getElementById('lastModified');
        
        this.voiceRecording = document.getElementById('voiceRecording');
        this.stopRecordingBtn = document.getElementById('stopRecordingBtn');
        
        this.exportBtn = document.getElementById('exportBtn');
        this.duplicateBtn = document.getElementById('duplicateBtn');
        this.deleteBtn = document.getElementById('deleteBtn');
    }

    attachEventListeners() {
        // Navigation
        this.backBtn.addEventListener('click', () => this.goBack());
        
        // Save functionality
        this.saveBtn.addEventListener('click', () => this.saveNote());
        
        // Voice recording
        this.voiceBtn.addEventListener('click', () => this.toggleVoiceRecording());
        this.stopRecordingBtn.addEventListener('click', () => this.stopVoiceRecording());
        
        // Options dropdown
        this.optionsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleOptionsDropdown();
        });
        
        // Content changes
        this.titleInput.addEventListener('input', () => this.handleContentChange());
        this.contentTextarea.addEventListener('input', () => this.handleContentChange());
        this.tagsInput.addEventListener('keydown', (e) => this.handleTagsInput(e));
        
        // Options actions
        this.exportBtn.addEventListener('click', () => this.exportNote());
        this.duplicateBtn.addEventListener('click', () => this.duplicateNote());
        this.deleteBtn.addEventListener('click', () => this.deleteNote());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.optionsDropdown.contains(e.target) && !this.optionsBtn.contains(e.target)) {
                this.hideOptionsDropdown();
            }
        });
        
        // Window events
        window.addEventListener('blur', () => this.hidePanel());
        window.addEventListener('beforeunload', () => this.saveNote());
    }

    setupTrigger() {
        const triggerArea = document.querySelector('.trigger-area');
        triggerArea.addEventListener('mouseenter', () => {
            if (!this.isVisible) {
                this.showPanel();
            }
        });

        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isVisible && !this.editorPanel.contains(e.target) && !e.target.closest('.trigger-area')) {
                this.hidePanel();
            }
        });
    }

    showPanel() {
        this.isVisible = true;
        this.editorPanel.classList.add('visible');
        
        // Enable pointer events for the entire window
        if (window.electronAPI) {
            window.electronAPI.setIgnoreMouseEvents(false);
        }
        
        // Focus title input
        setTimeout(() => {
            this.titleInput.focus();
        }, 100);
    }

    hidePanel() {
        if (this.isDirty) {
            this.saveNote();
        }
        
        this.isVisible = false;
        this.editorPanel.classList.remove('visible');
        this.hideOptionsDropdown();
        
        // Disable pointer events except for trigger area
        if (window.electronAPI) {
            window.electronAPI.setIgnoreMouseEvents(true, { forward: true });
        }
    }

    loadNote() {
        // Get note ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        this.noteId = urlParams.get('id');
        
        if (!this.noteId) {
            // Create new note
            this.noteId = this.generateNoteId();
            this.note = {
                id: this.noteId,
                title: '',
                content: '',
                tags: [],
                created: new Date().toISOString(),
                modified: new Date().toISOString()
            };
        } else {
            // Load existing note
            this.note = this.loadNoteFromStorage(this.noteId);
            if (!this.note) {
                // Note not found, create new one
                this.note = {
                    id: this.noteId,
                    title: '',
                    content: '',
                    tags: [],
                    created: new Date().toISOString(),
                    modified: new Date().toISOString()
                };
            }
        }
        
        this.populateEditor();
        this.updateStatus('saved');
    }

    populateEditor() {
        this.titleInput.value = this.note.title || '';
        this.contentTextarea.value = this.note.content || '';
        this.renderTags();
        this.updateStats();
        this.updateLastModified();
    }

    renderTags() {
        this.tagsDisplay.innerHTML = '';
        if (this.note.tags && this.note.tags.length > 0) {
            this.note.tags.forEach(tag => {
                const tagElement = this.createTagElement(tag);
                this.tagsDisplay.appendChild(tagElement);
            });
        }
    }

    createTagElement(tag) {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.innerHTML = `
            ${this.escapeHtml(tag)}
            <button class="tag-remove" data-tag="${this.escapeHtml(tag)}">&times;</button>
        `;
        
        const removeBtn = tagElement.querySelector('.tag-remove');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeTag(tag);
        });
        
        return tagElement;
    }

    handleTagsInput(e) {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            this.addTag();
        } else if (e.key === 'Backspace' && e.target.value === '' && this.note.tags.length > 0) {
            this.removeTag(this.note.tags[this.note.tags.length - 1]);
        }
    }

    addTag() {
        const tagText = this.tagsInput.value.trim().toLowerCase();
        if (tagText && !this.note.tags.includes(tagText)) {
            this.note.tags.push(tagText);
            this.tagsInput.value = '';
            this.renderTags();
            this.handleContentChange();
        }
    }

    removeTag(tag) {
        this.note.tags = this.note.tags.filter(t => t !== tag);
        this.renderTags();
        this.handleContentChange();
    }

    handleContentChange() {
        this.isDirty = true;
        this.updateStatus('unsaved');
        this.updateStats();
        
        // Reset auto-save timer
        if (this.autoSaveTimer) {
            clearTimeout(this.autoSaveTimer);
        }
        this.autoSaveTimer = setTimeout(() => {
            this.saveNote();
        }, 2000);
    }

    setupAutoSave() {
        // Auto-save every 30 seconds if there are changes
        setInterval(() => {
            if (this.isDirty) {
                this.saveNote();
            }
        }, 30000);
    }

    saveNote() {
        if (!this.isDirty) return;
        
        this.updateStatus('saving');
        
        // Update note data
        this.note.title = this.titleInput.value.trim() || 'Untitled Note';
        this.note.content = this.contentTextarea.value;
        this.note.modified = new Date().toISOString();
        
        // Save to storage
        this.saveNoteToStorage(this.note);
        
        this.isDirty = false;
        this.updateStatus('saved');
        this.updateLastModified();
        
        // Clear auto-save timer
        if (this.autoSaveTimer) {
            clearTimeout(this.autoSaveTimer);
            this.autoSaveTimer = null;
        }
    }

    updateStatus(status) {
        switch (status) {
            case 'saved':
                this.statusIndicator.className = 'status-indicator';
                this.statusText.textContent = 'Saved';
                this.saveBtn.disabled = true;
                break;
            case 'unsaved':
                this.statusIndicator.className = 'status-indicator';
                this.statusText.textContent = 'Unsaved changes';
                this.saveBtn.disabled = false;
                break;
            case 'saving':
                this.statusIndicator.className = 'status-indicator saving';
                this.statusText.textContent = 'Saving...';
                this.saveBtn.disabled = true;
                break;
            case 'error':
                this.statusIndicator.className = 'status-indicator error';
                this.statusText.textContent = 'Error saving';
                this.saveBtn.disabled = false;
                break;
        }
    }

    updateStats() {
        const content = this.contentTextarea.value;
        const words = content.trim() ? content.trim().split(/\s+/).length : 0;
        const chars = content.length;
        
        this.wordCount.textContent = `${words} word${words !== 1 ? 's' : ''}`;
        this.charCount.textContent = `${chars} character${chars !== 1 ? 's' : ''}`;
    }

    updateLastModified() {
        if (this.note.modified) {
            const date = new Date(this.note.modified);
            this.lastModified.textContent = `Last modified ${this.formatDate(date)}`;
        } else {
            this.lastModified.textContent = 'Never saved';
        }
    }

    goBack() {
        if (this.isDirty) {
            this.saveNote();
        }
        
        if (window.electronAPI) {
            window.electronAPI.navigateToNotesList();
        } else {
            // Fallback for development
            window.location.href = 'notes-list.html';
        }
    }

    // Voice recording functionality
    setupSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';
            
            this.recognition.onstart = () => {
                this.isRecording = true;
                this.voiceBtn.classList.add('recording');
                this.voiceRecording.style.display = 'flex';
            };
            
            this.recognition.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';
                
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }
                
                if (finalTranscript) {
                    const currentContent = this.contentTextarea.value;
                    const newContent = currentContent + (currentContent ? ' ' : '') + finalTranscript;
                    this.contentTextarea.value = newContent;
                    this.handleContentChange();
                }
            };
            
            this.recognition.onend = () => {
                this.stopVoiceRecording();
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.stopVoiceRecording();
            };
        } else {
            // Hide voice button if speech recognition is not supported
            this.voiceBtn.style.display = 'none';
        }
    }

    toggleVoiceRecording() {
        if (this.isRecording) {
            this.stopVoiceRecording();
        } else {
            this.startVoiceRecording();
        }
    }

    startVoiceRecording() {
        if (this.recognition && !this.isRecording) {
            this.recognition.start();
        }
    }

    stopVoiceRecording() {
        if (this.recognition && this.isRecording) {
            this.recognition.stop();
        }
        
        this.isRecording = false;
        this.voiceBtn.classList.remove('recording');
        this.voiceRecording.style.display = 'none';
    }

    // Options functionality
    toggleOptionsDropdown() {
        this.optionsDropdown.classList.toggle('visible');
    }

    hideOptionsDropdown() {
        this.optionsDropdown.classList.remove('visible');
    }

    exportNote() {
        const content = `# ${this.note.title}\n\n${this.note.content}`;
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.note.title || 'note'}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.hideOptionsDropdown();
    }

    duplicateNote() {
        const duplicateId = this.generateNoteId();
        const duplicateNote = {
            ...this.note,
            id: duplicateId,
            title: `${this.note.title} (Copy)`,
            created: new Date().toISOString(),
            modified: new Date().toISOString()
        };
        
        this.saveNoteToStorage(duplicateNote);
        
        if (window.electronAPI) {
            window.electronAPI.navigateToNoteEditor(duplicateId);
        } else {
            window.location.href = `note-editor.html?id=${duplicateId}`;
        }
        
        this.hideOptionsDropdown();
    }

    deleteNote() {
        if (confirm(`Are you sure you want to delete "${this.note.title}"?`)) {
            this.deleteNoteFromStorage(this.noteId);
            this.goBack();
        }
        this.hideOptionsDropdown();
    }

    handleKeyboardShortcuts(e) {
        if (!this.isVisible) return;
        
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 's':
                    e.preventDefault();
                    this.saveNote();
                    break;
                case 'b':
                    e.preventDefault();
                    this.goBack();
                    break;
                case 'd':
                    e.preventDefault();
                    this.duplicateNote();
                    break;
            }
        }
        
        if (e.key === 'Escape') {
            if (this.optionsDropdown.classList.contains('visible')) {
                this.hideOptionsDropdown();
            } else {
                this.hidePanel();
            }
        }
    }

    // Storage functions
    loadNoteFromStorage(noteId) {
        try {
            const notes = JSON.parse(localStorage.getItem('zettel-notes') || '[]');
            return notes.find(note => note.id === noteId);
        } catch (error) {
            console.error('Error loading note:', error);
            return null;
        }
    }

    saveNoteToStorage(note) {
        try {
            const notes = JSON.parse(localStorage.getItem('zettel-notes') || '[]');
            const existingIndex = notes.findIndex(n => n.id === note.id);
            
            if (existingIndex >= 0) {
                notes[existingIndex] = note;
            } else {
                notes.push(note);
            }
            
            localStorage.setItem('zettel-notes', JSON.stringify(notes));
        } catch (error) {
            console.error('Error saving note:', error);
            this.updateStatus('error');
        }
    }

    deleteNoteFromStorage(noteId) {
        try {
            const notes = JSON.parse(localStorage.getItem('zettel-notes') || '[]');
            const filteredNotes = notes.filter(note => note.id !== noteId);
            localStorage.setItem('zettel-notes', JSON.stringify(filteredNotes));
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    }

    // Utility functions
    generateNoteId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    formatDate(date) {
        const now = new Date();
        const diff = now - date;
        
        const minute = 60 * 1000;
        const hour = minute * 60;
        const day = hour * 24;
        
        if (diff < minute) {
            return 'just now';
        } else if (diff < hour) {
            const mins = Math.floor(diff / minute);
            return `${mins} minute${mins > 1 ? 's' : ''} ago`;
        } else if (diff < day) {
            const hours = Math.floor(diff / hour);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (diff < day * 7) {
            const days = Math.floor(diff / day);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString();
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the note editor when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new NoteEditor();
});

// Listen for messages from main process
window.addEventListener('message', (event) => {
    if (event.data.type === 'window-blur') {
        const noteEditor = window.noteEditor;
        if (noteEditor && noteEditor.isVisible) {
            noteEditor.hidePanel();
        }
    }
});
