var questionNum = 0;
var correctAnswers = 0;
var timeLeft = 75;
var quizEnded = false;
var userIndex;
var letterEquiv = ['A', 'B', 'C', 'D']
var startButton = document.querySelector("#start-btn");
var questionEl = document.querySelector("#quiz-prompt");
var introText = document.querySelector("#intro-text");
var questionBox = document.querySelector("#quiz-questions");
var quizContainer = document.querySelector("#quiz-container");
var correct = document.querySelector("#show-correct");
var timer = document.querySelector("#timer");

// function to detect if scores have already been saved
// if yes, then set userIndex to saved index, otherwise set to 0
if (localStorage.getItem("index")) {
    userIndex = parseInt(localStorage.getItem("index"));
    userIndex++;
} else {
    userIndex = 0;
}

// array of question objects
var questions = [
    {
        question: "What is NOT a Javascript data type?",
        answers: ["Boolean", "String", "Console", "Integers"],
        correct: "Console"
    },
    {
        question: "What Javascript method is used to select an element by its attribute?",
        answers: [".getAttribute()", ".setAttribute()", ".getSelector()", ".querySelector()"],
        correct: ".querySelector()"
    },
    {
        question: "Javascript is a ______-side language?",
        answers: ["Server", "Client", "Both", "Neither"],
        correct: "Both"
    },
    {
        question: "Which method is used to write an alert to the window?",
        answers: ["alert()", "sendAlert()", "prompt()", "message()"],
        correct: "alert()"
    },
    {
        question: "What best describes the '= = =' operator?",
        answers: ["set equal to", "strict equality", "equal to", "greater than"],
        correct: "strict equality"
    }
]

// function that handles starting the quiz
var startQuiz = function () {
    introText.remove();
    startButton.remove();
    questionEl.setAttribute("style", "text-align: left;");
    timer.textContent = timeLeft;

    countdown();
    loadQuestion();
}

// function that handles the timer
var countdown = function () {
    var startTimer = setInterval(function() {
        if (timeLeft > 1 && !quizEnded) {
            --timeLeft;
            timer.textContent = timeLeft;
        } else if (quizEnded) {
            clearInterval(startTimer);
        } else {
            --timeLeft;
            timer.textContent = timeLeft;
            clearInterval(startTimer);
            endQuiz();
        }
    }, 1000)
}

// function to handle when the quiz has ended
var endQuiz = function () {
    quizEnded = true;

    questionBox.remove();
    correct.remove();
    if (timeLeft > 1) {
        questionEl.innerHTML = "You finished the quiz with " + correctAnswers + " correct answers and " + timeLeft + " seconds remaining.<br/>Make sure to log your highscore!"
    } else {
        questionEl.innerHTML = "You finished the quiz with " + correctAnswers + " correct answers and " + timeLeft + " second remaining.<br/>Make sure to log your highscore!"
    }

    // create the score submission form elements
    var formEl = document.createElement("form");
    var nameInputEl = document.createElement("input");
    var submitButton = document.createElement("button");
    submitButton.setAttribute("type", "button");
    submitButton.textContent = "Submit";
    nameInputEl.setAttribute("type", "text");
    nameInputEl.setAttribute("placeholder", "Enter Your Name");
    
    formEl.appendChild(nameInputEl);
    formEl.appendChild(submitButton);
    quizContainer.appendChild(formEl);

    submitButton.addEventListener("click", function (event) {
        if (nameInputEl.value == "") {
            return;
        } else {
            submitScore(nameInputEl.value, correctAnswers, timeLeft);
        }
    }, false);
}

// function to randomize the order in which the answer buttons are added to each question
var shuffleAnswers = function (list) {
    var current = list.length,  randomIndex;
  
    while (current != 0) {
      randomIndex = Math.floor(Math.random() * current);
      current--;
      [list[current], list[randomIndex]] = [
        list[randomIndex], list[current]];
    }
  
    return list;
}

// this function handles loading questions
var loadQuestion = function () {
    var shuffledAnswers = shuffleAnswers(questions[questionNum].answers);

    // replace text and properties of answer buttons if the elements already exist
    if (questionBox.hasChildNodes()) {
        questionEl.textContent = questions[questionNum].question;
        for (var i = 0; i < 4; i++) {
            var targetAnswer = document.querySelector("button[data-answer-number='" + i + "']");
            targetAnswer.setAttribute("data-answer", shuffledAnswers[i]);
            targetAnswer.textContent = letterEquiv[i] + ". " + shuffledAnswers[i];
        }
    } else { // otherwise create them if it's the quiz just started
        questionEl.textContent = questions[questionNum].question;
        for (var i = 0; i < 4; i++) {
            var questionButton = document.createElement("button");
            questionButton.setAttribute("data-answer", questions[questionNum].answers[i]);
            questionButton.setAttribute("data-answer-number", i);
            questionButton.textContent = letterEquiv[i] + ". " + questions[questionNum].answers[i];
            questionBox.appendChild(questionButton);
        }
    }
}

// this function handles checking submitted answers for wrong or correct submissions
var checkAnswer = function (selected) {

    // if selected answer is correct, increment correctAnswers counter and relay 'correct' message
    if (selected.getAttribute("data-answer") == questions[questionNum].correct) {
        correctAnswers++;
        showCorrect("correct");
    } else { // otherwise subtract time from timer and relay 'wrong' message
        timeLeft -= 15;
        if (timeLeft > 0) {
            timer.textContent = timeLeft;
        } else {
            timeLeft = 0;
            timer.textContent = timeLeft;
        }
        showCorrect("wrong");
    }
}

// this function handles submitting scores to local storage
var submitScore = function (name, score, time) {
    var userData = {
        name: name,
        score: score,
        time: time
    }
    localStorage.setItem("index", userIndex);
    localStorage.setItem("user" + userIndex, JSON.stringify(userData));
    window.location.href="./scores.html"
}

// this function displays a message at the bottom at the screen after answering
var showCorrect = function (check) {
    correct.setAttribute("class", "message");

    if (check == "correct") {
        correct.textContent = "Correct!";
    } else if (check == "wrong") {
        correct.textContent = "Wrong!";
    }
}

// add event lister to start button
startButton.addEventListener("click", startQuiz);

// add event listeners to the answer buttons
questionBox.addEventListener("click", function (event) {
    var element = event.target;

    if (element.matches("button")) {
        checkAnswer(element);
        questionNum++;
        console.log(correctAnswers);
        if (questionNum < questions.length) {
            loadQuestion();
        } else {
            endQuiz();
        }
    }
});