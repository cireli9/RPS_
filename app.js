let userScore = 0; /*caching the dom*/
let computerScore = 0;
const userScore_span = document.getElementById("user-score"); /*dom variables*/
const computerScore_span = document.getElementById("computer-score");
const scoreBoard_div = document.querySelector(".score-board");
const result_p = document.querySelector(".result > p");
const rock_div = document.getElementById("r");
const paper_div = document.getElementById("p");
const scissors_div = document.getElementById("s");

function getComputerChoice() {
    const choices = ['r', 'p', 's'];
    const val = Math.floor(Math.random()*3);
    return choices[val];
}

function ctoW(choice) {
    if (choice === "r") return "Rock";
    if (choice === "p") return "Paper";
    if (choice === "s") return "Scissors";
}

function end(outcome, userChoice, computerChoice) {
    const smallUserWord = "user".fontsize(3).sup();
    const smallCompWord = "comp".fontsize(3).sup();
    const userChoice_div = document.getElementById(userChoice)
    if (outcome == "u") {
        userScore++;
        userScore_span.innerHTML = userScore;
        result_p.innerHTML = `${ctoW(userChoice)}${smallUserWord} beats ${ctoW(computerChoice)}${smallCompWord}. You Win!`
        userChoice_div.classList.add('green-glow');
        setTimeout(() => userChoice_div.classList.remove('green-glow'), 300)
    }
    if (outcome == "c") {
        computerScore++;
        computerScore_span.innerHTML = computerScore;
        result_p.innerHTML = `${ctoW(userChoice)}${smallUserWord} loses to ${ctoW(computerChoice)}${smallCompWord}. You Lose...`
        userChoice_div.classList.add('red-glow');
        setTimeout(() => userChoice_div.classList.remove('red-glow'), 300)
    }
    if (outcome == "") {
        result_p.innerHTML = `${ctoW(userChoice)}${smallUserWord} ties ${ctoW(computerChoice)}${smallCompWord}. It's a draw.`
        userChoice_div.classList.add('gray-glow');
        setTimeout(() => userChoice_div.classList.remove('gray-glow'), 300)
    }
}

function game(userChoice) {
    const computerChoice = getComputerChoice();
    switch (userChoice + computerChoice) {
        case "rs":
        case "pr":
        case "sp":
            end("u", userChoice, computerChoice);
            break;
        case "sr":
        case "rp":
        case "ps":
            end("c", userChoice, computerChoice);
            break;
        case "rr":
        case "ss":
        case "pp":
            end("", userChoice, computerChoice);
            break;
    }
}


function main() {

    /*display current private ip address with blank superscript to preserve formatting*/
    var id1 = document.getElementById('ip1').innerHTML;
    document.getElementById("ip").innerHTML = `Currently playing on ip: ${id1}${"".fontsize(3).sup()}`;

    rock_div.addEventListener('click', function() {
        game("r");
    })

    paper_div.addEventListener('click', function() {
        game("p");
    })

    scissors_div.addEventListener('click', function() {
        game("s");
    })
}

main();