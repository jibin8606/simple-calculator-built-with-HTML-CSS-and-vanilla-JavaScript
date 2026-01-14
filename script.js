// Simple calculator logic (vanilla JS)
// Select UI elements
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousTextElement = document.querySelector('[data-previous]');
const currentTextElement = document.querySelector('[data-current]');

class Calculator {
  constructor(previousTextEl, currentTextEl){
    this.previousTextEl = previousTextEl;
    this.currentTextEl = currentTextEl;
    this.clear();
  }

  clear(){
    this.current = '';
    this.previous = '';
    this.operation = undefined;
  }

  delete(){
    this.current = this.current.toString().slice(0, -1);
  }

  appendNumber(number){
    if(number === '.' && this.current.includes('.')) return;
    // Prevent leading zeros like "000"
    if(number === '0' && this.current === '0') return;
    if(this.current === '0' && number !== '.') this.current = number;
    else this.current = this.current.toString() + number.toString();
  }

  chooseOperation(operation){
    if(this.current === '' && this.previous === '') return;
    if(this.current === '' && this.previous !== '') {
      this.operation = operation;
      return;
    }
    if(this.previous !== '') {
      this.compute();
    }
    this.operation = operation;
    this.previous = this.current;
    this.current = '';
  }

  compute(){
    const prev = parseFloat(this.previous);
    const current = parseFloat(this.current);
    if(isNaN(prev) || isNaN(current)) return;
    let computation;
    switch(this.operation){
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '*':
        computation = prev * current;
        break;
      case '/':
        computation = current === 0 ? 'Error' : prev / current;
        break;
      default:
        return;
    }
    this.current = computation.toString();
    this.operation = undefined;
    this.previous = '';
  }

  getDisplayNumber(number){
    if(number === '') return '';
    if(number === 'Error') return 'Error';
    const floatNum = parseFloat(number);
    if(isNaN(floatNum)) return number;
    const integerDigits = Math.trunc(floatNum);
    const decimalDigits = floatNum % 1 !== 0 ? number.toString().split('.')[1] : null;
    const intDisplay = integerDigits.toLocaleString();
    return decimalDigits != null ? `${intDisplay}.${decimalDigits}` : intDisplay;
  }

  updateDisplay(){
    this.currentTextEl.innerText = this.current === '' ? '0' : this.getDisplayNumber(this.current);
    if(this.operation != null && this.previous !== '') {
      this.previousTextEl.innerText = `${this.getDisplayNumber(this.previous)} ${this.operation}`;
    } else {
      this.previousTextEl.innerText = '';
    }
  }
}

const calculator = new Calculator(previousTextElement, currentTextElement);

// Wire up buttons
numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    // button.dataset.operation may be undefined for the "÷" or symbol buttons — prefer button.getAttribute if set
    const op = button.getAttribute('data-operation') || button.innerText;
    calculator.chooseOperation(op);
    calculator.updateDisplay();
  });
});

equalsButton.addEventListener('click', () => {
  calculator.compute();
  calculator.updateDisplay();
});

allClearButton.addEventListener('click', () => {
  calculator.clear();
  calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
  calculator.delete();
  calculator.updateDisplay();
});

// Keyboard support
window.addEventListener('keydown', (e) => {
  if((e.key >= '0' && e.key <= '9') || e.key === '.') {
    calculator.appendNumber(e.key);
    calculator.updateDisplay();
    return;
  }
  if(['+', '-', '*', '/'].includes(e.key)) {
    calculator.chooseOperation(e.key);
    calculator.updateDisplay();
    return;
  }
  if(e.key === 'Enter' || e.key === '=') {
    e.preventDefault();
    calculator.compute();
    calculator.updateDisplay();
    return;
  }
  if(e.key === 'Backspace') {
    calculator.delete();
    calculator.updateDisplay();
    return;
  }
  if(e.key === 'Escape') {
    calculator.clear();
    calculator.updateDisplay();
    return;
  }
});