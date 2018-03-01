'use strict';

import * as vscode from 'vscode';
import Window = vscode.window;
import QuickPickItem = vscode.QuickPickItem;
import QuickPickOptions = vscode.QuickPickOptions;
import Document = vscode.TextDocument;
import Position = vscode.Position;
import Range = vscode.Range;
import Selection = vscode.Selection;
import TextLine = vscode.TextLine;
import TextDocument = vscode.TextDocument;
import TextEditor = vscode.TextEditor;

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "magic" is now active!');
    vscode.commands.registerCommand('extension.formatMagic', formatMagic);
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
    public toSelection() {
        return new Selection(this.line, this.column, this.line, this.column);
    }
}

function doFormat(e: TextEditor, d: TextDocument, sel: Selection[]) {
	e.edit(function (edit) {
		for (var x = 0; x < sel.length; x++) {
            if (sel[x].isSingleLine) continue;
            let position = 0;
            let matchStack: MatchChar[] = [];
            for (var y = sel[x].start.line; y <= sel[x].end.line; y++) {
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
                                matchStack.push(new MatchChar(y, currentMatch.index+position+1, true));
                                break;
                            case "}":
                                try {
                                    while (last(matchStack).isSpace) matchStack.pop();
                                    matchStack.pop();
                                }
                                catch(err) {
                                    if (err.name === "TypeError") {
                                        Window.showErrorMessage("Brace mismatch: Too many close braces at line " + (y+1));
                                        let pad = d.lineAt(y).text.length - lineTest.length;
                                        let errCol = currentMatch.index + pad + 1;
                                        let sel = new Selection(y, errCol, y, errCol);
                                        e.selection = sel;
                                        e.revealRange(sel, 1);
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
                                matchStack.push(new MatchChar(y, currentMatch.index+position+1, false));
                                break;
                        }
                        currentMatch = matchReg.exec(lineTest);
                    }
                }
                let formattedLine = (position > 0) ? " ".repeat(position) + line : line;
                edit.replace(d.lineAt(y).range, formattedLine);
                position = (matchStack.length > 0) ? last(matchStack).column : 0;
            }
            if (matchStack.length > 0) {
                let errMatch = matchStack.pop();
                Window.showErrorMessage("Brace mismatch: Too many open braces at line " + (errMatch.line+1));
                e.selection = errMatch.toSelection();
                e.revealRange(errMatch.toSelection());
                return;
            }
        }
    });
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
    return stack[stack.length-1];
}

function formatMagic() {
    let e = Window.activeTextEditor;
    let d = e.document;
    let sel = e.selections;
    if (sel.length === 1 && sel[0].isEmpty) {
        let start = d.positionAt(0);
        let end = d.lineAt(d.lineCount-1).range.end;
        sel[0] = new Selection(start, end);
    }
    doFormat(e, d, sel);
}