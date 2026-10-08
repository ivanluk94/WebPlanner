  const firebaseConfig = {
    apiKey: "AIzaSyDbF6y02xaEPzvwtuBd3wm8s9Ndh-MM1CI",
    authDomain: "planner-8cedd.firebaseapp.com",
    projectId: "planner-8cedd",
    storageBucket: "planner-8cedd.firebasestorage.app",
    messagingSenderId: "196426784777",
    appId: "1:196426784777:web:f6c063c5532bf3fc22d8d8",
    databaseURL: "https://planner-8cedd-default-rtdb.firebaseio.com/"
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();

let cellOfDate = document.querySelectorAll('tr > td:nth-child(2)');
let tableRow = document.querySelectorAll('tr');

let start = new Date (2026, 9, 5);

let d = new Date();
d.setHours(0, 0, 0, 0);

let difference = Math.floor((d - start) / (1000 * 60 * 60 * 24));

if(difference >= 14)
{  
    let cycles = Math.floor(difference / 14);

    start.setDate(start.getDate() + (cycles * 14));
}

for (let i = 0; i < cellOfDate.length; i++)
{   
    let day = start.getDate();
    let month = start.getMonth() + 1;
    
    cellOfDate[i].innerHTML = `${day}.${month}`;
    start.setDate(start.getDate() + 1);
}


for (let i = 0; i < cellOfDate.length; i++)
{
    let [day, month] = cellOfDate[i].textContent.split('.').map(Number);

    let cellDate = new Date(d.getFullYear(), month - 1, day);

    if(d > cellDate)
    {
        tableRow[i].classList.add('past');
    }
    
    else tableRow[i].classList.remove('past');

    if(d.getDate() === day && d.getMonth() + 1 === month)
    {
        tableRow[i].classList.add('highlight');
    }
    else
        tableRow[i].classList.remove('highlight');
}

let taskCells = document.querySelectorAll('td[contenteditable="true"]');

taskCells.forEach(cell => {
    const taskId = cell.dataset.taskId;
    cell.addEventListener('input', () => {
        db.ref(`schedule/${taskId}`).set(cell.textContent);
    });
});

let notes = document.querySelector('#notes');

if(notes)
{
    notes.addEventListener('input', () => {
    db.ref('notes').set(notes.textContent);
  });
}

db.ref('schedule').on('value', (snapshot) => {
  const data = snapshot.val();
  if (data) {
    taskCells.forEach(cell => {
      const taskId = cell.dataset.taskId;
      if (data[taskId] !== undefined && document.activeElement !== cell) {
        cell.textContent = data[taskId];
      }
    });
  }
});

if (notes) {
  db.ref('notes').on('value', (snapshot) => {
    const text = snapshot.val();
    if (text !== null && document.activeElement !== notes) {
      notes.textContent = text;
    }
  });
}
