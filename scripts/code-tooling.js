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
            loadAndRunProgram(programSource);
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
    # call can be used instead of the colon notation
    let questions be (call newArray)
    let answers be (call newDictionary)
    
    # add questions to the questions array
    appendTo: questions (newArray: "name" "What is your name?")
    appendTo: questions (newArray: "quest" "What is your quest?")
    appendTo: questions (newArray: "color" "What is your favorite color?")
    
    # Array indices start at 1
    let count be 1
    
    repeat while count isLessOrEqualTo (lengthOf: questions)
        let question be readFrom: questions count
        let questionKey be readFrom: question 1
        let response be prompt: readFrom: question 2
        
        setOn: answers questionKey response

        update count to count + 1
    end

    let badName be (readFrom: answers "name") isEqualTo ""
	let acceptableQuest be "I seek the holy grail"
    let badQuest be not: ((toLowerCase: quest) isEqualTo (toLowerCase: acceptableQuest))
    let badColor be (readFrom: answers "color") isEqualTo ""

    if badName or badQuest or badColor
        print: "... and that's how you ended up in the pit."
    else
        print: join: "Congrats " (readFrom: answers "name") "!"
        print: join: "You managed to escape the pit on your quest."
        print: join: "Here's a shirt for you. The text is " (readFrom: answers "color") " just like you like it."
    end

end`;

        return Boolean(lastSource) ? lastSource : defaultSource;
    }
})();
