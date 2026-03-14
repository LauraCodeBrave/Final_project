// Get the font selector element from the HTML (dropdown with id="fontPicker")
const fontPicker = document.getElementById("fontPicker");

// Apply selected font when the user changes the dropdown
fontPicker.addEventListener("change", function() {

  // Change the font of the entire page body to the selected font
  document.body.style.fontFamily = this.value;

  // Save the selected font in browser local storage
  // so it persists when the page reloads
  localStorage.setItem("selectedFont", this.value);
});


// Load previously selected font when the page finishes loading
window.addEventListener("load", function() {

  // Retrieve the saved font from local storage
  const savedFont = localStorage.getItem("selectedFont");

  // If a font was previously saved
  if (savedFont) {

    // Apply that font to the page
    document.body.style.fontFamily = savedFont;

    // Also update the dropdown to show the saved font
    fontPicker.value = savedFont;
  }
});



// Get the canvas element where stars will be drawn
const canvas = document.getElementById("constellationCanvas");

// Get the 2D drawing context from the canvas
// This is the object used to draw shapes, lines, circles, etc. ctx means:context
const ctx = canvas.getContext("2d");

// Set canvas size to fill the entire browser window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


// Array of poem objects that will be represented as stars
const poems = [

  // LOVE poems
  {title:"Love 1", content:"Love whispers softly through quiet hearts.", type:"classic", theme:"love"},
  {title:"Love 2", content:"Your name rests gently in my thoughts.", type:"classic", theme:"love"},
  {title:"Love 3", content:"Two souls wandering finally meet.", type:"classic", theme:"love"},
  {title:"Love 4", content:"In your eyes, galaxies bloom.", type:"classic", theme:"love"},

  // LIFE poems
  {title:"Life 1", content:"Life moves like rivers through silent valleys.", type:"classic", theme:"life"},
  {title:"Life 2", content:"Every sunrise writes a new beginning.", type:"classic", theme:"life"},
  {title:"Life 3", content:"Moments build the architecture of existence.", type:"classic", theme:"life"},
  {title:"Life 4", content:"Life is the art of becoming.", type:"classic", theme:"life"},

  // DEATH poems
  {title:"Death 1", content:"Silence falls where echoes once lived.", type:"classic", theme:"death"},
  {title:"Death 2", content:"Night carries the final breath of stars.", type:"classic", theme:"death"},
  {title:"Death 3", content:"The end is a door quietly opening.", type:"classic", theme:"death"},
  {title:"Death 4", content:"Ash returns to the patience of earth.", type:"classic", theme:"death"},

  // SADNESS poems
  {title:"Sadness 1", content:"Rain gathers where words once stood.", type:"classic", theme:"sadness"},
  {title:"Sadness 2", content:"A lonely wind walks through memory.", type:"classic", theme:"sadness"},
  {title:"Sadness 3", content:"The heart echoes in empty rooms.", type:"classic", theme:"sadness"},
  {title:"Sadness 4", content:"Grey clouds rest inside quiet souls.", type:"classic", theme:"sadness"},

  // HAPPINESS poems
  {title:"Happiness 1", content:"Laughter dances in the morning light.", type:"classic", theme:"happiness"},
  {title:"Happiness 2", content:"Joy blooms quietly like spring.", type:"classic", theme:"happiness"},
  {title:"Happiness 3", content:"Smiles scatter like bright stars.", type:"classic", theme:"happiness"},
  {title:"Happiness 4", content:"The heart shines when hope awakens.", type:"classic", theme:"happiness"}
];


// Generate a star for each poem
const stars = poems.map(poem => ({

  // Random X position across the canvas width
  x: Math.random() * canvas.width , 

  // Random Y position across the canvas height
  y: Math.random() * canvas.height ,

  // Size of the star (depends on poem type)
  radius: poem.type === "classic" ? 5 : 7,

  // Color of the star
  color: poem.type === "classic" ? "gold" : "rgba(255,215,0,0.7)",

  // Store the poem object inside the star
  poem: poem
}));


// Offset values used for dragging the constellation
let offsetX = 0, offsetY = 0;

