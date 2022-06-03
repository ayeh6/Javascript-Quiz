let quizData;
let correctAnswer = ``;
let questionDisplayed = ``;
let quizDataIndex = 0;
let quizRandomIndices;

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
let headerElement = $(`#top-bar`);

let questionElement = $(`#question`);
let choicesContainer = $(`#choices`);
let startButton = $(`#start-button`);

let initialsInputField = $(`#initials-input-field`);
let submitInitialsButton = $(`#submit-initials-button`);

let scoresContainer = $(`#scores-list`);
let goBackButton = $(`#go-back`);
let clearScoresButton = $(`#clear-scores`);

let viewHighScoresAnchor = $(`#high-score-link`);

let rightWrongResponseElement = $(`#right-wrong-response`);

function answerResponse(answer) {
    if(rightWrongResponseElement.is(':animated')) {
        rightWrongResponseElement.stop().animate({opacity:'100'});
    }
    rightWrongResponseElement.text(answer);
    rightWrongResponseElement.css({'display': 'block'});
    rightWrongResponseElement.fadeOut(600);
}

function randomizeQuestions() {
    quizRandomIndices = [];
    for(let i=0; i<quizData.length; i++) {  //initialize list of indices from 0 to quizData.length-1
        quizRandomIndices.push(i);
    }
    quizRandomIndices = quizRandomIndices.sort(() => Math.random() - 0.5);  //randomize the array
}

function storeScore() {
    initials = initialsInputField.val();    //takes value of initials input
    if(initials === ``) {   //if empty give an alert
        alert(`Please enter your initials`);
        return;
    }

    highScores = JSON.parse(localStorage.getItem("highScores"));    //grab scores from local storage
    if(highScores != null) {    //if not null, store score in `initials - score` format
        highScores.push(`${initials} - ${score}`);
    }
    else {  //if local storage is null, create new array and store score in format
        highScores = [`${initials} - ${score}`];
    }

    localStorage.setItem("highScores", JSON.stringify(highScores)); //store the scores into storage
    quizFinishScreen.css({'display': 'none'});  //clear the screen
    showHighScores();   //view the high scores
}

function showHighScores() {
    highScores = JSON.parse(localStorage.getItem("highScores"));    //grab high scores from local storage
    scoresContainer.empty();    //empty current list on screen
    if(highScores != null) {    //if the list is not null
        for(let i=0; i<highScores.length; i++) {    //for each score, make a li and set text to the score, then append to ul
            let scoreListItem = $(`<li>`);
            scoreListItem.text(`${i+1}. ${highScores[i]}`);
            scoresContainer.append(scoreListItem);
        }
    }   //else does nothing

    headerElement.css({'display': 'none'}); //hide header element
    highScoreScreen.css({'display': 'flex'});   //display high score screen
}

function clearScores() {
    localStorage.clear();   //clear local storage
    showHighScores();   //re-render scores onto screen
}

function goBack() {
    highScoreScreen.css({'display': 'none'});   //hide scores screen
    timerElement.text(`Time: 100`); //reset timer element
    headerElement.css({'display': 'flex'}); //show header element
    startScreen.css({'display': 'flex'});   //show start screen
}

function setTime() {
    timerInterval = setInterval(function() {    //set timer
        secondsLeft--;  //decrement timer
        if(secondsLeft < 0) {   //if timer is negative, set to 0
            secondsLeft = 0;
        }
        timerElement.text(`Time: ${secondsLeft}`);  //display current time

        if(secondsLeft <= 0) {  //if time is up
            endQuiz();  //end the quiz
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
        randomizeQuestions();
        setTime();  //start timer
        displayQuestions(); //show question
    });
}

function endQuiz() {
    clearInterval(timerInterval);   //clear any current timers
    if(secondsLeft < 0) {   //if negative, set to 0
        secondsLeft = 0;
    }
    score = secondsLeft;    //set score to time left
    initialsInputField.val('');
    finalScoreElement.text(`Final score: ${score}`);    //sets text of final score
    questionScreen.css({'display': 'none'});    //change screen
    quizFinishScreen.css({'display': 'flex'});
}

function displayQuestions() {
    questionDisplayed = quizData[quizRandomIndices[quizDataIndex]].question;   //grab question from current index
    let choicesArray = quizData[quizRandomIndices[quizDataIndex]].choices;     //grab choices for current question
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
        timerElement.text(`Time: ${secondsLeft}`);  //display time after penalty
        answerResponse(`Incorrect`);
        if(secondsLeft <= 0) { //if time 0 or less, end quiz
            endQuiz();
        }
    }
    else {
        answerResponse(`Correct!`);
    }
    quizDataIndex++;    //go to next question
    if(quizDataIndex < quizData.length) {   //if not end of questions list, display question
        displayQuestions();
    }
    else {  //else end quiz
        endQuiz();
    }
});

viewHighScoresAnchor.on(`click`, function() {   //view high scores listener
    clearInterval(timerInterval);   //clear timer if there is one active
    startScreen.css({'display': 'none'});   //set every display to none
    questionScreen.css({'display': 'none'});
    quizFinishScreen.css({'display': 'none'});
    showHighScores();   //view high scores
});

startButton.on(`click`, startQuiz);   //start button listener
submitInitialsButton.on(`click`, storeScore);   //submit initials button listener
initialsInputField.on(`keypress`, function(event) {
    if(event.which === 13) {
        storeScore();
    }
});
clearScoresButton.on(`click`, clearScores); //clear scores button listener
goBackButton.on(`click`, goBack);   //go back button listener