const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let input = '';

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.textContent;

    if (value === 'C') {
      input = '';
      display.value = '';
    } else if (value === '=') {
      try {
        let result;

        if (input.includes('+')) {
          const [a, b] = input.split('+');
          result = parseFloat(a) + parseFloat(b);
        } else if (input.includes('-')) {
          const [a, b] = input.split('-');
          result = parseFloat(a) - parseFloat(b);
        } else if (input.includes('*')) {
          const [a, b] = input.split('*');
          result = parseFloat(a) * parseFloat(b);
        } else if (input.includes('/')) {
          const [a, b] = input.split('/');
          if (parseFloat(b) === 0) {
            result = 'Error';
          } else {
            result = parseFloat(a) / parseFloat(b);
          }
        } else {
          result = 'Invalid';
        }

        display.value = result;
        input = result.toString();
      } catch {
        display.value = 'Error';
        input = '';
      }
    } else {
      input += value;
      display.value = input;
    }
  });
});
