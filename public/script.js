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
});


document.getElementById('rightClick').addEventListener('click', calendarStep)
document.getElementById('leftClick').addEventListener('click', calendarStep)


let date = new Date()
let month = date.getMonth()

const monthNameVaraible = date.toLocaleString('default', { month: 'long' })
document.getElementById('monthName').textContent = monthNameVaraible


function calendarStep(event){

    if(event.target.id === 'rightClick'){
        month++
    }
    else if(event.target.id === 'leftClick'){
        month--
    }
    createCalendar()
    let tempDate = new Date();
    tempDate.setMonth(month);
    const monthNameVaraible = tempDate.toLocaleString('default', { month: 'long' })
    console.log(monthNameVaraible)
    document.getElementById('monthName').textContent = monthNameVaraible
}

let year = date.getFullYear()

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
    let remainingDays = 7 - main.children.length % 7;
    if (remainingDays < 7) {
    for (let i = 1; i <= remainingDays; i++) {
        let newDay = dayTemplate.cloneNode(true)
        newDay.querySelector('.content p').textContent = i;
        main.appendChild(newDay)
    }
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



