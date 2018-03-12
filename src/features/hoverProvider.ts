import * as vscode from 'vscode';

import { TextDocument, Position, CancellationToken, ProviderResult, Hover } from 'vscode';

export default class MagicHoverProvider implements vscode.HoverProvider {
    public provideHover(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Hover | undefined> {
        let range = document.getWordRangeAtPosition(position, /\/?[A-Za-z\d.]+/);
        let word = (range) ? document.getText(range) : null;
        if (word) {
            word = word.replace(/[.]/g, '\\$&');
            let exp = new RegExp('^;[ \\/\\t]+?' + word + '[ \\t]*[=-][ \\t]*(.*)');
            for (var i = 0; i < document.lineCount; i++) {
                let line = document.lineAt(i).text;
                if (line.charAt(0) !== ';') {
                    break;
                }
                let match = line.match(exp);
                if (match) {
                    return new Hover(match[1]);
                }
            }
        }
        return;
    }
}
