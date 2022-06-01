let quizData;
function getData(){
    fetch("./data/quizQuestions.json")  //fetch json
    .then(function(response) {  //get response and turn into json
        return response.json();
    })
    .then(function(data) {
        quizData = data;
    });
}

getData();
