const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");

let notes = [];

function render() {
  notesList.replaceChildren();

  notes.forEach(function (note) {
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

    listItem.append(
      noteText,
      categoryLabel,
      date,
      deleteButton
    );

    notesList.appendChild(listItem);
  });
}

noteForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = noteInput.value.trim();
  const category = noteCategory.value;

  const note = {
    id: Date.now().toString() + Math.random().toString(36).slice(2),
    text: text,
    category: category,
    createdAt: new Date().toLocaleString()
  };

  notes.push(note);
  render();

  noteInput.value = "";
});