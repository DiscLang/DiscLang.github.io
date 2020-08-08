/* Example definition of a simple mode that understands a subset of
 * JavaScript:
 */

CodeMirror.defineSimpleMode("disc-lang", {
    // The start state contains the rules that are intially used
    start: [
      // The regex matches the token, the token property contains the type
      {regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string"},
      // You can match multiple tokens at once. Note that the captured
      // groups must span the whole string in this case
      {regex: /([^\s\:\(\)]+\:)/,
       token: ["keyword", null, "variable-2"]},
      // Rules are matched in the order in which they appear, so there is
      // no ambiguity between this one and the one above
      {regex: /(?:let|define|update|be|as|to|call|begin|end|if|loop|repeat|while|else)\b/,
       token: "keyword"},
      {regex: /(?:([A-Z0-9_])+)\b/, token: "variable-3"},
      {regex: /true|false|null|undefined/, token: "atom"},
      {regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i,
       token: "number"},
      {regex: /\/\/.*/, token: "comment"},
      {regex: /\/(?:[^\\]|\\.)*?\//, token: "variable-3"},
      // A next property will cause the mode to move to a different state
      {regex: /\#.*$/, token: "comment"},
      {regex: /([-+\/*]+|isEqualTo|isLessThan|isGreaterThan|isLessOrEqualTo|isGreaterOrEqualTo|or|and)/, token: ["variable-2"]},
      // indent and dedent properties guide autoindentation
      {regex: /(begin|loop|repeat|if|else)/, indent: true},
      {regex: /end/, dedent: true}
      // {regex: /[a-z$][\w$]*/, token: "variable"},
    ],
    // The multi-line comment state.
    // comment: [
    //   {regex: /\#.*$/, token: "comment", next: "start"},
    //   {regex: /.*/, token: "comment"}
    // ],
    // The meta property contains global information about the mode. It
    // can contain properties like lineComment, which are supported by
    // all modes, and also directives like dontIndentStates, which are
    // specific to simple modes.
    meta: {
      dontIndentStates: ["comment"],
      lineComment: "#"
    }
  });
  