(function () {
    const outputWindow = document.getElementById('code-output');

    window.print = function (...args) {
        const content = args.join('');
        const line = document.createElement('pre');
        line.textContent = content;

        outputWindow.appendChild(line);
    }
})();