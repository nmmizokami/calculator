const numberOfInputButtons = 19;
let answer;

const topLineDisplay = document.querySelector('.display_top-line');
const bottomLineDisplay = document.querySelector('.display_bottom-line');
const allClearButton = document.querySelector('.all-clear-button');
const backspaceButton = document.querySelector('.backspace-button');
const equalsButton = document.querySelector('.equals-button');
const operatorAndNumberButtonsArray = document.querySelectorAll
        ('.operators-and-numbers_button');

/* Iterates through buttons nodelist to add functionality to input buttons */
for (let i = 0; i < numberOfInputButtons; ++i) {
    operatorAndNumberButtonsArray[i].addEventListener('click', () => {
        // Clear display if a calculation has just been made and another number input
        if (/[0-9\.]/.test(operatorAndNumberButtonsArray[i].textContent) === true &&
                bottomLineDisplay.textContent != "") {
            topLineDisplay.textContent = "";
            bottomLineDisplay.textContent = "";
        }

        // Clear topline and move bottom line up if calc has just been made and another 
        // operator input
        if (bottomLineDisplay.textContent != "" &&
                /[×÷+\-/*()^]/.test(operatorAndNumberButtonsArray[i].textContent) === true) {
            topLineDisplay.textContent = bottomLineDisplay.textContent;
            bottomLineDisplay.textContent = "";
        }

        topLineDisplay.textContent += operatorAndNumberButtonsArray[i].textContent;
    })
}

/* Clears entire display */
allClearButton.addEventListener('click', () => {
    topLineDisplay.textContent = "";
    bottomLineDisplay.textContent = "";
});

/* Deletes last input from display */
backspaceButton.addEventListener('click', () => {
    if (bottomLineDisplay.textContent.length != 0) {
        topLineDisplay.textContent = "";
        bottomLineDisplay.textContent = "";
    }
    else {
        topLineDisplay.textContent = topLineDisplay.textContent.slice
                (0, topLineDisplay.textContent.length - 1);
    }
});

/* Evaluates the function when '=' is pressed */
equalsButton.addEventListener('click', () => {
    bottomLineDisplay.textContent = evaluate(topLineDisplay.textContent);
});

/* 
   Implementation of evaluator function that first converts infix notation 
   To Reverse Polish Notation (RPN) and second, evalutes the expression using
   the Shunting Yard Algorithm
   
   Credit to Chidi Williams for this specific implementation
   https://chidiwilliams.com/post/evaluator/
*/

/* Tokenization converts the infix expression string into an array of tokens */
function tokenize(input) {
    let scanner = 0;
    const tokens = [];
    
    while (scanner < input.length) {
        const char = input[scanner];

        if (/[0-9]/.test(char)) {
            let digits = '';

            // Starting from current position, check if multiple digits compose a 
            // single number using RegExp.prototype.test() and parse them as a single number
            while (scanner < input.length && /[0-9\.]/.test(input[scanner])) {
                digits += input[scanner++];
            }

            const number = parseFloat(digits);
            tokens.push(number);
            continue;
        }

        // Check for mathematical operators and push to tokens array
        if (/[+\-/*()^]/.test(char)) {
            tokens.push(char);
            scanner++;
            continue;
        }

        // Check for '&plus;', '&divide;', '&times;', '&minus;'      
        if (char === '×') {
            tokens.push('*');
            scanner++;
            continue;
        }

        if (char === '÷') {
            tokens.push('/');
            scanner++;
            continue;
        }

        // Check for whitespace and skip
        if (char === ' ') {
            scanner++;
            continue;
        }

        throw new Error(`Invalue token ${char} at position ${scanner}`);
    }

    return (tokens);
}

/* Function that converts infix notation to RPN */
function toRPN(tokens) {
    const operators = [];
    const out = [];

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        if (typeof token === 'number') {
            out.push(token);
            continue;
        }

        if (/[+\-/*<>=^]/.test(token)) {
            while (shouldUnwindOperatorStack(operators, token)) {
                out.push(operators.pop());
            }
            operators.push(token);
            continue;
        }

        if (token === '(') {
            operators.push(token);
            continue;
        }

        if (token === ')') {
            while (operators[operators.length - 1] !== '(') {
                out.push(operators.pop());
            }
            operators.pop();
            continue;
        }

        throw new Error(`Unparsed token ${token} at position ${i}`)
    }

    for (let i = operators.length - 1; i >= 0; i--) {
        out.push(operators[i]);
    }

    return out;
}

const precedence = { '*': 2, '/': 2, '+': 1, '-': 1};

function shouldUnwindOperatorStack(operators, nextToken) {
    if (operators.length === 0)
        return false;

    const lastOperator = operators[operators.length - 1];
    return precedence[lastOperator] >= precedence[nextToken];
}

/* Function that takes as input an expression in RPN format and evaluates
   from left to right */
function evalRPN(rpn) {
    const stack = [];

    for (let scanner = 0; scanner < rpn.length; scanner++) {
        const token = rpn[scanner];

        if (/[+\-/*^]/.test(token)) {
            stack.push(operate(token, stack));
            continue;
        }

        // Push to stack if token is a number
        stack.push(token);
    }

    return stack.pop();
}

function operate(operator, stack) {
    const a = stack.pop();
    const b = stack.pop();

    switch (operator) {
        case '+':
            return b + a;
        case '-':
            return b - a;
        case '*':
            return b * a;
        case '/':
            return b / a;
        case '^':
            return b ** a;
        default:
            throw new Error(`Invalid operator: ${operator}`);

    }
}

function evaluate(input) {
    return evalRPN(toRPN(tokenize(input)));
}