'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
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
    console.log('Congratulations, your extension "magic-formatter" is now active!');
    vscode.commands.registerCommand('extension.formatMagic', formatMagic);
}

function doFormat(e: TextEditor, d: TextDocument, sel: Selection[]) {
	e.edit(function (edit) {
		for (var x = 0; x < sel.length; x++) {
            if (sel[x].isSingleLine) {
                continue;
            }
            let position = 0;
            let posStack = [];
            for (var y = sel[x].start.line; y <= sel[x].end.line; y++) {
                let line: string = d.lineAt(y).text.trim();
                if (! line.startsWith(";")) {
                    let lineTest = line;
                    // Remove quoted strings, one-line control statements, and non-control braced statements from line
                    lineTest = removeStr(lineTest, '"[^"]*"');
                    lineTest = removeStr(lineTest, '\{[^\{}]*}');
                    let fixedLine = lineTest;
                    // find indentation points in line
                    let found = lineTest.search("(IF\{|DO\{| )");
                    while (found !== -1) {
                        let stackChar = (lineTest.charAt(found) === " ") ? "S" : "B";
                        if (lineTest.charAt(found) !== " ") found += 2;
                        let pushVal = (posStack.length > 0) ? last(posStack)[0]+found+1 : found+1;
                        posStack.push([pushVal,stackChar]);
                        lineTest = lineTest.slice(found+1);
                        found = lineTest.search("(IF\{|DO\{| )");
                    }
                    // Pop indentation with end braces and semicolons as necessary
                    let closeBraces = fixedLine.match(/}/g);
                    if (closeBraces) {
                        for (var c = 0; c < closeBraces.length; c++) {
                            // a closed brace will deindent to the last open brace, regardless of spaces
                            try {
                                while (last(posStack)[1] === "S") posStack.pop();
                                posStack.pop();
                            }
                            catch(err) {
                                if (err.name === "TypeError") braceMismatch(y);
                            }
                        }
                    }
                    // semicolon will deindent to the closest open brace
                    if (line.endsWith(";") && posStack.length > 0) {
                        if (last(posStack)[1] === "S") posStack.pop();
                    }
                }
                let formattedLine = (position > 0) ? " ".repeat(position) + line : line;
                edit.replace(d.lineAt(y).range, formattedLine);
                position = (posStack.length > 0) ? last(posStack)[0] : 0;
            }
            if (posStack.length > 0) braceMismatch(y);
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

function last(stack) {
    return stack[stack.length-1];
}

function braceMismatch(line) {
    Window.showErrorMessage("The MAGIC code you selected has mismatched braces. Line " + line);
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