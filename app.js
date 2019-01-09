let userScore = 0; /*caching the dom*/
let computerScore = 0;
const userScore_span = document.getElementById("user-score"); /*dom variables*/
const computerScore_span = document.getElementById("computer-score");
const scoreBoard_div = document.querySelector(".score-board");
const choice_div = document.querySelector(".choices");
const result_p = document.querySelector(".result > p");
const rock_div = document.getElementById("r");
const paper_div = document.getElementById("p");
const scissors_div = document.getElementById("s");

function getComputerChoice(data) {
  var val = 0;
  const choices = ["r", "p", "s"];
  if (data.Rock == 0 && data.Paper == 0 && data.Scissors == 0) {
    val = Math.floor(Math.random() * 3);
  }
  else {
    val = Math.floor(Math.random() * (data.Rock+data.Paper+data.Scissors));
    if (val < data.Rock) val = 0;
    if (val < data.Rock + data.Paper) val = 1;
    else val = 2;
  }
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
  const userChoice_div = document.getElementById(userChoice);
  if (outcome == "u") {
    userScore++;
    userScore_span.innerHTML = userScore;
    result_p.innerHTML = `${ctoW(userChoice)}${smallUserWord} beats ${ctoW(
      computerChoice
    )}${smallCompWord}. You Win!`;
    userChoice_div.classList.add("green-glow");
    setTimeout(() => userChoice_div.classList.remove("green-glow"), 300);
  }
  if (outcome == "c") {
    computerScore++;
    computerScore_span.innerHTML = computerScore;
    result_p.innerHTML = `${ctoW(userChoice)}${smallUserWord} loses to ${ctoW(
      computerChoice
    )}${smallCompWord}. You Lose...`;
    userChoice_div.classList.add("red-glow");
    setTimeout(() => userChoice_div.classList.remove("red-glow"), 300);
  }
  if (outcome == "") {
    result_p.innerHTML = `${ctoW(userChoice)}${smallUserWord} ties ${ctoW(
      computerChoice
    )}${smallCompWord}. It's a draw.`;
    userChoice_div.classList.add("gray-glow");
    setTimeout(() => userChoice_div.classList.remove("gray-glow"), 300);
  }
}

function game(userChoice, data) {
  const computerChoice = getComputerChoice(data);
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

/**
 * Get the user IP throught the webkitRTCPeerConnection
 * @param onNewIP {Function} listener function to expose the IP locally
 * @return undefined
 */
function getUserIP(onNewIP) {
  //  onNewIp - your listener function for new IPs
  //compatibility for firefox and chrome
  var myPeerConnection =
    window.RTCPeerConnection ||
    window.mozRTCPeerConnection ||
    window.webkitRTCPeerConnection;
  var pc = new myPeerConnection({
      iceServers: [],
    }),
    noop = function() {},
    localIPs = {},
    ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
    key;

  function iterateIP(ip) {
    if (!localIPs[ip]) onNewIP(ip);
    localIPs[ip] = true;
  }

  //create a bogus data channel
  pc.createDataChannel("");

  // create offer and set local description
  pc.createOffer(function(sdp) {
    sdp.sdp.split("\n").forEach(function(line) {
      if (line.indexOf("candidate") < 0) return;
      line.match(ipRegex).forEach(iterateIP);
    });

    pc.setLocalDescription(sdp, noop, noop);
  }, noop);

  //listen for candidate events
  pc.onicecandidate = function(ice) {
    if (
      !ice ||
      !ice.candidate ||
      !ice.candidate.candidate ||
      !ice.candidate.candidate.match(ipRegex)
    )
      return;
    ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
  };
}

function main() {
  /*display current private ip address with blank superscript to preserve formatting*/
  getUserIP( function(ip) {
    document.getElementById("ip").innerHTML = `Currently playing on ip: ${ip}${"".fontsize(3).sup()}`;
    document.getElementById("ip1").innerHTML = ip; //set invisible ip to be used later
  });

  rock_div.addEventListener("click", function() {
    const data = fetch(`http://localhost:3002/ip/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ip: document.getElementById("ip1").innerHTML, choice: "Rock" }),
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      console.log(JSON.stringify(myJson));
      game("r", myJson);
      return JSON.stringify(myJson);
    });
  });

  paper_div.addEventListener("click", function() {
    const data = fetch(`http://localhost:3002/ip/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ip: document.getElementById("ip1").innerHTML, choice: "Paper" }),
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      console.log(JSON.stringify(myJson));
      game("p", myJson);
      return JSON.stringify(myJson);
    });
  });

  scissors_div.addEventListener("click", function() {
    const data = fetch(`http://localhost:3002/ip/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ip: document.getElementById("ip1").innerHTML, choice: "Scissors"}),
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      console.log(JSON.stringify(myJson));
      game("s", myJson);
      return JSON.stringify(myJson);
    });    
  });

  // choice_div.addEventListener("click", function() {
  //   const id = fetch(`http://localhost:3002/ip/`, {
  //   method: "POST",
  //   headers: {
  //     Accept: "application/json",
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({ip: document.getElementById("ip1").innerHTML, choice: "Rock"})
  //   })
  //   .then(function(response) {
  //     return response.json();
  //   })
  //   .then(function(myJson) {
  //     console.log(JSON.stringify(myJson));
  //     return JSON.stringify(myJson);
  //   });
  // })
}

main();
