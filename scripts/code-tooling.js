(function () {
    const outputWindow = document.getElementById('code-output');
    const runButton = document.getElementById('run-button');
    const resetButton = document.getElementById('reset-button');
    const clearButton = document.getElementById('clear-button');
    const autoRunInput = document.getElementById('auto-run');

    const CURRENT_PROGRAM = 'currentProgram';
    const AUTO_RUN = 'autoRun';

    runButton.addEventListener('click', function (event) {
        event.preventDefault();

        clearDisplay();
        runProgram();
    });

    resetButton.addEventListener('click', function () {
        localStorage.removeItem(CURRENT_PROGRAM);

        const currentSource = getCurrentSource();

        editor.setValue(currentSource);
    });

    autoRunInput.addEventListener('change', function () {
        localStorage.setItem(AUTO_RUN, autoRunInput.checked);
    });

    clearButton.addEventListener('click', function () {
        clearDisplay();
    });

    function clearDisplay() {
        outputWindow.innerHTML = '';
    }

    let hasChanged = false;
    let lastChanged = Date.now();

    function runProgram() {
        try {
            const programSource = editor.getValue();

            clearDisplay();
            loadAndRunProgram(programSource, {});
        } catch (e) {
            const errorMessage = e.message;

            const errorElement = document.createElement('h3');
            errorElement.className = "run-error";
            errorElement.textContent = errorMessage;

            outputWindow.appendChild(errorElement);
        }

        hasChanged = false;
        lastChanged = Date.now();
    }

    window.runProgram = function () {
        runProgram();
    };

    window.saveCurrentSource = function saveCurrentSource(editor) {
        const currentSource = editor.getValue();

        localStorage.setItem(CURRENT_PROGRAM, currentSource);
    }

    setInterval(function () {
        const changeDiff = Date.now() - lastChanged;
        if (autoRunInput.checked && hasChanged && changeDiff > 1500) {
            runProgram();
        }
    }, 500)

    window.autoRunner = function autoRunner() {
        hasChanged = true;
        lastChanged = Date.now();
    }

    window.getAutoRunState = function getAutoRunState() {
        const state = localStorage.getItem(AUTO_RUN);
        return state === 'true';
    }

    window.getCurrentSource = function getCurrentSource() {
        const lastSource = localStorage.getItem(CURRENT_PROGRAM);
        const defaultSource = `begin
    define ROCK as "rock"
    define PAPER as "paper"
    define SCISSORS as "scissors"

    let options be newArray: ROCK PAPER SCISSORS
    let playAgain be true

    let wins be 0
    let losses be 0
    let ties be 0

    repeat while playAgain
        call clear

        print: join: "wins: " wins " losses: " losses " ties: " ties

        let computerChoice be readFrom: options (random: 1 4)
        let userChoice be ""

        repeat while not: ((userChoice isEqualTo ROCK) or (userChoice isEqualTo PAPER) or (userChoice isEqualTo SCISSORS))
            update userChoice to toLowerCase: (prompt: "Rock, paper, or scissors? ")
        end

        print: join: "The computer chose: " computerChoice
        print: join: "You chose: " userChoice

        let rockWin be (userChoice isEqualTo ROCK) and (computerChoice isEqualTo SCISSORS)
        let paperWin be (userChoice isEqualTo PAPER) and (computerChoice isEqualTo ROCK)
        let scissorsWin be (userChoice isEqualTo SCISSORS) and (computerChoice isEqualTo PAPER)

        if rockWin or paperWin or scissorsWin
            update wins to wins + 1
            print: "You won!"
        else if userChoice isEqualTo computerChoice
            update ties to ties + 1
            print: "Tie game."
        else
            update losses to losses + 1
            print: "Better luck next time."
        end

        let rematch be ""

        repeat while (not: (rematch isEqualTo "y")) and (not: (rematch isEqualTo "n"))
            update rematch to toLowerCase: (prompt: "Rematch? (y/n)")
        end

        update playAgain to rematch isEqualTo "y"
    end

    call clear
    print: join: "wins: " wins " losses: " losses " ties: " ties

end`;

        return Boolean(lastSource) ? lastSource : defaultSource;
    }
})();
