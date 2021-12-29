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
    this._render_function = null;
    this.templateStr = templateStr;
  }

  tokenize() {
    const re = new RegExp(/({{.*?}}|{%.*?%}|{#.*?#})/, "igm");
    return this.templateStr.split(re);
  }

  compile() {
    const STACK = [];
    const globalVars = new Set();

    let code = new CodeBuilder();
    code.addLine("function render_function(context) {");
    let vars_code = code.addCodeSection();
    code.addLine("var result = [];");
    code.addLine("function extend_result(items) { result.push(...items) };");

    const tokens = this.tokenize();
    for (const token of tokens) {
      if (token.startsWith("{#")) {
        // Template Comment, we will just ignore
      } else if (token.startsWith("{{")) {
        let expr = token.substring(2, token.length - 2).trim();
        if (STACK.length === 0) globalVars.add(expr);
        code.addLine(`result.push(${expr});`);
      } else if (token.startsWith("{%")) {
        let expr = token.substring(2, token.length - 2).trim();
        let keywords = expr.split(" ");
        if (keywords[0] === "for") {
          if (keywords.length !== 4)
            throw new Error("Sytax error in ", keywords);
          if (STACK.length === 0) globalVars.add(keywords[3]);
          STACK.push(keywords[0]);
          code.addLine(`for(const ${keywords[1]} of ${keywords[3]}) {`);
        } else if (keywords[0].startsWith("end")) {
          if (keywords.length !== 1)
            throw new Error("Syntax error in ", keywords);
          const endOp = keywords[0].substring(3);
          const op = STACK.pop();
          if (op !== endOp) throw new Error("Syntax error in", keywords);
          code.addLine("}");
        }
      } else {
        // Literals
        code.addLine(`result.push(\`${token.trim()}\`);`);
      }
    }

    for (const _var of globalVars) {
      vars_code.addLine(`var ${_var} = context['${_var}'];`);
    }
    code.addLine("return result.join('');");
    code.addLine("}; render_function;");
    const cleanedCode = code.toString().replace(/\n/g, "");
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
