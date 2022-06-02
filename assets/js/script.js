let quizData;
let correctAnswer = ``;
let questionDisplayed = ``;
let quizDataIndex = 0;

let startScreen = $(`#start-screen`);
let questionScreen = $(`#question-body`);
let quizFinishScreen = $(`#quiz-finish`);
let highScoreScreen = $(`#high-scores`)

let questionElement = $(`#question`);
let choicesContainer = $(`#choices`);
let startButton = $(`#start-button`);

function startQuiz() {
    fetch(`./data/quizQuestions.json`)  //fetch json
    .then(function(response) {  //get response and turn into json
        return response.json();
    })
    .then(function(data) {
        quizData = data.quiz;
        quizDataIndex = 0;
        questionScreen.css({'display': 'flex'});
        displayQuestions();
    });
}

function displayQuestions() {   //display questions, marks correct one with a certain attribute, randomize choices
    questionDisplayed = quizData[quizDataIndex].question;   //grab question from current index
    let choicesArray = quizData[quizDataIndex].choices;     //grab choices for current question
    correctAnswer = choicesArray[0];                        //grab correct answer

    let choicesRandomIndices = [];                                //create an array from 0 to length-1 of choices
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
    let element = event.target;
    console.log(element.textContent);
    if(element.textContent === correctAnswer) {
        console.log('CORRECT');
        quizDataIndex++;
        displayQuestions();
    }
});

startButton.on(`click`, function() {        //start button listener
    startScreen.css({'display': 'none'});
    startQuiz();
})