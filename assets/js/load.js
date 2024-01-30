var clearButton = document.querySelector("#clear");
var quizInfoEl = document.querySelector("#quiz-info");
var maxIndex = localStorage.getItem("index");

var loadScores = function (items) {
    var scoreList = document.createElement("div");
    var crownImg = document.createElement("img");
    scoreList.setAttribute("class", "scores");
    crownImg.setAttribute("src", "./assets/images/crown.svg");
    
    for (var i = 0; i < items.length; i++) {
        var scoreEl = document.createElement("p");
        scoreEl.innerHTML = "Name: " + items[i].name + "<br/>Score: " + items[i].score + "<br/>Time: " + items[i].time;
        if (i === 0) {
            scoreEl.setAttribute("class", "score top-score");
        } else {
            scoreEl.setAttribute("class", "score");
        }
        scoreList.appendChild(scoreEl);
    }
    
    if (maxIndex){
        quizInfoEl.appendChild(crownImg);
        quizInfoEl.appendChild(scoreList);
    } else {
        var msg = document.createElement("h3");
        msg.textContent = "There are currently no scores.";
        quizInfoEl.appendChild(msg);
    }
}

// function to get compose top 5 scores as an array and return them to score display function
// TODO: Fix bugs in the sorting algorithm
var getTopScores = function () {
    var top = [];
    var currentLength = top.length;

    // loop through all score items in local storage
    for (var i = -1; i < parseInt(maxIndex); i++) {
        var element = JSON.parse(localStorage.getItem("user" + (i + 1)));
        console.log(element);

        // ! if top has no items, push current element
        if (top.length === 0) {
            top.push(element);
        } else { // ! otherwise loop through current top items
            for (var k = 0; k < currentLength; k++) {

                // ? if current element is greater than current top item, splice it into it's indexed location
                if (element.score > top[k].score) {
                    top.splice(k, 0, element);
                    break;
                } else if (element.score == top[k].score) { // ? or if the scores are equal 

                    // * if current element time is greater than current top item, splice it into it's indexed location
                    if (element.time > top[k].time || element.time == top[k].time) {
                        top.splice(k, 0, element);
                    } else { // * otherwise splice it into 
                        top.splice(top.lastIndexOf(top[k].score), 0, element)
                    }
                    break;
                } else if (element.score < top[top.length - 1].score) { // ? otherwise push it onto the end
                    top.push(element);
                    break;
                }
            }
        }
        // adjust current length to the current top length
        // used to prevent endless loops
        currentLength = top.length;
    }

    // shorten length of top to the first five items
    while (top.length > 5) {
        top.pop();
    }
    return top;
}

// function to clear local storage
var clearScores = function () {
    localStorage.clear();
    location.reload();
}

// add event listener to clear scores button
clearButton.addEventListener("click", clearScores)

var topScores = getTopScores();
loadScores(topScores); // load scores in