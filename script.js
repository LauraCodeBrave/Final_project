

const fontPicker = document.getElementById("fontPicker");

// Apply selected font
fontPicker.addEventListener("change", function() {
  document.body.style.fontFamily = this.value;
  localStorage.setItem("selectedFont", this.value);
});

// Load previously selected font on page load
window.addEventListener("load", function() {
  const savedFont = localStorage.getItem("selectedFont");
  if (savedFont) {
    document.body.style.fontFamily = savedFont;
    fontPicker.value = savedFont;
  }
});

//ENVELOPE
async function openEnvelope() {
  const flap = document.querySelector(".flap");
  const letter = document.getElementById("letter");
  const poemText = document.getElementById("poem-text");

  flap.style.transform = "rotateX(180deg)";
  letter.style.top = "5%";

  const today = new Date().toDateString();
  const savedDate = localStorage.getItem("poemDate");
  const savedPoem = localStorage.getItem("poemContent");

  if (savedDate === today && savedPoem) {
    poemText.innerHTML = savedPoem;
    return;
  }

  poemText.innerHTML = "Loading poem...";

  try {
    const response = await fetch("https://poetrydb.org/random");
    const data = await response.json();
    const poem = data[0];

    const formattedPoem = `
      <strong>${poem.title}</strong><br>
      <em>by ${poem.author}</em><br><br>
      ${poem.lines.join("<br>")}
    `;

    poemText.innerHTML = formattedPoem;

    localStorage.setItem("poemDate", today);
    localStorage.setItem("poemContent", formattedPoem);

  } catch (error) {
    poemText.innerHTML = "Could not load poem. Try again.";
  }
}