window.onload = () => {
  const anchors = document.querySelectorAll("a");
  const transition_el = document.querySelector(".transition");

  setTimeout(() => {
    transition_el.classList.remove("is-active");
  }, 500);

  for (let i = 0; i < anchors.length; i++) {
    const anchor = anchors[i];

    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      let target = e.target.href;

      console.log(transition_el);

      transition_el.classList.add("is-active");

      console.log(transition_el);

      setInterval(() => {
        window.location.href = target;
      }, 500);
    });
  }
};

// ===================================================================FOR AUDIO===================================================================
const audio = document.querySelector("audio");
const stopButton = document.querySelector("#stop");

// create new audio context and create analyser
const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();

// getting the source
const source = audioCtx.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(audioCtx.destination);

// getting array with frequency values
analyser.fftSize = 2048;
// analyser.fftSize = 4096;
// analyser.fftSize = 8192;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
analyser.getByteTimeDomainData(dataArray);

// ====================================================================CANVAS=====================================================================
const canvas = document.getElementById("canvas1");
const context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight / 1.8;

// set the number of canvas, scaled for screen resolution
let pxScale = window.devicePixelRatio;
let width;
let height;

function setup() {
  // fixed canvas size
  width = canvas.width;
  height = canvas.height;

  // set the CSS display size
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  canvas.width = width * pxScale;
  canvas.height = height * pxScale;

  // normalize the coordinate system
  context.scale(pxScale, pxScale);
}

function draw() {
  context.clearRect(0, 0, width, height);
  let analyzer = analyser.getByteTimeDomainData(dataArray);
  context.fillStyle = "rgb(255, 255, 255";
  context.fillRect(0, 0, width, height);
  // waveFormData(analyzer);
  waveFormDataPoints(analyzer);
}

function randomRgbColor() {
  let r = Math.floor(Math.random() * (255 + 1));
  let g = Math.floor(Math.random() * (255 + 1));
  let b = Math.floor(Math.random() * (255 + 1));
  return `rgb(${r},${g},${b})`;
}

function waveFormData(analyzer) {
  context.lineWidth = 2;
  context.strokeStyle = "rgb(0, 0, 0)";
  context.beginPath();

  const sliceWidth = width / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 128.0;
    const y = v * (height / 2);

    if (i === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }

    x += sliceWidth;
  }

  // context.lineTo(width, height / 2);
  context.stroke();

  requestAnimationFrame(draw);
}

function waveFormDataPoints(analyzer) {
  // context.fillStyle = "#ff2626";
  // context.strokeStyle = "#ff2626";
  context.strokeStyle = randomRgbColor();
  context.beginPath();

  const sliceWidth = width / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 128.0;
    const y = v * (height / 2);

    if (i === 0) {
      // point(x, y, context);
      context.moveTo(x, y);
    } else {
      // context.lineTo(x, y);
      point(x, y, context);
    }

    x += sliceWidth;
  }
  context.stroke();

  // var p = new Particle()

  requestAnimationFrame(draw);
}

function point(x, y, context) {
  context.beginPath();
  context.arc(x, y, 1, 0, 4 * Math.PI, true);
  context.stroke();
}

const loaderContainer = document.querySelector(".loader-container");

// wait for the DOM to load, including dependent resources
window.addEventListener("load", () => {
  setup();
  window.requestAnimationFrame(draw);
  trackChoices.style.display = "none";
  backButton.style.display = "none";
});

canvas.addEventListener("click", () => {
  audio.play();
});

// canvas.addEventListener("mouseup", () => {
//   audio.pause();
//   cancelAnimationFrame(draw);
// });

// ===================================================================FOR INTERACTIONS & API===================================================================

let button = document.querySelector("button");
let inputcont = document.getElementById("inputcont");
let img1Disc = document.getElementById("img1-disc");
let img2Disc = document.getElementById("img2-disc");
let img3Disc = document.getElementById("img3-disc");

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "09233979b3msh04ba480dba5a132p137c1ejsn90a2a952f17a",
    "X-RapidAPI-Host": "spotify23.p.rapidapi.com",
  },
};

