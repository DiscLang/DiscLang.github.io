(function () {
    const outputWindow = document.getElementById('code-output');
    const runButton = document.getElementById('run-button');
    const exampleCodeSelectElement = document.getElementById('example-code');
    const newProgramButton = document.getElementById('new-program');
    const codeExampleSelect = document.getElementById('load-example');
    const fullScreenLink = document.getElementById('view-full-screen');
    const functionDeclarationsSelect = document.getElementById('function-declarations');

    const CURRENT_PROGRAM = 'currentProgram';

    fullScreenLink.addEventListener('click', function (event) {
        event.preventDefault();

        console.log(editor.getOption("fullScreen"));

        editor.setOption("fullScreen", true);

        editor.focus();
    });

    function loadSource(exampleName) {
        const source = samplePrograms[exampleName];

        editor.setValue(source);
    }

    codeExampleSelect.addEventListener('click', function (event) {
        event.preventDefault();

        const selectedIndex = exampleCodeSelectElement.selectedIndex;
        const selectedExampleName = exampleCodeSelectElement.options[selectedIndex].value;

        loadSource(selectedExampleName);
        setFunctionDeclarations();
    });

    newProgramButton.addEventListener('click', function (event) {
        event.preventDefault();

        editor.setValue('begin\n\nend');

        editor.focus();
        editor.setCursor(1, 0);
        setFunctionDeclarations();
    });

    runButton.addEventListener('click', function (event) {
        event.preventDefault();

        clearDisplay();

        setTimeout(function () {
            runButton.disabled = true;

            runProgram()
                .then(function () {
                    runButton.disabled = false;
                });
        }, 100);
    });

    function clearDisplay() {
        outputWindow.innerHTML = '';
    }

    function runProgram() {
        try {
            const programSource = editor.getValue();

            clearDisplay();
            return loadAndRunProgram(programSource, {});
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

    window.getCurrentSource = function getCurrentSource() {
        const lastSource = localStorage.getItem(CURRENT_PROGRAM);
        const defaultSource = samplePrograms["Hello World"];

        return Boolean(lastSource) ? lastSource : defaultSource;
    }

    Object.keys(samplePrograms)
        .forEach(function (programName) {
            const option = document.createElement('option');

            option.value = programName;
            option.text = programName;

            exampleCodeSelectElement.appendChild(option);
        });

    function getSearchMap() {
        return decodeURI(window.location.href)
            .split('?')
            .pop()
            .split('&')
            .map(token => token.split('='))
            .reduce((finalMap, [key, value]) => {
                finalMap[key] = value;
                return finalMap;
            }, {});
    }

    function setSourceFromQuery() {
        const searchMap = getSearchMap();

        if (typeof searchMap.source === 'string') {
            loadSource(searchMap.source);
            editor.setOption("readOnly", true);

            const option = Array.prototype
                .slice.call(exampleCodeSelectElement.options, 0)
                .find(option => option.value === searchMap.source);

            option.selected = true;

            codeExampleSelect.disabled = true;
            exampleCodeSelectElement.disabled = true;
            newProgramButton.disabled = true;
        }
    }

    let lastTimeoutId = -1;

    function getSecondsInMilliseconds(seconds) {
        return seconds * 1000;
    }

    function setFunctionDeclarations() {
        const editorSource = editor.getValue();
        const parsedSource = parseSource(editorSource);

        functionDeclarationsSelect.innerHTML = "<option value=\"\">Jump To</option>";
        
        const functionsOptGroup = document.createElement('optgroup');
        
        functionsOptGroup.setAttribute('label', 'Function Declarations');
        functionDeclarationsSelect.appendChild(functionsOptGroup);
        
        const constantsOptGroup = document.createElement('optgroup');

        constantsOptGroup.setAttribute('label', 'Constant Defintions');
        functionDeclarationsSelect.appendChild(constantsOptGroup);

        parsedSource.body.forEach(function (node) {

            if (node.type === 'FunctionDeclaration') {
                const line = node.line;
                const name = node.name.originalName;

                const newOption = document.createElement('option');
                newOption.value = line;
                newOption.textContent = name;

                functionsOptGroup.appendChild(newOption);
            } else if (node.type === 'InitializationExpression' && node.variableType === 'define') {
                const line = node.line;
                const name = node.identifier.originalName;

                const newOption = document.createElement('option');
                newOption.value = line;
                newOption.textContent = name;

                constantsOptGroup.appendChild(newOption);
            }
        });
    }

    functionDeclarationsSelect.addEventListener('change', function (event) {
        const selectedIndex = functionDeclarationsSelect.selectedIndex;
        const option = functionDeclarationsSelect[selectedIndex];
        const position = parseInt(option.value);

        if (!isNaN(position)) {
            editor.focus();
            editor.setCursor(position - 1, 0)
        }
    });

    const intervalId = setInterval(function () {
        if (typeof editor !== 'undefined') {
            clearInterval(intervalId);

            setSourceFromQuery();
            setFunctionDeclarations();

            editor.on('change', function () {
                lastChange = Date.now();


                saveCurrentSource(editor);

                clearTimeout(lastTimeoutId);

                lastTimeoutId = setTimeout(function () {
                    setFunctionDeclarations()
                }, getSecondsInMilliseconds(5));
            });
        }
    }, 50);

})();
