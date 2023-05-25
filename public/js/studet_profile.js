
const joinButtons = document.querySelectorAll('.joinButton');
const stopButtons = document.querySelectorAll('.stopButton');
const timers = document.querySelectorAll('.stopwatch');
const intervalIds = [];

joinButtons.forEach((button, index) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    let seconds = 0;
    intervalIds[index] = setInterval(() => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
      timers[index].textContent = timeString;
      seconds += 1;
    }, 1000);
  });
});

stopButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    clearInterval(intervalIds[index]);
    console.log(timers[index].textContent);
    sendSessionData(index + 1); // pass session ID to sendSessionData function
  });
});

function sendSessionData(sessionId) {

  console.log('sendSessionData triggered')

  const name = document.getElementById("name").value;
  const usn = document.getElementById("usn").value;
  const sem = document.getElementById("sem").value;
  const sub_code = document.getElementById(`sub_code${sessionId}`).value;
  const sub_name = document.getElementById(`sub_name${sessionId}`).value;
  const sess_time = document.getElementById(`sess_time${sessionId}`).value;
  const total_time = timers[sessionId - 1].textContent;

  const data = {
    name,
    usn,
    sem,
    sub_code,
    sub_name,
    sess_time,
    total_time,
    session_id: sessionId // add session ID to data object
  };

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/updateAttendance");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log(xhr.responseText);
    }
  };
  xhr.send(JSON.stringify(data));
}


function sendSessionData(name, usn, sem, sub_code, sub_name, sess_time) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/updateAttendance");
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log(xhr.responseText);
    }
  };
  const data = JSON.stringify({
    name: name,
    usn: usn,
    sem: sem,
    sub_code: sub_code,
    sub_name: sub_name,
    sess_time: sess_time
  });
  xhr.send(data);
}
