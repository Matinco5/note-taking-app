let listOfNotes = document.querySelector(".note-list");

// creating a class

  // setting the initial value of the noteID 
  let noteID  = 1;

class Note {
  constructor(id, title, content) {
    this.id = id;
    this.title = title;
    this.content = content;
  }
}

//eventListeners 

function eventListeners (){

  const addNewNoteBtn = document.getElementById("add-note-btn")
  addNewNoteBtn.addEventListener("click", addNotes)

  document.addEventListener("DOMContentLoaded", displayNotes)

  listOfNotes.addEventListener("click", deleteNote);

  listOfNotes.addEventListener("click", editNoteUI)

  const deleteAllBtns = document.querySelector("#delete-all-btn");
  deleteAllBtns.addEventListener("click", deleteAllNotes) 
}

//invoking the evenlisteners function


eventListeners()

// validation of the inputs

function inputValidation (title, content){

  if(title.value !== "" && content.value !== ""){
    return true;
  }
  else{
    if(title.value === ""){
      title.classList.add("warning")
    }
    if(content.value === ""){
      content.classList.add("warning")
    }
  }
  setTimeout(function (){
    title.classList.remove("warning")
    content.classList.remove("warning")
    }, 1600)
  }

  //Defining the function referencing our local storage

  function noteLocalStorage(){
    return localStorage.getItem("notes") ? JSON.parse(localStorage.getItem("notes")) : [];

  }


  //creating notes

  function createNotes(noteItem){
    const newNote = document.createElement("div");

    //addition of the already defined css style class to our new notes
    newNote.classList.add("note-item")
    newNote.setAttribute("data-id", noteItem.id)
    newNote.innerHTML=`
      <h3>${noteItem.title}</h3>

      <p>${noteItem.content}</p>

      <button type = "button" class = "btn delete-note-btn">
      <span><i class = "fas fa-trash"></i></span>
      Delete
      </buttton>

      <button type = "button" class = "btn edit-note-btn">
      <span><i class = "fas fa-pen"></i></span>
      Edit
      </buttton>
    `
    listOfNotes.appendChild(newNote)

  }

  //Addition of new notes to our note list
  function addNotes (){
    const noteTitle = document.getElementById("note-title");
    const noteContent = document.getElementById("note-content")

    if(inputValidation(noteTitle, noteContent)){
     let  notes = noteLocalStorage();

      //creating an instance of the object (Note) defined above.
      //This intance represents each note (item) in our notes (array) .

      let noteItem = new Note(noteID, noteTitle.value, noteContent.value)

      //As we generate each note, we increment the id so as to have a peculiar id for each note
      noteID++

      //Here, we are pushing the newly generated notes into our already existed local storage
       notes.push(noteItem)

      //Invoking the createNote function by passing the new note (noteItem) as an argument, in which function embbeds it into our list  of notes
      
      createNotes(noteItem);

      //After the addition and creation, we proceed to adding our newly generated note into our local storage
      localStorage.setItem("notes", JSON.stringify(notes));
      // we then reset the value of our inputs to nothing so as to have an unoccupied input field for new note collection
      noteTitle.value = "";
      noteContent.value = "";
    }

  }

  //displaying the newly added note on our page
  function displayNotes (){

    //assigning the content of our local storage to a variable 
    let notes = noteLocalStorage();

    if(notes.length > 0){
      //The purpose of the expression in this code is to target the id of the last item in our notes array so as to increment it and generate a new id for for subsequent note
      noteID = notes[notes.length-1].id;
      noteID++
    }
    else{
      noteID = 1;
    }

    //creation of note by looping through our notes using the forEach method 
    notes.forEach(function (noteItem){
      createNotes(noteItem)
    })

  }

  // Deleting a note

  function deleteNote(e){
    if(e.target.classList.contains("delete-note-btn")){

      //removing the parent element of the clicked element
      e.target.parentElement.remove();
      //obtaining the the id of the parent element of the clicked element. (recall that we earlier set the data-id attribute of the parent element when we were creating it)

      let deletedNoteID = e.target.parentElement.dataset.id;
      
      //reassigning our local storage to the variable 'notes'
      let notes = noteLocalStorage();

      //filtering our local storage to obtain the note whose id is not the same with the id of the removed note

      let remainingNotes = notes.filter(function(noteItem){
        return noteItem.id !== parseInt(deletedNoteID);
      })
      
      //resaving the undeleted notes back to our local storage
      localStorage.setItem("notes", JSON.stringify(remainingNotes))
    }
  }

  function deleteAllNotes(){
    //removing all the "notes" key from the local storage. This in turn removes allthe notes
    localStorage.removeItem("notes")
   
    //removing the elements in the noteList container
    let noteList = document.querySelectorAll(".note-item");
    if(noteList.length > 0){
      noteList.forEach(item => {
        listOfNotes.removeChild(item);
      });
    }
    noteID = 1 //resetting noteID to 1
  }


//The Edit button function
  function editNoteUI(e) {
    const noteItem = e.target.parentElement;
    const noteID = noteItem.dataset.id;

    const noteTitle = noteItem.querySelector("h3").textContent;
    const noteContent = noteItem.querySelector("p").textContent;
  
    document.getElementById("note-title").value = noteTitle;
    document.getElementById("note-content").value = noteContent;
  
    const saveEditBtn = document.getElementById("save-edit-btn");

    saveEditBtn.style.display = "block";
    saveEditBtn.addEventListener("click", function () {
      saveEdit(noteID);
    }, { once: true });
  }
  
  function saveEdit(id) {
    const noteTitle = document.getElementById("note-title").value;
    const noteContent = document.getElementById("note-content").value;
    
    if (inputValidation({ value: noteTitle }, { value: noteContent })) {
      let notes = noteLocalStorage();
      notes = notes.map(note => {
        if (note.id === parseInt(id)) {
          note.title = noteTitle;
          note.content = noteContent;
        }
        return note;
      });
      localStorage.setItem("notes", JSON.stringify(notes));
      listOfNotes.innerHTML = "";
      displayNotes();
      document.getElementById("note-title").value = "";
      document.getElementById("note-content").value = "";
      document.getElementById("save-edit-btn").style.display = "none";
    }
  }