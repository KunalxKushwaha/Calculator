const display = document.getElementById('display');
let currentInput = '';
let previousInput = '';
let operator = '';
let shouldResetScreen = false; // Flag to check if screen needs to be reset after an operation

// Add event listeners for all buttons
document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', function () {
    const value = this.innerText;

    if (this.id === 'clear') {
      clearCalculator();
    } else if (this.id === 'backspace') {
      deleteLastChar();
    } else if (['+', '-', '*', '/'].includes(value)) {
      chooseOperator(value);
    } else if (this.id === 'equals') {
      calculate();
    } else if (this.id === 'decimal') {
      addDecimal();
    } else {
      appendNumber(value);
    }
  });
});

// Add keyboard support
window.addEventListener('keydown', handleKeyPress);

function handleKeyPress(e) {
  if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
  if (e.key === '.') addDecimal();
  if (e.key === '=' || e.key === 'Enter') calculate();
  if (e.key === 'Backspace') deleteLastChar();
  if (e.key === 'Escape') clearCalculator();
  if (['+', '-', '*', '/'].includes(e.key)) chooseOperator(e.key);
}

// Append a number to the display
function appendNumber(number) {
  if (shouldResetScreen) resetScreen();

  // Prevent leading zeros
  if (currentInput === '0' && number === '0') return;

  // Limit the length of the input to prevent overflow
  if (currentInput.length >= 12) return;

  currentInput += number;
  updateDisplay();
}

// Reset the display after an operator is chosen or after a result is shown
function resetScreen() {
  currentInput = '';
  shouldResetScreen = false;
}

// Update the display with the current input
function updateDisplay() {
  display.innerText = currentInput || '0';
}

// Clear the calculator and reset everything
function clearCalculator() {
  currentInput = '';
  previousInput = '';
  operator = '';
  shouldResetScreen = false;
  updateDisplay();
}

// Delete the last character from the current input
function deleteLastChar() {
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
}

// Handle operator input
function chooseOperator(op) {
  if (currentInput === '') return; // Prevent operator press with no input

  if (previousInput !== '') {
    calculate(); // Chain calculations
  }

  operator = op;
  previousInput = currentInput;
  shouldResetScreen = true; // Screen needs to reset for new input
}

// Add a decimal point, preventing multiple decimals
function addDecimal() {
  if (shouldResetScreen) resetScreen();
  if (!currentInput.includes('.')) {
    currentInput += '.';
  }
  updateDisplay();
}

// Perform the calculation and display the result
function calculate() {
  if (operator === '' || currentInput === '') return;

  const prev = parseFloat(previousInput);
  const curr = parseFloat(currentInput);

  if (isNaN(prev) || isNaN(curr)) return;

  let result;

  switch (operator) {
    case '+':
      result = prev + curr;
      break;
    case '-':
      result = prev - curr;
      break;
    case '*':
      result = prev * curr;
      break;
    case '/':
      result = curr === 0 ? 'Error' : prev / curr;
      break;
    default:
      return;
  }

  currentInput = result.toString();
  operator = '';
  previousInput = '';
  shouldResetScreen = true;

  updateDisplay();
}

// Prevents multiple operators and multiple decimal points
function preventInvalidInput() {
  if (currentInput.includes('.') && this.innerText === '.') return;
  if (operator !== '' && isNaN(parseFloat(this.innerText))) return;
}
