(function () {
    const outputWindow = document.getElementById('code-output');

    window.print = function (...args) {
        const content = args.join('');
        const currentContent = outputWindow.value;

        outputWindow.value = currentContent + '\n' + content;
    }
    
    window.definedPrompt = prompt;

    window.clear = function () {
        outputWindow.value = '';
    }
})();