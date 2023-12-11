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
    .then(response => {
        if (!response.ok) {
            // If response is not OK, throw an error to be caught in the catch block
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        var action = data.action;
        var time = data.time;
        var month = data.month;
        var day = data.day;
        var year = data.year;
        var name = data.name;
        console.log('name', action);
        let regExp = /\d+/g;
        let regExpText = /(delete|add)/g;
        let regExpTime = /[^,]+/g;
        var matchesAction = action.match(regExpText);
        var matchesDay = day.match(regExp);
        var matchesMonth = month.match(regExp);
        var matchesYear = year.match(regExp);
        var matchesTime = time.match(regExpTime);
        var matchesName = name.match(regExpTime);
        console.log("length:", matchesDay.length);
        for(let i = 0; i < matchesDay.length; i++){
            console.log(matchesAction.length);
            console.log(matchesAction[i]);
            modifyCalendar(matchesAction[i], matchesMonth[i], matchesDay[i], matchesYear[i], matchesTime[i], matchesName[i]);
        }
    })
    .catch(error => {
        // Display the error message sent from the server as an alert
        let errorMessage = error.errorMessage || 'An unknown error occurred';
        let chatMessage = error.chatMessage || 'No chat message available';
        alert(`Error: ${errorMessage}\nChat Message: ${chatMessage}`);
    });
}});


document.getElementById('rightClick').addEventListener('click', calendarStep)
document.getElementById('leftClick').addEventListener('click', calendarStep)
let date = new Date()
let month = date.getMonth()
let year = date.getFullYear()

function updateMonthName(month){
    const monthNameVaraible = month.toLocaleString('default', { month: 'long' })
    document.getElementById('monthName').textContent = monthNameVaraible
}


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
}

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

function modifyCalendar(action, currentMonth, day, currentYear, time, name){
    month = currentMonth
    year = currentYear
    console.log(month)
    createCalendar()
    let dayCheck = document.getElementsByClassName('day-number')
    if(action === "add"){
        for (let j = 0; j < dayCheck.length; j++) {
            if (dayCheck[j].textContent == day) {
                console.log('add event');
        
                // Create a new div element for the event
                let newEventDiv = document.createElement("div");
                newEventDiv.className = "event"; // Assign a class for styling if needed
                newEventDiv.textContent = name + " - " + time; // Set the content
        
                // Find the event content container for the current day
                let eventContentContainer = document.getElementsByClassName('eventContent')[j];
        
                // Append the new div to the event content container
                eventContentContainer.appendChild(newEventDiv);
            }
        }
    }

    else if(action === "delete"){
        for (let k = 0; k < dayCheck.length; k++) {
            if (dayCheck[k].textContent == day) {
                console.log('replaceDelete');
        
                // Get the event content container for the current day
                let eventContentContainer = document.getElementsByClassName('eventContent')[k];
        
                // Iterate over each event in the container
                Array.from(eventContentContainer.children).forEach(eventDiv => {
                    // Check if this event's name matches the one to delete
                    if (eventDiv.textContent.toLowerCase().includes(name.toLowerCase())) {
                        // Remove the event element
                        eventContentContainer.removeChild(eventDiv);
                    }
                });
            }
        }
    }
    else{
        console.log('error')
        return
    }
}
