import * as vscode from 'vscode';
import * as Util from '../util/magicUtil';

import { TextDocument, Position, ProviderResult, Hover } from 'vscode';

export default class MagicHoverProvider implements vscode.HoverProvider {
    public provideHover(document: TextDocument, position: Position): ProviderResult<Hover | undefined> {
        let config = vscode.workspace.getConfiguration("magic");
        let hoverSeconds = config.get("hoverSeconds");
        let range = document.getWordRangeAtPosition(position,
            new RegExp('/?' + Util.constants.wordRange.source));
        let word = (range) ? document.getText(range) : null;
        if (word) {
            if (word.match(/^[\d]+$/) && hoverSeconds) {
                let epochSeconds = parseInt(word) + Util.constants.epochDelta;
                if (epochSeconds < 2147483647) {
                    let date = new Date(epochSeconds * 1000);
                    return new Hover('S(0) Date: ' + date.toLocaleString())
                }
            } else {
                word = word.replace(/[.]/g, '\\$&');
                let exp = new RegExp(`^;[ \\/\\t]+?${word}[ \\t]*[=-][ \\t]*(.*)`);
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
        }
        return;
    }
}
