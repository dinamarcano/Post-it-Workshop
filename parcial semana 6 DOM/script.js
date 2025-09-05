

//aqui hacemos llamado a los id que sacamos del html con getelmentbyid
const noteInput = document.getElementById('new-note-input');
const addButton = document.getElementById('add-note-button');
const notesContainer = document.getElementById('notes-container');
const toggleThemeButton = document.getElementById('toggle-theme-button');
const body = document.body;

//  Colores que usaremos uwu creando variable, pero que ya existen en el css y lo tomamos
const colors = ['note-yellow', 'note-blue', 'note-pink', 'note-green', 'note-purple'];

//  hacemos la funcion para crear nota, junto al delete botom, tambien le asignamos una clase de css al Notediv y al deleteboton y el delete es hijo de notediv
function createNoteElement(text, colorClass) {
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note', colorClass); 
    noteDiv.textContent = text;

    const deleteButton = document.createElement('span');
    deleteButton.classList.add('delete-btn');
    deleteButton.textContent = 'x';

    noteDiv.appendChild(deleteButton);
    return noteDiv;
}

// Guardar esas notas creadas para el local storgae usando queryselector 
function saveNotes() {
    const notes = [];
    document.querySelectorAll('.note').forEach(note => {
        const text = note.childNodes[0].textContent; 
        const color = [...note.classList].find(c => c.startsWith('note-'));
        notes.push({ text, color });
    });
    localStorage.setItem('notes', JSON.stringify(notes));
}

//  Cargar notas al inicio, usamos una function , cargamos con getitem 
function loadNotes() {
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
        const notes = JSON.parse(storedNotes);
        notes.forEach(noteData => {
            const newNote = createNoteElement(noteData.text, noteData.color);
            notesContainer.appendChild(newNote);
        });
    }
}

// Ajustar tema inicial que es el modo claro uwu
function setInitialTheme() {
    const isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    if (isDarkMode) {
        body.classList.add('dark-mode');
        toggleThemeButton.textContent = 'Modo Claro';
    }
}

//  habilita o desactiva ese boton jiji, aqui es usando un adevenlistener 
noteInput.addEventListener('input', () => {
    addButton.disabled = noteInput.value.trim() === '';
});

// alternar modo oscuro bb usando el estilo de dark mode, el cual esta en css
toggleThemeButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('isDarkMode', isDarkMode);
    toggleThemeButton.textContent = isDarkMode ? 'Modo Claro' : 'Modo Oscuro';
});

//  aqui es cuando podes editar la nota y hacerla mas pequueña y como tal, editarla 
notesContainer.addEventListener('dblclick', (event) => {
    const target = event.target;
    if (target.classList.contains('note')) {
        const currentText = target.childNodes[0].textContent; 
        target.textContent = '';
        target.classList.add('editing');

        const textarea = document.createElement('textarea');
        textarea.value = currentText;
        target.appendChild(textarea);
        textarea.focus();

        function saveEdit() {
            const newText = textarea.value.trim();
            target.textContent = newText;
            target.classList.remove('editing');
            
            const deleteButton = document.createElement('span');
            deleteButton.classList.add('delete-btn');
            deleteButton.textContent = 'x';
            target.appendChild(deleteButton);

            saveNotes();
        }
        textarea.addEventListener('blur', saveEdit);
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveEdit();
            }
        });
    }
});

//  Agregar nota usa
addButton.addEventListener('click', () => {
    const noteText = noteInput.value.trim();
    if (noteText !== '') {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const newNote = createNoteElement(noteText, randomColor);
        notesContainer.appendChild(newNote);

        noteInput.value = '';
        addButton.disabled = true;
        saveNotes();
    }
});

//  Eliminar nota
notesContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        event.target.parentElement.remove();
        saveNotes();
    }
});
setInitialTheme();
loadNotes();

