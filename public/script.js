document.addEventListener('keypress', function(event) {
    if(event.key === "Enter"){
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
//test changes


function modifyDOM(response){
    //const responseContainer = document.getElementById('response');
    //console.log(response)

    if (response.action === 'add') {
        addElement()
    } else if (response.action === 'remove') {
        removeElement()
    } else if(response.action === 'unknown') {
        console.log('error')
    }
}



function addElement() {
    console.log('added');

    // Create a new input element
    var newElement = document.createElement('input');
    newElement.type = 'text';
    newElement.placeholder = 'Second Input';

    // Append the new element to the container
    var container = document.getElementById('additionalInputs');
    container.appendChild(newElement);
}
function removeElement(){
    var container = document.getElementById('additionalInputs')
    console.log('remove ran')
    if(container.lastChild){
    container.removeChild(container.lastChild)
    }
}