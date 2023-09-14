const url =
  "https://spotify23.p.rapidapi.com/user_profile/?id=jeff__10&playlistLimit=3&artistLimit=3";

// const customUrl = "";
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "09233979b3msh04ba480dba5a132p137c1ejsn90a2a952f17a",
    "X-RapidAPI-Host": "spotify23.p.rapidapi.com",
  },
};

let userQuery = "";
let userInput = document.querySelector(".userInput");
let userContainer = document.getElementById("userContainer");

let userImage = document.getElementById("userImage");
let userImageTwo = document.querySelector(".userImageTwo");
let userImageThree = document.querySelector(".userImageThree");

let imageWidth;
let imageHeight;

function getDefualtUser() {
  userQuery = "jeff__10";
  console.log(userQuery);
  accessUserData(userQuery);
}

function getInputValue() {
  // Selecting the input element and get its value
  let query = document.getElementById("inputId").value;
  userQuery = query.replaceAll(" ", "");
  if (query.includes("https")) {
    let question = query.indexOf("?");

    userQuery = query.substring(30, question);
  }
  console.log(userQuery);
  accessUserData(userQuery);
}

/**
 * Accesses the album art from the query via spotify api and pass the json to getUserArt()
 */
accessUserData = async (query) => {
  let url =
    "https://spotify23.p.rapidapi.com/user_profile/?id=" +
    query +
    "&playlistLimit=3&artistLimit=3";

  let response = await fetch(url, options);

  if (response.ok) {
    let json = await response.json();
    console.log(json);
    getUserArt(json);
  } else {
    console.log("Error: " + response.status);
  }
};

/**
 * Gets and sets the cover art url to img source code
 */
getUserArt = (response) => {
  // check if user has image
  userImage.src = response.image_url;
  userImage.setAttribute("crossOrigin", "");

  userImageTwo.src = response.image_url;
  userImageTwo.setAttribute("crossOrigin", "");

  userImageThree.src = response.image_url;
  userImageThree.setAttribute("crossOrigin", "");

  userImage.style.display = "flex";
  canvas.style.display = "";
  canvas2.style.display = "";
};

let button = document.getElementById("button");

button.addEventListener("click", function () {
  button.style.display = "none";
  userInput.classList.remove("userInput");
  userInput.classList.add("userInputStyles");

  userImage.src = "";
  userImage.style.display = "none";
  userImageTwo.src = "";

  userImageThree.src = "";

  canvas.style.display = "none";
  canvas2.style.display = "none";

  getInputValue();
});

// canvas stuff
const canvas = document.querySelector("#c1");
const context = canvas.getContext("2d");

const canvas2 = document.querySelector("#c2");
const context2 = canvas2.getContext("2d");

let width;
let height;

// set the number of canvas, scaled for screen resolution
let pxScale = window.devicePixelRatio;

canvas.width = userImage.clientWidth;
canvas.height = userImage.clientHeight;

canvas2.width = userImage.clientWidth;
canvas2.height = userImage.clientHeight;

// console.log(canvas.width, canvas.height);

function setup() {
  // fixed canvas size
  width = canvas.width;
  height = canvas.height;

  // set the CSS display size
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  canvas2.style.width = width + "px";
  canvas2.style.height = height + "px";

  canvas.width = width * pxScale;
  canvas.height = height * pxScale;

  canvas2.width = width * pxScale;
  canvas2.height = height * pxScale;

  // normalize the coordinate system
  context.scale(pxScale, pxScale);
  context2.scale(pxScale, pxScale);
}

let hue = Math.random() * 360;

// set the expected frame rate
let fps = 60; // frames per second
let previousTime = performance.now();

let frameInterval = 1000 / fps;
let deltaTimeMultiplier = 1;
// amount of time between animation function calls
let delta_time = 0;

function drawOne(currentTime) {
  deltaTime = currentTime - previousTime;
  // like devicePixelRatio for screen refresh rate
  deltaTimeMultiplier = deltaTime / frameInterval;

  // update color
  if (hue >= 360) {
    hue = 0;
  } else {
    hue += 0.5 * deltaTimeMultiplier;
  }

  previousTime = currentTime;

  // =====================================================CONTEXT 1=====================================================

  context.clearRect(0, 0, width, height);

  // drawing a bitmap image (x, y, width, height)
  context.drawImage(userImage, 0, 0, 250, 230);

  context.fillStyle = "hsla(" + hue + ", 100%, 50%, 0.6)";

  // pixel compositing
  context.globalCompositeOperation = "difference";
  // userImage.setAttribute("style", "filter: hue-rotate(3.142rad)");
  userImage.style.filter = "hue-rotate(3.142rad)";

  context.save();

  // canvas transformations
  context.scale(1.5, 1.5);
  context.translate(50, 0);

  // drawing an SVG path
  let path = new Path2D("M 20 20 L 100 20 L 175 125 L 120 180 z");
  // apply SVG path
  context.fill(path);

  context.restore();

  // access canvas pixel data
  let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  let data = imageData.data;

  // invert pixels
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i]; // red
    data[i + 1] = 255 - data[i + 1]; // green
    data[i + 2] = 255 - data[i + 2]; // blue
  }

  // draw canvas with changed pixels
  context.putImageData(imageData, 0, 0);

  requestAnimationFrame(drawOne);
}

function drawTwo(currentTime) {
  deltaTime = currentTime - previousTime;
  // like devicePixelRatio for screen refresh rate
  deltaTimeMultiplier = deltaTime / frameInterval;

  // update color
  if (hue >= 360) {
    hue = 0;
  } else {
    hue += 0.5 * deltaTimeMultiplier;
  }

  previousTime = currentTime;

  // =====================================================CONTEXT 1=====================================================

  context2.clearRect(0, 0, width, height);

  // drawing a bitmap image (x, y, width, height)
  context2.drawImage(userImage, 0, 0, 250, 230);

  context2.fillStyle = "hsla(" + hue + ", 100%, 50%, 0.6)";

  // pixel compositing
  context2.globalCompositeOperation = "difference";

  context2.save();

  // canvas transformations
  context2.scale(3, 3);
  context2.translate(-10, -10);

  // drawing an SVG path
  let path = new Path2D(
    "M 45 80 v -60 h 10 v 60 h -10 z m -25 -35 v 10 h 60 v -10 h -60 z m 2 26 l 50 -50 l 7 7 l -50 50 l -7 -7 z"
  );
  // apply SVG path
  context2.fill(path);

  context2.restore();

  // access canvas pixel data
  let imageData = context2.getImageData(0, 0, canvas2.width, canvas2.height);
  let data = imageData.data;

  // invert pixels
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i]; // red
    data[i + 1] = 255 - data[i + 1]; // green
    data[i + 2] = 255 - data[i + 2]; // blue
  }

  // draw canvas with changed pixels
  context2.putImageData(imageData, 0, 0);

  requestAnimationFrame(drawTwo);
}

// wait for the DOM to load, including dependent resources
window.addEventListener("load", () => {
  setup();
  window.requestAnimationFrame(drawOne);
  window.requestAnimationFrame(drawTwo);
  getDefualtUser();
});
