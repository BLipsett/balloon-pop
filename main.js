let clickCount = 0;
let height = 120;
let width = 100;
let startButton = document.getElementById("start-button");
let inflateButton = document.getElementById("inflate-button");

let inflationRate = 20;
let maxSize = 300;
let currentPopCount = 0;
let gameLength = 5000;
let clockId = 0;
let timeRemaining = 0;
let highestPopCount = 0;
let currentPlayer = {};
let topScore = {};
let currrentColor = "red";
let possibleColors = ["green", "blue", "purple", "pink", "red"];

//#region region Game Logic

function startGame() {
  document.getElementById("game-controls").classList.remove("hidden");
  document.getElementById("main-controls").classList.add("hidden");
  document.getElementById("scoreboard").classList.add("hidden");
  startClock();

  setTimeout(stopGame, gameLength);
}

function startClock() {
  timeRemaining = gameLength;
  drawClock();
  clockId = setInterval(drawClock, 1000);
}

function stopClock() {
  clearInterval(clockId);
}

function drawClock() {
  let countdownElem = document.getElementById("countdown");
  countdownElem.innerText = (timeRemaining / 1000).toString();
  timeRemaining -= 1000;
}

function inflate() {
  clickCount++;
  height += inflationRate;
  width += inflationRate;
  checkBalloonPop();
  draw();
}

function checkBalloonPop() {
  if (height >= maxSize) {
    currentPopCount++;
    let balloonElement = document.getElementById("balloon");
    balloonElement.classList.remove(currrentColor);
    getRandomColor();
    balloonElement.classList.add(currrentColor);
    height = 0;
    width = 0;
    document.getElementById("pop-sound").play();
  }
}

function getRandomColor() {
  let i = Math.floor(Math.random() * possibleColors.length);

  currrentColor = possibleColors[i];
}
function draw() {
  let balloonElem = document.getElementById("balloon");
  let clickCountElem = document.getElementById("click-count");
  let popCountElem = document.getElementById("pop-count");
  let highPopCountElem = document.getElementById("high-pop");
  let playerNameElem = document.getElementById("player-name");

  playerNameElem.innerText = currentPlayer.name;
  highPopCountElem.innerText = currentPlayer.topScore.toString();
  popCountElem.innerText = currentPopCount.toString();
  clickCountElem.innerText = clickCount.toString();
  balloonElem.style.height = height + "px";
  balloonElem.style.width = `${width}px`;
}

function stopGame() {
  document.getElementById("game-controls").classList.add("hidden");
  document.getElementById("main-controls").classList.remove("hidden");
  document.getElementById("scoreboard").classList.remove("hidden");

  clickCount = 0;
  height = 120;
  width = 100;

  if (currentPopCount > currentPlayer.topScore) {
    currentPlayer.topScore = currentPopCount;
    savePlayers();
  }
  currentPopCount = 0;

  console.log(currentPopCount);
  console.log("stopped");

  stopClock();
  drawScoreboard();
  draw();
}

//#endregion

let players = [];
loadPLayers();

function setPlayerName(event) {
  event.preventDefault();
  console.log(event);

  let form = event.target;

  let playerName = form.playerName.value;

  currentPlayer = players.find((player) => player.name == playerName);

  if (!currentPlayer) {
    currentPlayer = { name: playerName, topScore: 0 };
    players.push(currentPlayer);
    savePlayers();
  }
  console.log(currentPlayer);
  form.reset();
  document.getElementById("game").classList.remove("hidden");
  form.classList.add("hidden");
  drawScoreboard();
  draw();
}

function savePlayers() {
  window.localStorage.setItem("players", JSON.stringify(players));
  window.localStorage.setItem(players.value, topScore);
  console.log(window.localStorage.player);
}
function changePlayer() {
  document.getElementById("playerForm").classList.remove("hidden");
  document.getElementById("game").classList.add("hidden");
}

function saveScore() {}

function loadPLayers() {
  let playersData = JSON.parse(window.localStorage.getItem("players"));
  if (!playersData) {
    players = [];
  } else players = playersData;
}

function drawScoreboard() {
  let template = "";

  players.sort((p1, p2) => p2.topScore - p1.topScore);

  players.forEach((player) => {
    template += `
    <div class="d-flex space-between">
    <span>${player.name}</span>
    <span>Top Score: ${player.topScore}</span>
    </div>`;
  });

  document.getElementById("players").innerHTML = template;
}

drawScoreboard();
//inflate();
