const vm = require("vm");

class CodeBuilder {
  constructor() {
    this.code = [];
  }

  extend(items) {
    this.code.push(...items);
  }

  addLine(line) {
    this.extend([line, "\n"]);
  }

  startLocalScope() {
    this.code.push("{");
  }

  endLocalScope() {
    this.code.push("}");
  }

  addCodeSection() {
    let codeSection = new CodeBuilder();
    this.code.push(codeSection);
    return codeSection;
  }

  toString() {
    return this.code.join("");
  }
}

class Template {
  constructor(templateStr) {
    this.__code = null;
    this._render_function = null;
    this.templateStr = templateStr;
  }

  tokenize() {
    /*
     * {{ <expression> }} -> We use render the output of any arbtitrary Javascript expression
     * {% for | if | elif | else | endfor | endif %} -> Create a conditional block or loop
     * {# COMMENT #} -> Write a comment, get's ignored when parsed.
     *
     */
    const re = new RegExp(/({{.*?}}|{%.*?%}|{#.*?#})/, "igm");
    return this.templateStr.split(re);
  }

  compile() {
    const STACK = [];
    const globalVars = new Set();

    /**
     * Initialize Render function with base setup.
     * Here the order of lines is very important.
     * We are creating function initilization structure and locking placeholder for appending global variables.
     * Here is what it looks like
     *
     * function render_function(content) {
     *   <<< Create a placeholder for named variables, which are used. This will be filled in, once the parsing is completed >>>
     *   var results = [];
     *   function extend_result(items) { extend_result(...items) };
     *
     *
     * Since we need those variables to be defined at top, thus the order of lines is important.
     */

    let code = new CodeBuilder();
    code.addLine("function render_function(context) {");
    let vars_code = code.addCodeSection();
    code.addLine("var result = [];");
    code.addLine("function extend_result(items) { result.push(items) };");

    const tokens = this.tokenize();

    // console.log("TOKENS", tokens);

    for (const token of tokens) {
      if (token.startsWith("{#")) {
        // Template Comment, we will just ignore
      } else if (token.startsWith("{{")) {
        // Token Structure: {{ <statement> }}
        let expr = token.substring(2, token.length - 2).trim();
        /*
         * Check if top level expression stack is clean.
         * If empty, it's not part of any block scope,
         * so add expression to global variable Set.
         */
        if (STACK.length === 0) globalVars.add(expr);
        code.addLine(`extend_result(${expr});`);
      } else if (token.startsWith("{%")) {
        // Token Structure: {% <expression> %}
        const expr = token.substring(2, token.length - 2).trim();
        /*
         * Possible Keyword Structures:
         * [for, int, T, in, [T]]
         * [for, T, in, [T]]
         * [if, boolean]
         * [elif, boolean]
         * [else]
         * [endif]
         * [endfor]
         */
        const keywords = expr.split(" ");
        if (keywords[0] === "for") {
          if (keywords.length !== 4 && keywords.length !== 5) {
            throw new Error("Sytax error in ", keywords);
          }

          STACK.push(keywords[0]);

          if (keywords.length === 4) {
            globalVars.add(keywords[3]);

            code.addLine(`for(const ${keywords[1]} of ${keywords[3]}) {`);
          } else if (keywords.length === 5) {
            globalVars.add(keywords[4]);

            code.addLine(
              `for(const [${keywords[1]}, ${keywords[2]}] of ${keywords[4]}.entries()) {`
            );
          }
        } else if (keywords[0] === "if") {
          if (keywords.length !== 2) {
            throw new Error("Sytax error in ", keywords);
          }

          globalVars.add(keywords[1]);
          STACK.push(keywords[0]);
          code.addLine(`if(${keywords[1]}) {`);
        } else if (keywords[0] === "elif") {
          if (keywords.length !== 2) {
            throw new Error("Sytax error in ", keywords);
          }

          const TOP_STACK_ELEM = STACK[STACK.length - 1];
          if (TOP_STACK_ELEM !== "if" && TOP_STACK_ELEM !== "elif") {
            throw new Error("Syntax Error, can't use elif without if");
          }

          globalVars.add(keywords[1]);
          STACK.push(keywords[0]);
          code.addLine(`} else if(${keywords[1]}) {`);
        } else if (keywords[0] === "else") {
          if (keywords.length !== 1) {
            throw new Error("Sytax error in ", keywords);
          }

          const TOP_STACK_ELEM = STACK[STACK.length - 1];
          if (TOP_STACK_ELEM !== "if" && TOP_STACK_ELEM !== "elif") {
            throw new Error(
              `Syntax Error, can't use elif without if, STACK
              ${STACK.join("\n")}`
            );
          }

          STACK.push(keywords[0]);

          code.addLine(`} else {`);
        } else if (keywords[0] === "endfor") {
          if (keywords.length !== 1) {
            throw new Error("Syntax error, invalid use", keywords);
          }

          const stackOp = STACK.pop();

          if (stackOp !== "for") {
            throw new Error("Syntax error, missing for loop declaration");
          }

          code.addLine("}");
        } else if (keywords[0] === "endif") {
          if (keywords.length !== 1) {
            throw new Error("Syntax error, invalid use", keywords);
          }

          const stackOp = STACK.pop();
          if (stackOp !== "if" && stackOp !== "elif" && stackOp !== "else") {
            throw new Error("Syntax error, missing if declaration");
          }

          // CLEAN STACK OF ALL IF info.
          while (STACK.length) {
            const op = STACK.pop();
            if (op !== "if" && op !== "elif" && op !== "else") {
              STACK.push(op);
              break;
            }
          }

          code.addLine("}");
        }
      } else {
        // Literals
        code.addLine(`extend_result(\`${token}\`);`);
      }
    }

    for (const _var of globalVars) {
      vars_code.addLine(`var ${_var} = context['${_var}'];`);
    }

    code.addLine("return result.join('');");

    // A trick to return the reference of exectued function, from the VM, back to external environment.
    code.addLine("}; render_function;");

    const cleanedCode = code.toString().replace(/\n/g, "");

    this.__code = cleanedCode;

    this._render_function = vm.runInNewContext(cleanedCode);
  }

  render(context) {
    return this._render_function(context);
  }

  getRenderer() {
    return this._render_function;
  }
}

module.exports = Template;
