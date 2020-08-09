(function () {
    const outputWindow = document.getElementById('code-output');

    window.print = function (...args) {
        const content = args.join('');
        const line = document.createElement('code');
        line.textContent = content;

        outputWindow.appendChild(line);
    }

    window.clear = function () {
        outputWindow.innerHTML = '';
    }
})();