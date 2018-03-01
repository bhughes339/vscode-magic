'use strict';

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "magic" is now active!');
    vscode.languages.registerDocumentFormattingEditProvider('magic', {
        provideDocumentFormattingEdits(d: vscode.TextDocument): vscode.TextEdit[] {
            return doFormat(d, null);
        }
    });
    vscode.languages.registerDocumentRangeFormattingEditProvider('magic', {
        provideDocumentRangeFormattingEdits(d: vscode.TextDocument, r: vscode.Range): vscode.TextEdit[] {
            return doFormat(d, r);
        }
    });
}

class MatchChar {
    public line: number;
    public column: number;
    public isSpace: boolean;
    constructor(line, column, isSpace) {
        this.line = line;
        this.column = column;
        this.isSpace = isSpace;
    }
}

function removeStr(line: string, re: string) {
    let regex = new RegExp(re);
    let strRemove = line.match(regex);
    while (strRemove) {
        let m = strRemove[0];
        line = line.replace(regex, "X".repeat(m.length));
        strRemove = line.match(regex);
    }
    return line;
}

function last(stack: MatchChar[]) {
    return stack[stack.length - 1];
}

function doFormat(d: vscode.TextDocument, r: vscode.Range) {
    if (r === null) {
        let start = d.positionAt(0);
        let end = d.lineAt(d.lineCount - 1).range.end;
        r = new vscode.Range(start, end)
    }
    let edits: vscode.TextEdit[] = [];
    let position = 0;
    let matchStack: MatchChar[] = [];
    for (var y = r.start.line; y <= r.end.line; y++) {
        let line = d.lineAt(y).text.trim();
        // ignore comments
        if (line.search(/^(?:~~ *)?;/) === -1) {
            let lineTest = line;
            // Remove quoted strings and one-line braced statements
            lineTest = removeStr(lineTest, '"[^"]*"');
            lineTest = removeStr(lineTest, '\{[^\{}]*}');
            // find match points in line
            let matchReg = /(\{| |}|;)/g;
            let currentMatch = matchReg.exec(lineTest);
            while (currentMatch) {
                switch (currentMatch[0]) {
                    case " ":
                        matchStack.push(new MatchChar(y, currentMatch.index + position + 1, true));
                        break;
                    case "}":
                        try {
                            while (last(matchStack).isSpace) matchStack.pop();
                            matchStack.pop();
                        }
                        catch (err) {
                            if (err.name === "TypeError") {
                                vscode.window.showErrorMessage("Format error: Too many close braces at line " + (y + 1));
                                return;
                            }
                        }
                        break;
                    case ";":
                        if (matchStack.length > 0) {
                            while (last(matchStack).isSpace) matchStack.pop();
                        }
                        break;
                    default: // always matches {
                        matchStack.push(new MatchChar(y, currentMatch.index + position + 1, false));
                        break;
                }
                currentMatch = matchReg.exec(lineTest);
            }
        }
        let formattedLine = (position > 0) ? " ".repeat(position) + line : line;
        edits.push(vscode.TextEdit.replace(d.lineAt(y).range, formattedLine));
        position = (matchStack.length > 0) ? last(matchStack).column : 0;
    }
    if (matchStack.length > 0) {
        let errMatch = matchStack.pop();
        vscode.window.showErrorMessage("Format error: Too many open braces at line " + (errMatch.line + 1));
        return;
    }
    return edits;
}
