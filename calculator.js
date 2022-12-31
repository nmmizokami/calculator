const numberOfInputs = 19;
let answer = 0;

const topLineDisplay = document.querySelector('.display_top-line');
const bottomLineDisplay = document.querySelector('.display_bottom-line');
const allClearButton = document.querySelector('.all-clear-button');
const backspaceButton = document.querySelector('.backspace-button');
const operatorAndNumberButtonsArray = document.querySelectorAll
        ('.operators-and-numbers_button');

/* Iterates through buttons nodelist to ...*/
//todo replace() ^ with ** using regex
for (let i = 0; i < numberOfInputs; ++i) {
    operatorAndNumberButtonsArray[i].addEventListener('click', () => {
        topLineDisplay.textContent += operatorAndNumberButtonsArray[i].textContent;
    })
}

/* Clears entire display */
allClearButton.addEventListener('click', () => {
    topLineDisplay.textContent = "";
});

/* Deletes last input from display */
backspaceButton.addEventListener('click', () => {
    topLineDisplay.textContent = topLineDisplay.textContent.slice
            (0, topLineDisplay.textContent.length - 1);
});

