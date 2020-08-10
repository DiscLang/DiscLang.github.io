(function () {
    const outputWindow = document.getElementById('code-output');
    const runButton = document.getElementById('run-button');
    const clearButton = document.getElementById('clear-button');
    const exampleCodeSelectElement = document.getElementById('example-code');
    const toggleCodeView = document.getElementById('toggle-code-view');
    const codeView = document.getElementById('code-view');
    const newProgramButton = document.getElementById('new-program');
    const codeExampleSelect = document.getElementById('load-example');
    const fullScreenLink = document.getElementById('view-full-screen');

    const CURRENT_PROGRAM = 'currentProgram';

    fullScreenLink.addEventListener('click', function (event) {
        event.preventDefault();

        console.log(editor.getOption("fullScreen"));

        editor.setOption("fullScreen", true);

        editor.focus();
    });

    function loadSource(exampleName) {
        const source = samplePrograms[exampleName];

        showCode();

        editor.setValue(source);
    }

    codeExampleSelect.addEventListener('click', function (event) {
        event.preventDefault();

        const selectedIndex = exampleCodeSelectElement.selectedIndex;
        const selectedExampleName = exampleCodeSelectElement.options[selectedIndex].value;

        loadSource(selectedExampleName);
    });

    newProgramButton.addEventListener('click', function (event) {
        event.preventDefault();

        editor.setValue('begin\n\nend');

        editor.focus();
        editor.setCursor(1, 0);
    });

    runButton.addEventListener('click', function (event) {
        event.preventDefault();

        clearDisplay();
        runProgram();
    });

    clearButton.addEventListener('click', function (event) {
        event.preventDefault();

        clearDisplay();
    });

    function showCode() {
        if (codeView.className.includes('hidden')) {
            codeView.className = codeView.className.replace('hidden', '').trim();
            toggleCodeView.textContent = 'Hide Code';
        }
    }

    toggleCodeView.addEventListener('click', function (event) {
        event.preventDefault();

        const codeViewClass = codeView.className;

        if (codeViewClass.includes('hidden')) {
            showCode();
        } else {
            codeView.className += ' hidden';
            toggleCodeView.textContent = 'Show Code';
        }
    });

    function clearDisplay() {
        outputWindow.innerHTML = '';
    }

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

    const searchMap = decodeURI(window.location.href)
        .split('?')
        .pop()
        .split('&')
        .map(token => token.split('='))
        .reduce((finalMap, [key, value]) => {
            finalMap[key] = value;
            return finalMap;
        }, {});

    if (typeof searchMap.source === 'string') {
        const intervalId = setInterval(function () {
            if (typeof editor !== 'undefined') {
                clearInterval(intervalId);

                loadSource(searchMap.source);
                editor.setOption("readOnly", true);

                console.log(exampleCodeSelectElement.options);

                const option = Array.prototype.slice.call(exampleCodeSelectElement.options, 0)
                    .find(option => option.value === searchMap.source);

                option.selected = true;

                codeExampleSelect.disabled = true;
                exampleCodeSelectElement.disabled = true;
                newProgramButton.disabled = true;
            }
        }, 50);
    }
})();
