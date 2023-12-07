window.onload = createCalendar
document.addEventListener('keypress', function(event) {
    if(event.key === "Enter" && document.getElementById('calendarInput').value != ''){
    const question = document.getElementById('calendarInput').value;
    document.getElementById('calendarInput').value = ""


    fetch('http://localhost:3000/calendar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({text: question}),
    })
    .then(response => response.json())
    .then(data => {
       console.log()
       modifyDOM(data);
    })
    .catch(error => console.error('Error:', error));
}
else{
    alert('Text box cant be empty!')    
}
});

let date = new Date()
let year = date.getFullYear()
let month = date.getMonth()

function createCalendar(){

    let firstDay = new Date(year, month, 1).getDay()
    let lastDate = new Date(year, month + 1, 0).getDate()
    let lastMonthLastDate = new Date(year, month, 0).getDate()
    var main = document.getElementById('calendarDays')
    var dayTemplate = document.querySelector('.dayofMonth')

    main.innerHTML = ''

    for(let i = 0; i < firstDay; i++){
        let newDay = dayTemplate.cloneNode(true)
        newDay.querySelector('.content p').textContent = lastMonthLastDate - firstDay + 1 + i
        main.appendChild(newDay)
    }

    for (let i = 1; i <= lastDate; i++) {
        let newDay = dayTemplate.cloneNode(true)
        newDay.querySelector('.content p').textContent = i
        main.appendChild(newDay)
    }
}

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]

function generateCalendar(){
    let firstDay = new Date(year, month, 1).getDay()
    let lastDate = new Date(year, month + 1, 0).getDate()
    let lastDay = new Date(year, month, lastDate).getDay()
    let monthLastDate = new Date(year, month, 0).getDate()
}


