const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const errorMessage = document.querySelector("#error-message");
const noteCount = document.querySelector("#note-count");
const searchInput = document.querySelector("#search-input");

// Load saved notes, or start with an empty array.
let notes = [];

try {
  const savedNotes = localStorage.getItem("quicknotes-notes");

  if (savedNotes !== null) {
    const parsedNotes = JSON.parse(savedNotes);

    if (Array.isArray(parsedNotes)) {
      notes = parsedNotes.filter(function (note) {
        return (
          note &&
          typeof note.id === "string" &&
          typeof note.text === "string" &&
          typeof note.category === "string" &&
          typeof note.createdAt === "string"
        );
      });
    }
  }
} catch (error) {
  console.error("Could not load saved notes:", error);
}

function saveNotes() {
  try {
    localStorage.setItem("quicknotes-notes", JSON.stringify(notes));
  } catch (error) {
    console.error("Could not save notes:", error);
    errorMessage.textContent =
      "Could not save notes in this browser.";
  }
}

function render() {
  notesList.replaceChildren();

  // Update the total note count.
  if (notes.length === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (notes.length === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${notes.length} notes.`;
  }

  // Search without considering uppercase or lowercase.
  const searchTerm = searchInput.value.trim().toLowerCase();

  const filteredNotes = notes.filter(function (note) {
    return note.text.toLowerCase().includes(searchTerm);
  });

  if (filteredNotes.length === 0 && searchTerm !== "") {
    const message = document.createElement("li");
    message.textContent = "No notes match your search.";
    notesList.appendChild(message);
    return;
  }

  filteredNotes.forEach(function (note) {
    const listItem = document.createElement("li");
    listItem.classList.add("note-card");
    listItem.classList.add(`category-${note.category}`);

    const noteText = document.createElement("p");
    noteText.classList.add("note-text");
    noteText.textContent = note.text;

    const categoryLabel = document.createElement("span");
    categoryLabel.classList.add("category-label");
    categoryLabel.textContent =
      note.category.charAt(0).toUpperCase() + note.category.slice(1);

    const date = document.createElement("p");
    date.classList.add("note-meta");
    date.textContent = note.createdAt;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
      notes = notes.filter(function (item) {
        return item.id !== note.id;
      });

      saveNotes();
      render();
    });

    listItem.append(noteText, categoryLabel, date, deleteButton);
    notesList.appendChild(listItem);
  });
}

noteForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = noteInput.value.trim();
  const category = noteCategory.value;

  if (text.length === 0) {
    errorMessage.textContent = "Please type a note first.";
    return;
  }

  if (text.length > 200) {
    errorMessage.textContent =
      "Notes must be 200 characters or fewer.";
    return;
  }

  errorMessage.textContent = "";

  const note = {
    id: Date.now().toString() + Math.random().toString(36).slice(2),
    text: text,
    category: category,
    createdAt: new Date().toLocaleString()
  };

  notes.push(note);
  saveNotes();

  noteInput.value = "";
  render();
});

searchInput.addEventListener("input", render);

// Display saved notes when the page opens.
render();