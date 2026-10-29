
const clues = [
    {
        title: "Evidence 01 — The Window",
        text: "The window is intact and locked from the inside. There are no signs of forced entry. The thief probably entered the mansion normally."
    },
    {
        title: "Evidence 02 — The Gloves",
        text: "A pair of gardening gloves was discovered near the display cabinet. They contain traces of soil matching the mansion garden."
    },
    {
        title: "Evidence 03 — The Clock",
        text: "The mansion clock stopped at 9:15 PM. Mr. Blake confirms that the diamond was still in its cabinet at 9:00 PM."
    },
    {
        title: "Evidence 04 — The Note",
        text: "A note reads: 'Meet me by the rose garden after nine.' The handwriting matches a note previously written by Daniel, the gardener."
    }
];

// The gardener, Daniel, is the culprit in this fictional case.
const culprit = 2;

let foundClues = new Set();
let attempts = 3;
let gameOver = false;

const clueCount = document.getElementById("clueCount");
const attemptsDisplay = document.getElementById("attempts");
const caseStatus = document.getElementById("caseStatus");
const clueDisplay = document.getElementById("clueDisplay");
const accusationMessage = document.getElementById("accusationMessage");

const locationButtons = document.querySelectorAll(".location");
const suspectButtons = document.querySelectorAll(".suspect");
const restartButton = document.getElementById("restartButton");

function showMessage(message, type = "") {
    accusationMessage.textContent = message;
    accusationMessage.className = "message";

    if (type) {
        accusationMessage.classList.add(type);
    }
}

function updateStats() {
    clueCount.textContent = `${foundClues.size} / ${clues.length}`;
    attemptsDisplay.textContent = attempts;
}

function inspectClue(index) {
    if (gameOver) {
        showMessage("This case is closed. Restart to investigate again.");
        return;
    }

    const clue = clues[index];

    if (!clue) return;

    foundClues.add(index);
    locationButtons[index].classList.add("found");

    clueDisplay.innerHTML = `
        <span class="clue-icon">🔎</span>
        <h3>${clue.title}</h3>
        <p>${clue.text}</p>
    `;

    updateStats();

    if (foundClues.size === clues.length) {
        showMessage(
            "All four clues collected! Review the evidence and identify the culprit."
        );
    } else {
        showMessage(
            `Evidence recorded. ${clues.length - foundClues.size} clue(s) remain.`
        );
    }
}

function accuseSuspect(index) {
    if (gameOver) {
        showMessage("The case is closed. Restart to play again.");
        return;
    }

    if (foundClues.size < clues.length) {
        showMessage(
            "You need to collect all four clues before making an accusation.",
            "error"
        );
        return;
    }

    suspectButtons.forEach(button => {
        button.classList.remove("accused");
    });

    suspectButtons[index].classList.add("accused");

    if (index === culprit) {
        gameOver = true;
        caseStatus.textContent = "SOLVED";
        caseStatus.style.color = "var(--green)";

        showMessage(
            "CASE SOLVED! Daniel, the gardener, took the diamond. The gloves, garden soil, and note connect him to the crime scene. Excellent detective work!",
            "success"
        );

        locationButtons.forEach(button => button.disabled = true);
        suspectButtons.forEach(button => button.disabled = true);

        return;
    }

    attempts--;
    updateStats();

    if (attempts <= 0) {
        gameOver = true;
        caseStatus.textContent = "CLOSED";
        caseStatus.style.color = "var(--red)";

        showMessage(
            "CASE CLOSED! You ran out of attempts. The culprit was Daniel, the gardener. Restart the case and try again.",
            "error"
        );

        locationButtons.forEach(button => button.disabled = true);
        suspectButtons.forEach(button => button.disabled = true);
    } else {
        showMessage(
            `Incorrect accusation! That suspect doesn't match the evidence. ${attempts} attempt(s) remaining.`,
            "error"
        );
    }
}

function restartGame() {
    foundClues = new Set();
    attempts = 3;
    gameOver = false;

    locationButtons.forEach(button => {
        button.classList.remove("found");
        button.disabled = false;
    });

    suspectButtons.forEach(button => {
        button.classList.remove("accused");
        button.disabled = false;
    });

    caseStatus.textContent = "OPEN";
    caseStatus.style.color = "";
    clueDisplay.innerHTML = `
        <span class="clue-icon">🔍</span>
        <h3>Investigation Log</h3>
        <p>Select a crime-scene location to reveal its clue.</p>
    `;

    updateStats();
    showMessage("Your investigation begins now, detective.");
}

locationButtons.forEach(button => {
    button.addEventListener("click", () => {
        inspectClue(Number(button.dataset.clue));
    });
});

suspectButtons.forEach(button => {
    button.addEventListener("click", () => {
        accuseSuspect(Number(button.dataset.suspect));
    });
});

restartButton.addEventListener("click", restartGame);

restartGame();