// Stores the position where dragging started
let dragStart = null;


// DRAGGING FUNCTIONALITY


// When mouse button is pressed on canvas
canvas.addEventListener("mousedown", e => {

  // Save starting position relative to offset
  dragStart = {x: e.clientX - offsetX, y: e.clientY - offsetY};

  // Change cursor style
  canvas.style.cursor = "grabbing";
});


// When mouse button is released
canvas.addEventListener("mouseup", e => {

  // Stop dragging
  dragStart = null;

  // Reset cursor style
  canvas.style.cursor = "grab";
});


// When the mouse moves
canvas.addEventListener("mousemove", e => {

  // If dragging is active
  if(dragStart){

    // Update offset based on mouse movement
    offsetX = e.clientX - dragStart.x;
    offsetY = e.clientY - dragStart.y;

    // Redraw the stars at their new positions
    drawStars();
  }
});




// DRAW STARS FUNCTION


function drawStars(mouse=null){

  // Clear the entire canvas before redrawing
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Draw each star
  stars.forEach(s => {

    // Apply dragging offset to star position
    const x = s.x + offsetX;
    const y = s.y + offsetY;

    // Start drawing a path
    ctx.beginPath();

    // Draw a circular star math.pi means pi 3.14..(learned new mathematical methods so that the stars positions on the canva be accurate yet random)
    ctx.arc(x, y, s.radius, 0, Math.PI*2);

    // Set star color
    ctx.fillStyle = s.color;

    // Add glowing effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = s.color;

    // Fill the circle
    ctx.fill();

    // Close drawing path
    ctx.closePath();
  });


  // If the mouse is hovering
  if(mouse){

    // Check every star
    stars.forEach(s => {

      const x = s.x + offsetX;
      const y = s.y + offsetY;

      // Distance between mouse and star
      const on_x = mouse.x - x;
      const on_y = mouse.y - y;
      //math.sqrt: pythagorous theorem
      const distance = Math.sqrt(on_x*on_x+ on_y*on_y);

      // If mouse is close enough to the star
      if(distance < 15){

        const theme = s.poem.theme;

        // Connect stars with the same theme
        stars.forEach(other=>{

          if(other.poem.theme === theme && other !== s){

            const the_x = other.x + offsetX;
            const the_y = other.y + offsetY;

            ctx.beginPath();

            // Draw line between stars
            ctx.moveTo(x,y);
            ctx.lineTo(the_x,the_y);

            // Line style
            ctx.strokeStyle = "rgba(255,215,0,0.3)";
            ctx.lineWidth = 1;

            // Render the line .stroke is a drawing tool for canvas
            ctx.stroke();

            ctx.closePath();
          }
        });
      }
    });
  }
}




// HOVER DETECTION


// Track mouse movement to detect hovering
canvas.addEventListener("mousemove", e => {

  drawStars({x:e.clientX, y:e.clientY});
});


// CLICK TO OPEN POEM

canvas.addEventListener("click", e => {

  // Get canvas position relative to viewport
  const rec= canvas.getBoundingClientRect();

  // Mouse position inside the canvas
  const mouse={
    x:e.clientX -rec.left,
    y:e.clientY - rec.top
  };
   

  // Check each star
  for(let s of stars){

    const x = s.x + offsetX;
    const y = s.y + offsetY;

    const dx = mouse.x - x;
    const dy = mouse.y - y;

    // If mouse clicked near the star
    if(Math.sqrt(dx*dx+dy*dy) < s.radius + 5){

      // Show poem title
      document.getElementById("popupTitle").textContent = s.poem.title;

      // Show poem content
      document.getElementById("popupContent").textContent = s.poem.content;

      // Display the popup window
      document.getElementById("starPopup").classList.remove("hidden");

      break;
    }
  }
});



// CLOSE POPUP


// When close button is clicked
document.getElementById("closePopup").addEventListener("click", () => {

  // Hide the popup again
  document.getElementById("starPopup").classList.add("hidden");
});


// Initial drawing of stars when page loads
drawStars();