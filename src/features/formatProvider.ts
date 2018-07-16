import * as vscode from 'vscode';

import { TextDocument, Range, ProviderResult, TextEdit } from 'vscode';

export class MagicDocFormatProvider implements vscode.DocumentFormattingEditProvider {
    public provideDocumentFormattingEdits(document: TextDocument): ProviderResult<TextEdit[]> {
        return doFormat(document);
    }
}

export class MagicSelFormatProvider implements vscode.DocumentRangeFormattingEditProvider {
    public provideDocumentRangeFormattingEdits(document: TextDocument, range: Range): ProviderResult<TextEdit[]> {
        return doFormat(document, range);
    }
}

class MatchChar {
    public line: number;
    public column: number;
    public isSpace: boolean;
    constructor(line: number, column: number, isSpace: boolean) {
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

function doFormat(document: TextDocument, range?: Range) {
    let formatRange: Range;
    if (range) {
        formatRange = range;
    } else {
        let start = document.positionAt(0);
        let end = document.lineAt(document.lineCount - 1).range.end;
        formatRange = new Range(start, end)
    }
    let edits: TextEdit[] = [];
    let position = 0;
    let matchStack: MatchChar[] = [];
    for (let y = formatRange.start.line; y <= formatRange.end.line; y++) {
        let line = document.lineAt(y).text.trim();
        // ignore comments
        if (line.search(/^(?:~~ *)?;/) === -1) {
            let lineTest = line;
            // Remove quoted strings and one-line braced statements
            lineTest = removeStr(lineTest, '`[^`]*\'');
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
        if (line !== formattedLine) {
            edits.push(TextEdit.replace(document.lineAt(y).range, formattedLine));
        }
        position = (matchStack.length > 0) ? last(matchStack).column : 0;
    }
    if (matchStack.length > 0) {
        let errMatch = matchStack.pop();
        if (errMatch) {
            vscode.window.showErrorMessage("Format error: Too many open braces at line " + (errMatch.line + 1));
        }
        return;
    }
    return edits;
}
