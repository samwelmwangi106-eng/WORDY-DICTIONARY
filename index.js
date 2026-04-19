const form = document.getElementById("searchForm");
const input = document.getElementById("wordInput");
const result = document.getElementById("result");

// SEARCH
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const word = input.value.trim();
  fetchWord(word);
});

// FETCH WORD
function fetchWord(word) {
  result.innerHTML = "Loading...";

  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(res => {
      if (!res.ok) {
        throw new Error("Word not found");
      }
      return res.json();
    })
    .then(data => {
      displayWord(data[0]);
    })
    .catch(error => {
      result.innerHTML = `<p style="color:red;">${error.message}</p>`;
    });
}

// DISPLAY WORD
function displayWord(data) {
  const word = data.word;
  const phonetic = data.phonetic || "";
  const audio = data.phonetics.find(p => p.audio)?.audio || "";
  const meaning = data.meanings[0];
  const partOfSpeech = meaning.partOfSpeech;
  const definition = meaning.definitions[0].definition;
  const example = meaning.definitions[0].example || "No example available";
  
  result.innerHTML = `
    <div class="result-card">
      <h2>${word}</h2>

      <p><strong>Pronunciation:</strong> ${phonetic}</p>

      ${audio ? `<button onclick="playAudio('${audio}')">🔊 Play Audio</button>` : ""}

      <p><strong>Part of Speech:</strong> ${partOfSpeech}</p>
      <p><strong>Definition:</strong> ${definition}</p>
      <p><strong>Example:</strong> ${example}</p>
      
      <button onclick="saveWord('${word}')">⭐ Save</button>
    </div>
  `;
}

// PLAY AUDIO
function playAudio(audioUrl) {
  const audio = new Audio(audioUrl);
  audio.play();
}

// SAVE WORD
function saveWord(word) {
  let saved = JSON.parse(localStorage.getItem("words")) || [];

  if (!saved.includes(word)) {
    saved.push(word);
    localStorage.setItem("words", JSON.stringify(saved));
    displaySavedWords();
  }
}

// DISPLAY SAVED WORDS
function displaySavedWords() {
  const list = document.getElementById("savedWords");
  let saved = JSON.parse(localStorage.getItem("words")) || [];

  list.innerHTML = "";

  saved.forEach(word => {
    const li = document.createElement("li");
    li.textContent = word;

    // click to search again
    li.onclick = () => fetchWord(word);

    list.appendChild(li);
  });
}

// LOAD SAVED WORDS ON START
window.onload = displaySavedWords;