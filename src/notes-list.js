// Notes List JavaScript
class NotesManager {
    constructor() {
        this.notes = [];
        this.filteredNotes = [];
        this.searchQuery = '';
        this.isVisible = false;
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadNotes();
        this.setupTrigger();
    }

    initializeElements() {
        this.notesPanel = document.getElementById('notesPanel');
        this.backBtn = document.getElementById('backBtn');
        this.newNoteBtn = document.getElementById('newNoteBtn');
        this.searchBtn = document.getElementById('searchBtn');
        this.searchBar = document.getElementById('searchBar');
        this.searchInput = document.getElementById('searchInput');
        this.notesGrid = document.getElementById('notesGrid');
        this.emptyState = document.getElementById('emptyState');
        this.createFirstNoteBtn = document.getElementById('createFirstNoteBtn');
    }

    attachEventListeners() {
        // Navigation buttons
        this.backBtn.addEventListener('click', () => this.goBack());
        this.newNoteBtn.addEventListener('click', () => this.createNewNote());
        this.createFirstNoteBtn.addEventListener('click', () => this.createNewNote());
        
        // Search functionality
        this.searchBtn.addEventListener('click', () => this.toggleSearch());
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.toggleSearch();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Window events
        window.addEventListener('blur', () => this.hidePanel());
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
            if (this.isVisible && !this.notesPanel.contains(e.target) && !e.target.closest('.trigger-area')) {
                this.hidePanel();
            }
        });
    }

    showPanel() {
        this.isVisible = true;
        this.notesPanel.classList.add('visible');
        
        // Enable pointer events for the entire window
        if (window.electronAPI) {
            window.electronAPI.setIgnoreMouseEvents(false);
        }
        
        // Focus search if it's visible
        if (this.searchBar.classList.contains('visible')) {
            this.searchInput.focus();
        }
    }

    hidePanel() {
        this.isVisible = false;
        this.notesPanel.classList.remove('visible');
        
        // Disable pointer events except for trigger area
        if (window.electronAPI) {
            window.electronAPI.setIgnoreMouseEvents(true, { forward: true });
        }
        
        // Hide search bar if visible
        if (this.searchBar.classList.contains('visible')) {
            this.toggleSearch();
        }
    }

    goBack() {
        // Navigate back to main chat interface
        if (window.electronAPI) {
            window.electronAPI.navigateToChat();
        } else {
            // Fallback for development
            window.location.href = 'chat-new.html';
        }
    }

    createNewNote() {
        const noteId = this.generateNoteId();
        if (window.electronAPI) {
            window.electronAPI.navigateToNoteEditor(noteId);
        } else {
            // Fallback for development
            window.location.href = `note-editor.html?id=${noteId}`;
        }
    }

    editNote(noteId) {
        if (window.electronAPI) {
            window.electronAPI.navigateToNoteEditor(noteId);
        } else {
            // Fallback for development
            window.location.href = `note-editor.html?id=${noteId}`;
        }
    }

    deleteNote(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (!note) return;

        if (confirm(`Are you sure you want to delete "${note.title}"?`)) {
            this.notes = this.notes.filter(n => n.id !== noteId);
            this.saveNotes();
            this.renderNotes();
        }
    }

    toggleSearch() {
        const isVisible = this.searchBar.classList.contains('visible');
        
        if (isVisible) {
            this.searchBar.classList.remove('visible');
            this.searchInput.value = '';
            this.handleSearch('');
        } else {
            this.searchBar.classList.add('visible');
            this.searchInput.focus();
        }
    }

    handleSearch(query) {
        this.searchQuery = query.toLowerCase();
        this.filterNotes();
        this.renderNotes();
    }

    filterNotes() {
        if (!this.searchQuery) {
            this.filteredNotes = [...this.notes];
        } else {
            this.filteredNotes = this.notes.filter(note => 
                note.title.toLowerCase().includes(this.searchQuery) ||
                note.content.toLowerCase().includes(this.searchQuery) ||
                (note.tags && note.tags.some(tag => tag.toLowerCase().includes(this.searchQuery)))
            );
        }
    }

    loadNotes() {
        try {
            const savedNotes = localStorage.getItem('zettel-notes');
            if (savedNotes) {
                this.notes = JSON.parse(savedNotes);
            } else {
                // Load sample note if no notes exist
                this.notes = [{
                    id: 'sample',
                    title: 'Welcome to Zettel Notes',
                    content: 'This is your first note! You can create, edit, and organize your thoughts here. Use the + button to create new notes, or click on this note to edit it.',
                    tags: ['welcome', 'getting-started'],
                    created: new Date().toISOString(),
                    modified: new Date().toISOString()
                }];
                this.saveNotes();
            }
            this.filterNotes();
            this.renderNotes();
        } catch (error) {
            console.error('Error loading notes:', error);
            this.notes = [];
            this.filteredNotes = [];
            this.renderNotes();
        }
    }

    saveNotes() {
        try {
            localStorage.setItem('zettel-notes', JSON.stringify(this.notes));
        } catch (error) {
            console.error('Error saving notes:', error);
        }
    }

    renderNotes() {
        if (this.filteredNotes.length === 0) {
            this.showEmptyState();
        } else {
            this.showNotesGrid();
        }
    }

    showEmptyState() {
        this.notesGrid.style.display = 'none';
        this.emptyState.style.display = 'flex';
    }

    showNotesGrid() {
        this.emptyState.style.display = 'none';
        this.notesGrid.style.display = 'grid';
        
        this.notesGrid.innerHTML = this.filteredNotes.map(note => this.createNoteCard(note)).join('');
        
        // Attach event listeners to note cards
        this.attachNoteCardListeners();
    }

    createNoteCard(note) {
        const preview = this.truncateText(note.content, 150);
        const formattedDate = this.formatDate(note.modified || note.created);
        const tags = note.tags ? note.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';
        
        return `
            <div class="note-card" data-note-id="${note.id}">
                <div class="note-header">
                    <h3 class="note-title">${this.escapeHtml(note.title)}</h3>
                    <div class="note-date">${formattedDate}</div>
                </div>
                <div class="note-preview">${this.escapeHtml(preview)}</div>
                <div class="note-footer">
                    <div class="note-tags">${tags}</div>
                    <div class="note-actions">
                        <button class="action-btn edit-btn" title="Edit" data-note-id="${note.id}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                        <button class="action-btn delete-btn" title="Delete" data-note-id="${note.id}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3,6 5,6 21,6"/>
                                <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    attachNoteCardListeners() {
        // Note card click (open for editing)
        this.notesGrid.querySelectorAll('.note-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking on action buttons
                if (e.target.closest('.action-btn')) return;
                
                const noteId = card.dataset.noteId;
                this.editNote(noteId);
            });
        });

        // Edit buttons
        this.notesGrid.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const noteId = btn.dataset.noteId;
                this.editNote(noteId);
            });
        });

        // Delete buttons
        this.notesGrid.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const noteId = btn.dataset.noteId;
                this.deleteNote(noteId);
            });
        });
    }

    handleKeyboardShortcuts(e) {
        if (!this.isVisible) return;

        switch (e.key) {
            case 'Escape':
                this.hidePanel();
                break;
            case 'n':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.createNewNote();
                }
                break;
            case 'f':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.toggleSearch();
                }
                break;
        }
    }

    // Utility functions
    generateNoteId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        
        const minute = 60 * 1000;
        const hour = minute * 60;
        const day = hour * 24;
        
        if (diff < minute) {
            return 'Just now';
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

// Initialize the notes manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new NotesManager();
});

// Listen for messages from main process
window.addEventListener('message', (event) => {
    if (event.data.type === 'window-blur') {
        const notesManager = window.notesManager;
        if (notesManager && notesManager.isVisible) {
            notesManager.hidePanel();
        }
    }
});
