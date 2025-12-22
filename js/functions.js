
// Функция для проверки длины строки

const checksSringLength = (string, maxLength) => string.length <= maxLength;

checksSringLength ('проверяемая строка', 20);
checksSringLength ('проверяемая строка', 1);


// Функция для проверки, является ли строка палиндромом

const checkString = (string) => {
  let reversed = '';
  for (let i = string.length - 1; i >= 0; i--) {
    reversed += string[i];
  }
  return string === reversed;
};

checkString('кекс');
checkString('радар');


