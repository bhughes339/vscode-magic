import * as vscode from 'vscode';

import { TextDocument, Position, CancellationToken, ProviderResult, Hover } from 'vscode';

export default class MagicHoverProvider implements vscode.HoverProvider {
    public provideHover(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Hover> {
        let hover = '';
        let range = document.getWordRangeAtPosition(position, /\/?[A-Za-z\d.]+/);
        let word = (range) ? document.getText(range) : '';
        if (word) {
            word = word.replace(/[.]/g, '\\$&');
            let exp = new RegExp('.*[ \\t]' + word + '[ \\t=-]+(.*)');
            for (var i = 0; i < document.lineCount; i++) {
                let line = document.lineAt(i).text;
                if (line.substring(0,1) !== ';') {
                    break;
                }
                let match = line.match(exp);
                if (match) {
                    hover = match[1];
                    break;
                }
            }
        }
        return new Hover(hover);
    }
}