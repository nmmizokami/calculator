const numberOfInputs = 19;

const topLineDisplay = document.querySelector('.display_top-line');
const bottomLineDisplay = document.querySelector('.display_bottom-line');
const operatorAndNumberButtonsArray = document.querySelectorAll
        ('.operators-and-numbers_button');

for (let i = 0; i < numberOfInputs; ++i) {
    operatorAndNumberButtonsArray[i].addEventListener('click', () => {
        topLineDisplay.textContent += operatorAndNumberButtonsArray[i].textContent;
    })
}
