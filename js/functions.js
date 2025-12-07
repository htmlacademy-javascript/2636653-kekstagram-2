
// Функция для проверки длины строки

const checksSringLength = (string, maxLeight) => {
  if (string.length <= maxLeight) {
    return true;
  }
  return false;
};

console.log(checksSringLength ('проверяемая строка', 20));
console.log(checksSringLength ('проверяемая строка', 1));


// Функция для проверки, является ли строка палиндромом

const checkString = string => {
  let reversed = '';
  for (let i = string.length - 1; i >= 0; i--) {
    reversed += string[i];
  }
  return string === reversed;
};

console.log(checkString("кекс"));


