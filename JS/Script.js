const notesContainer = document.querySelector("#notes-container")
const noteInput = document.querySelector("#note-content")
const addNoteBtn = document.querySelector(".add-note");

const searchInput = document.querySelector("#search-container")

const exportBtn = document.querySelector("#exports-notes")

// funçoes
function showNotes() {
    cleanNotes();
    getNotes().forEach((note) => {
        const noteElement = createNote(note.id, note.content, note.fixed);

        notesContainer.appendChild(noteElement);
    })
}

function cleanNotes() {
    notesContainer.replaceChildren([])
}

function addNote() {
    const notes = getNotes();
    const noteObject = {
        id: generateId(),
        content: noteInput.value,
        fixed: false,
    }
    const noteElement = createNote(noteObject.id, noteObject.content);

    notesContainer.appendChild(noteElement);

    notes.push(noteObject);

    saveNotes(notes);

    noteInput.value = ""
}
function generateId() {
    return Math.floor(Math.random() * 5000);
};

function createNote(id, content, fixed) {
    const element = document.createElement("div");

    const elementPin = document.createElement("i");
    const elementX = document.createElement("i");
    const elementPlus = document.createElement("i");

    elementPin.classList.add("bi");
    elementPin.classList.add("bi-pin");

    elementX.classList.add("bi");
    elementX.classList.add("bi-x-lg");

    elementPlus.classList.add("bi");
    elementPlus.classList.add("bi-file-earmark-plus");



    element.classList.add("note");

    const texarea = document.createElement("textarea");

    texarea.value = content;

    texarea.placeholder = "Adicione algum texto...";

    element.appendChild(texarea);
    element.appendChild(elementPin);
    element.appendChild(elementX);
    element.appendChild(elementPlus);

    element.querySelector(".bi-pin").addEventListener("click", () => {
        toggleFIxNote(id);
    })
    if (fixed) {
        element.classList.add("fixed")
    }

    elementX.addEventListener("click", () => {
        deleteNote(id, element);
    })

    element.querySelector("textarea").addEventListener("keyup", (e) => {
        const notesContent = e.target.value

        updateNote(id, notesContent)
    })
    elementPlus.addEventListener("click", () => {
        copyNote(id);
    })

    return element;
}

function toggleFIxNote(id) {
    const notes = getNotes();

    const targetNote = notes.filter((note) => note.id === id)[0];

    targetNote.fixed = !targetNote.fixed;

    saveNotes(notes)

    showNotes();
}

function deleteNote(id, element) {
    const notes = getNotes().filter((note) => note.id !== id)

    saveNotes(notes)

    notesContainer.removeChild(element);

}

function copyNote(id) {

    const notes = getNotes()

    const targetNote = notes.filter((note) => note.id === id)[0]

    const noteObject = {
        id: generateId(),
        content: targetNote.content,
        fixed: false,
    };

    const noteElement = createNote(noteObject.id, noteObject.content, noteObject.fixed)

    notesContainer.appendChild(noteElement)

    notes.push(noteObject)

    saveNotes(notes);
}

function updateNote(id, newContent) {
    const notes = getNotes()

    const targetNote = notes.filter((note) => note.id === id)[0]

    targetNote.content = newContent;

    saveNotes(notes);
}

// local storage

function getNotes() {
    const notes = JSON.parse(localStorage.getItem("notes") || "[]");
    const orderNotes = notes.sort((a, b) => a.fixed > b.fixed ? -1 : 1);


    return orderNotes;
}

function saveNotes(notes) {
    localStorage.setItem("notes", JSON.stringify(notes))
}

function searchNotes(search){

    const searchResults = getNotes().filter((notes) => {
        return notes.content.includes(search)
    })

    if(search !==""){
        cleanNotes();

        searchResults.forEach((notes) =>{
            const noteElement = createNote(notes.id,notes.content)
            notesContainer.appendChild(noteElement);
        })

        return;
    }

    cleanNotes();

    showNotes();

}

noteInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter"){
        addNote();
    }
})

function exportData(){

    const notes = getNotes()

    const csvString = [
        ["id","Conteudo","Fixado?"],
        ...notes.map((note)=>[note.id, note.content,note.fixed])
    ]
    
    .map((e) => e.join(";"))
    .join("\n");

    const element = document.createElement("a")

    element.href = "data:text/csv;charset=utf-8," + encodeURI(csvString);

    element.target = "_blank";

    element.download ="notes.csv";

    element.click();

}

// eventos

searchInput.addEventListener("keyup",(e)=>{
    const search = e.target.value;

    searchNotes(search);
})

addNoteBtn.addEventListener("click", () => addNote());

exportBtn.addEventListener("click",() => {
    exportData() ;
})

showNotes();