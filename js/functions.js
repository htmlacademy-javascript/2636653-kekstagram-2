
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


// Функция, которая определяет входит ли время встречи в рабочее время

const checkMeetingTime = (startWorkingDay, endWorkingDay, startMeeting, meetingDurationMinutes) => {
  const timeToMinutes = (time) => {
    const parts = time.split(':');
    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);
    return hours * 60 + minutes;
  };

  const workStart = timeToMinutes(startWorkingDay);
  const workEnd = timeToMinutes(endWorkingDay);
  const meetingStart = timeToMinutes(startMeeting);
  const meetingEnd = meetingStart + meetingDurationMinutes;

  return meetingStart >= workStart && meetingEnd <= workEnd;
};

checkMeetingTime('7:30', '16:30', '16:00', 20);

