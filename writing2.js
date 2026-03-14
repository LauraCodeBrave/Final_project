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

const editor = document.getElementById("poemEditor");
const saveBtn = document.getElementById("savePoemBtn");
const savedPoemsContainer = document.getElementById("savedPoems");

const rhymeInput = document.getElementById("rhymeInput");
const rhymeResults = document.getElementById("rhymeResults");

/* RHYME API */

rhymeInput.addEventListener("input", async ()=>{

const word = rhymeInput.value.trim();

if(word.length < 2){
rhymeResults.innerHTML="";
return;
}

const res = await fetch(`https://api.datamuse.com/words?rel_rhy=${word}`);
const data = await res.json();

rhymeResults.innerHTML="";

data.slice(0,10).forEach(w=>{
const li=document.createElement("li");
li.textContent=w.word;
rhymeResults.appendChild(li);
});

});

/* SAVE POEM */

function savePoem(){

//trim is the method used with strings to remove the extra spaces from the beginning and end of text so the text would be more organized 

const text = editor.value.trim();
if(text==="") return;

let poems = JSON.parse(localStorage.getItem("savedPoems")) || [];

poems.push(text);

localStorage.setItem("savedPoems", JSON.stringify(poems));

editor.value="";

loadPoems();

}

saveBtn.addEventListener("click",savePoem);

/* MEMORY WALL */

function loadPoems(){

savedPoemsContainer.innerHTML="";

let poems = JSON.parse(localStorage.getItem("savedPoems")) || [];

poems.forEach((poem,index)=>{

const frame=document.createElement("div");
frame.className="frame";

/* poem preview */

const text=document.createElement("div");
text.textContent = poem.substring(0,120)+"...";
frame.appendChild(text);

/* delete button */

const deleteBtn=document.createElement("button");
deleteBtn.textContent="❌";
deleteBtn.className="deleteBtn";

deleteBtn.addEventListener("click",(e)=>{
/*e : event*/

e.stopPropagation();

poems.splice(index,1);

localStorage.setItem("savedPoems",JSON.stringify(poems));

loadPoems();

});

frame.appendChild(deleteBtn);

/* when i click the frame the poem loads */

frame.addEventListener("click",()=>{
editor.value=poem;
});

savedPoemsContainer.appendChild(frame);

});

}

loadPoems();

/* typing animation */

editor.addEventListener("input",()=>{
editor.classList.add("typing");

setTimeout(()=>{
editor.classList.remove("typing");
},200);
});