(function () {
    const outputWindow = document.getElementById('code-output');
    const runButton = document.getElementById('run-button');

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

    runButton.addEventListener('click', function (event) {
        event.preventDefault();

        clearDisplay();
        runProgram();
    });

    window.runProgram = function () {
        runProgram();
    };

    window.saveCurrentSource = function saveCurrentSource(editor) {
        const currentSource = editor.getValue();

        localStorage.setItem('currentProgram', currentSource);
    }

    const autoRunElement = document.getElementById('auto-run');


    setInterval(function () {
        const changeDiff = Date.now() - lastChanged;
        if(autoRunElement.checked && hasChanged && changeDiff > 1500) {
            runProgram();
        }
    }, 500)

    window.autoRunner = function autoRunner() {
        hasChanged = true;
        lastChanged = Date.now();
    }

    window.getCurrentSource = function getCurrentSource() {
        const lastSource = localStorage.getItem('currentProgram');
        const defaultSource = `begin
    let questions be (call newArray)
    let answers be (call newDictionary)
    
    appendTo: questions (newArray: "name" "What is your name?")
    appendTo: questions (newArray: "quest" "What is your quest?")
    appendTo: questions (newArray: "color" "What is your favorite color?")
    
    let count be 1
    
    repeat while count isLessOrEqualTo (lengthOf: questions)
        let question be readFrom: questions count
        let questionKey be readFrom: question 1
        let response be prompt: readFrom: question 2
        
        setOn: answers questionKey response

        update count to count + 1
    end

    print: answers

end`;

        return Boolean(lastSource) ? lastSource : defaultSource;
    }
})();
