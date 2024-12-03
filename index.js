const MAX_TRIES = 8;
const DISH_COUNT = 4;
const RESOURCE_PATH = "resources/";

const firstDish = document.getElementById("toBeGuessed1");
const secondDish = document.getElementById("toBeGuessed2");
const thirdDish = document.getElementById("toBeGuessed3");
const fourthDish = document.getElementById("toBeGuessed4");
const mainContainer = document.getElementById("mainContainer");
const lifeContainer = document.getElementById("lifeContainer");
const myButton = document.getElementById("myButton");
const description = document.getElementById("description");

description.innerText = `O, nu! Hipopotanței îi este puțin fomiță.
Deși în general basculează orice, azi are intoleranță la anumite mâncăruri. 
Ghicește ce feluri poate digera și evită-le pe cele care o balonează înainte să-i bubuie burtica!`;

let endedGame = false;
let currentTry = 0;
let chosenFood = [];
let guessedFood = Array(DISH_COUNT).fill("0");
let mainFood = ["1", "2", "3", "4", "5", "6", "7"];

function createBubble() {
  if (currentTry < MAX_TRIES) {
    const lifeDiv = document.createElement("div");
    lifeDiv.id = `life${currentTry}`;
    lifeDiv.className = "lifeDiv";
    lifeContainer.appendChild(lifeDiv);
  }
}

function getRandomDishes() {
  const numbers = [];
  while (numbers.length < DISH_COUNT) {
    const randomIndex = Math.floor(Math.random() * mainFood.length);
    if (!numbers.includes(randomIndex)) numbers.push(randomIndex);
  }
  chosenFood = numbers.map((index) => mainFood[index]);

  [firstDish, secondDish, thirdDish, fourthDish].forEach((dish) => {
    dish.setAttribute("src", `${RESOURCE_PATH}0.png`);
  });

}

getRandomDishes();

function endGame(situation) {
  endedGame = true;

  [firstDish, secondDish, thirdDish, fourthDish].forEach((dish, index) => {
    dish.setAttribute("src", `${RESOURCE_PATH}${chosenFood[index]}.png`);
  });

  myButton.innerText = "Joc nou";
  lifeContainer.style.justifyContent = "center";
  lifeContainer.style.alignItems = "center";

  const lastBubble = document.getElementById(`life${currentTry - 1}`);
  if (lastBubble) lifeContainer.removeChild(lastBubble);

  if (situation === "won"){
    lifeContainer.innerText = `AI CÂȘTIGAT DIN ${currentTry} ÎNCERCĂRI!`
    } else {
    hipopotanta.setAttribute("src","resources/boom.png")
    lifeContainer.innerText="VĂLEU! A POCNIT HIPOPOTANȚA!"
    }
}

function createGridElement() {
  if (currentTry > 0) {
    const previousTryRow = document.getElementById(`tryNo${currentTry}`);
    if (previousTryRow) mainContainer.removeChild(previousTryRow);
    createBubble();
  }

  currentTry++;
  const newRow = document.createElement("div");
  newRow.className = "toBeGuessedContainer";
  newRow.id = `tryNo${currentTry}`;
  mainContainer.appendChild(newRow);

  for (let i = 1; i <= DISH_COUNT; i++) {
    const squareElement = document.createElement("img");
    squareElement.id = `square${currentTry}-${i}`;
    squareElement.className = "toBeGuessedDiv";
    squareElement.setAttribute("src", `${RESOURCE_PATH}${guessedFood[i - 1]}.png`);

    if (guessedFood[i - 1] === "0") {
      squareElement.addEventListener("click", (event) =>
        changeColor(event.target.id)
      );
    }
    newRow.appendChild(squareElement);
  }
}

createGridElement();

function changeColor(id) {
  const square = document.getElementById(id);
  if (!id.startsWith(`square${currentTry}`)) return;

  const currentSrc = square.getAttribute("src");
  let foodIndex = mainFood.indexOf(currentSrc.replace(`${RESOURCE_PATH}`, "").replace(".png", ""));

  foodIndex = (foodIndex + 1) % mainFood.length; 
  square.setAttribute("src", `${RESOURCE_PATH}${mainFood[foodIndex]}.png`);
}

function checkResult() {
  if (endedGame) {
    location.reload();
    return;
  }

  let isCorrect = true;
  for (let i = 1; i <= DISH_COUNT; i++) {
    const square = document.getElementById(`square${currentTry}-${i}`);
    const selectedDish = square.getAttribute("src").replace(`${RESOURCE_PATH}`, "").replace(".png", "");

    if (selectedDish !== chosenFood[i - 1]) {
      isCorrect = false;
    } else {
      guessedFood[i - 1] = chosenFood[i - 1];
      const dishIndex = mainFood.indexOf(chosenFood[i - 1]);
      if (dishIndex >= 0) mainFood.splice(dishIndex, 1); 
    }
  }

  if (isCorrect) {
    endGame("won");
  } else if (currentTry === MAX_TRIES) {
    endGame("lost");
  } else {
    createGridElement();
  }
}