function getInputValue() {
  // Selecting the input element and get its value
  // loaderContainer.style.display = "block";
  let query = document.getElementById("inputVal").value;
  query = query.replaceAll(" ", "%20");
  console.log(query);
  accessTrackData(query);
}

accessTrackData = async (query) => {
  let url = `https://spotify23.p.rapidapi.com/search/?q=${query}&type=tracks&offset=0&limit=3`;

  let response = await fetch(url, options);

  if (response.ok) {
    let json = await response.json();
    // console.log(json);
    setTrackData(json);
  } else {
    console.log("Error: " + response.status);
  }
};

setTrackData = (response) => {
  let results = response.tracks.items;
  console.log(results);

  // for img1
  img1.src = results[0].data.albumOfTrack.coverArt.sources[0].url;
  img1.setAttribute("crossOrigin", "");
  img1.setAttribute("alt", results[0].data.id);
  img1Disc.innerHTML =
    '<i>"' +
    results[0].data.name +
    '"</i>' +
    "<br/>" +
    results[0].data.artists.items[0].profile.name;

  img2.src = results[1].data.albumOfTrack.coverArt.sources[0].url;
  img2.setAttribute("crossOrigin", "");
  img2.setAttribute("alt", results[1].data.id);
  img2Disc.innerHTML =
    '<i>"' +
    results[1].data.name +
    '"</i>' +
    "<br/>" +
    results[1].data.artists.items[0].profile.name;

  img3.src = results[2].data.albumOfTrack.coverArt.sources[0].url;
  img3.setAttribute("crossOrigin", "");
  img3.setAttribute("alt", results[2].data.id);
  img3Disc.innerHTML =
    '<i>"' +
    results[2].data.name +
    '"</i>' +
    "<br/>" +
    results[2].data.artists.items[0].profile.name;
  // loaderContainer.style.display = "none";
};

accessPreviewData = async (query) => {
  let url = `https://spotify23.p.rapidapi.com/tracks/?ids=${query}`;

  let response = await fetch(url, options);

  if (response.ok) {
    let json = await response.json();
    // console.log(json);
    setPreviewData(json);
  } else {
    console.log("Error: " + response.status);
  }
};

setPreviewData = (response) => {
  // console.log("prev", response);
  audio.src = response.tracks[0].preview_url;
};

let trackChoices = document.getElementById("track-choices");
let img1 = document.getElementById("img1");
let img2 = document.getElementById("img2");
let img3 = document.getElementById("img3");

button.addEventListener("click", function () {
  inputcont.setAttribute("style", "display:none !important");
  trackChoices.style.display = "flex";
  loaderContainer.classList.remove("loader-container");
  backButton.style.display = "none";
  getInputValue();
});

img1.addEventListener("click", () => {
  let trackId = img1.alt;
  accessPreviewData(trackId);

  trackChoices.setAttribute("style", "display:none !important");
  canvas.classList.remove("canvasDisplay");
  backButton.style.display = "flex";
  console.log("clicked image1");
});
img2.addEventListener("click", () => {
  let trackId = img2.alt;
  accessPreviewData(trackId);
  trackChoices.setAttribute("style", "display:none !important");
  canvas.classList.remove("canvasDisplay");
  backButton.style.display = "flex";
  console.log("clicked image2");
});
img3.addEventListener("click", () => {
  let trackId = img3.alt;
  accessPreviewData(trackId);
  trackChoices.setAttribute("style", "display:none !important");
  canvas.classList.remove("canvasDisplay");
  backButton.style.display = "flex";
  console.log("clicked image3");
});

// to go back
let backButton = document.getElementById("back-button");

backButton.addEventListener("click", () => {
  audio.src = "";
  canvas.classList.add("canvasDisplay");
  trackChoices.removeAttribute("style");
  backButton.style.display = "none";
});
