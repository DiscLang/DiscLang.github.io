(function () {
    const outputWindow = document.getElementById('code-output');

    window.print = function (...args) {
        const content = args.join('');
        const currentContent = outputWindow.innerText;

        outputWindow.innerText = currentContent + '\n' + content;
    }

    window.clear = function () {
        outputWindow.innerHTML = '';
    }
})();