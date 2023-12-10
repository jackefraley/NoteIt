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
        var action = data.action
        var time = data.time
        var month = data.month
        var day = data.day
        var year = data.year
        var name = data.name
        var numOfEvents = data.numOfEvents
        console.log(numOfEvents)
        console.log('name', day)
        let regExp = /\d+/g;
        let regExpText = /[^,]+/g;
        var matchesDay = day.match(regExp);
        var matchesMonth = month.match(regExp);
        var matchesYear = year.match(regExp);
        var matchesTime = time.match(regExpText);
        console.log(time)
        console.log("length:", matchesDay.length)
        for(i = 0; i < matchesDay.length; i++){
            console.log(matchesTime.length)
            modifyCalendar(action, matchesMonth[i], matchesDay[i], matchesYear[i], matchesTime[i], name)
        }
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

    if(event.target.id === 'rightClick'|| event === 'rightClick'){
        console.log(month%12 + 1)
        if((month%12 + 1) == 12){
            year++
        }
        month++
    }
    else if(event.target.id === 'leftClick'){
        if((month%12 + 1) == 1){
            year--
        }
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
    document.getElementById('month-number').innerHTML = month%12 + 1
    document.getElementById('year-number').innerHTML = year
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

function modifyCalendar(action, month, day, year, time, name){
    console.log(time)
    let dayCheck = document.getElementsByClassName('day-number')
    if(action === "add"){
        for(j = 0; j < dayCheck.length; j++){
            if(dayCheck[j].textContent === day){
                document.getElementsByClassName('eventContent')[j].innerHTML = name + " - " + time
                return;
            }
        }
    }
    else if(action === "change"){

    }
    else if(action === "delete"){
        for(j = 0; j < dayCheck.length; j++){
            if(dayCheck[j].textContent === day){
                document.getElementsByClassName('eventContent')[i].innerHTML = ''
                return
            }
        }
    }
    else{
        console.log('error')
        return
    }
}
