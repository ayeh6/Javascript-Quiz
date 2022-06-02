let quizData;
let correctAnswer = ``;
let questionDisplayed = ``;
let quizDataIndex = 0;

let initials;
let highScores;

let secondsLeft = 0;
let timerInterval;
let timerElement = $(`#timer`);
let score = 0;

let finalScoreElement = $(`#final-score`);

let startScreen = $(`#start-screen`);
let questionScreen = $(`#question-body`);
let quizFinishScreen = $(`#quiz-finish`);
let highScoreScreen = $(`#high-scores`)

let questionElement = $(`#question`);
let choicesContainer = $(`#choices`);
let startButton = $(`#start-button`);

let initialsInputField = $(`#initials-input-field`);
let submitInitialsButton = $(`#submit-initials-button`);

let scoresContainer = $(`#scores-list`);
let goBackButton = $(`#go-back`);
let clearScoresButton = $(`#clear-scores`);

function storeScore() {
    initials = initialsInputField.val();
    highScores = JSON.parse(localStorage.getItem("highScores"));
    if(highScores != null) {
        highScores.push(`${initials} - ${score}`);
    }
    else {
        highScores = [`${initials} - ${score}`];
    }
    localStorage.setItem("highScores", JSON.stringify(highScores));
    showHighScores();
}

function showHighScores() {
    highScores = JSON.parse(localStorage.getItem("highScores"));    //grab high scores from local storage
    scoresContainer.empty();
    if(highScores != null) {    //if the list is not null
        for(let i=0; i<highScores.length; i++) {    //for each score, make a li and set text to the score, then append to ul
            let scoreListItem = $(`<li>`);
            scoreListItem.text(`${i+1}. ${highScores[i]}`);
            scoresContainer.append(scoreListItem);
        }
    }
    quizFinishScreen.css({'display': 'none'});
    highScoreScreen.css({'display': 'flex'});
}

function clearScores() {
    console.log("CLEAR");
    localStorage.clear();
    showHighScores();
}

function goBack() {
    timerElement.text(`Time: 100`);
    startScreen.css({'display': 'flex'});
    questionScreen.css({'display': 'none'});
    quizFinishScreen.css({'display': 'none'});
    highScoreScreen.css({'display': 'none'});
}

function setTime() {
    timerInterval = setInterval(function() {
        secondsLeft--;
        if(secondsLeft < 0) {
            secondsLeft = 0;
        }
        timerElement.text(`Time: ${secondsLeft}`);
        if(secondsLeft <= 0) {  //if time is up
            endQuiz();
        }
    }, 1000);
}

function startQuiz() {
    fetch(`./data/quizQuestions.json`)  //fetch json
    .then(function(response) {  //get response and turn into object
        return response.json();
    })
    .then(function(data) {
        quizData = data.quiz;   //grab quiz data
        quizDataIndex = 0;  //initialize index
        startScreen.css({'display': 'none'});       //clear the start screen
        questionScreen.css({'display': 'flex'});    //show the question screen
        secondsLeft = 100;  //initialize timer
        setTime();  //start timer
        displayQuestions(); //show question
    });
}

function endQuiz() {
    clearInterval(timerInterval);
    if(secondsLeft < 0) {
        secondsLeft = 0;
    }
    score = secondsLeft;
    finalScoreElement.text(`Final score: ${score}`);
    questionScreen.css({'display': 'none'});    //changes screen
    quizFinishScreen.css({'display': 'flex'});
}

function displayQuestions() {
    questionDisplayed = quizData[quizDataIndex].question;   //grab question from current index
    let choicesArray = quizData[quizDataIndex].choices;     //grab choices for current question
    correctAnswer = choicesArray[0];                        //grab correct answer

    let choicesRandomIndices = [];  //create an array from 0 to length-1 of choices
    for(let i=0; i<choicesArray.length; i++) {
        choicesRandomIndices.push(i);
    }
    choicesRandomIndices = choicesRandomIndices.sort(() => Math.random() - 0.5);    //randomize the choices indexes

    questionElement.text(questionDisplayed);    //set the question displayed on screen
    choicesContainer.empty();       //clear the choices

    for(let i=0; i<choicesArray.length; i++) {  //for each element in choicesArray, add the choice to the screen using the choicesRandomIndices to make the order random
        let choiceListItem = $(`<li>`);
        let choiceButton = $(`<button>`);
        choiceButton.text(choicesArray[choicesRandomIndices[i]]);
        choiceListItem.append(choiceButton);
        choicesContainer.append(choiceListItem);
    }
}

choicesContainer.on(`click`, function(event) {  //question choices listener
    let element = event.target; //grab element clicked on
    if(element.textContent !== correctAnswer) { //if answer is wrong, subtract 10 seconds from timer
        secondsLeft -= 10;
        if(secondsLeft < 0) {   //if timer is less than 0, set to 0
            secondsLeft = 0;
        }
        timerElement.text(`Time: ${secondsLeft}`);
    }
    quizDataIndex++;
    if(quizDataIndex < quizData.length) {
        displayQuestions();
    }
    else {
        endQuiz();
    }
});

startButton.on(`click`, startQuiz);   //start button listener
submitInitialsButton.on(`click`, storeScore);   //submit initials button listener
clearScoresButton.on(`click`, clearScores); //clear scores button listener
goBackButton.on(`click`, goBack);   //go back button listener