(function (mod) {
    mod(CodeMirror);
})(function (CodeMirror) {
    "use strict";

    console.log('registering hint');

    CodeMirror.registerHelper("hint", "disc-lang", function (codeMirrorInstance) {
        const cursor = codeMirrorInstance.getCursor();
        const token = codeMirrorInstance.getTokenAt(cursor);
        const innerMode = CodeMirror.innerMode(codeMirrorInstance.getMode(), token.state);

        const isNotDiscLang = innerMode.mode.name !== 'disc-lang';

        if (isNotDiscLang) {
            return;
        }


        console.log(cursor, token, innerMode);
    });
});