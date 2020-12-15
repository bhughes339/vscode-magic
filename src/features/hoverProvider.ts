import * as vscode from 'vscode';
import * as Util from '../util/magicUtil';

import { TextDocument, Position, ProviderResult, Hover } from 'vscode';

export default class MagicHoverProvider implements vscode.HoverProvider {
    public provideHover(document: TextDocument, position: Position): ProviderResult<Hover | undefined> {
        let config = vscode.workspace.getConfiguration("magic");
        let hoverSeconds = config.get("hoverSeconds");
        let hoverVisitNodes = config.get("hoverVisitNodes");
        let range = document.getWordRangeAtPosition(position,
            new RegExp('/?' + Util.constants.wordRange.source));
        let word = (range) ? document.getText(range) : null;
        if (word) {
            let match;
            if ((match = word.match(/^(\d{8})\.(\d{4})$/)) && hoverVisitNodes) {
                let fulldate = (99999999 - parseInt(match[1])).toString();
                let time = (9999 - parseInt(match[2])).toString().padStart(4, '0');
                let date = new Date(parseInt(fulldate.slice(0, 4)), parseInt(fulldate.slice(4, 6)) - 1, parseInt(fulldate.slice(6)),
                    parseInt(time.slice(0, 2)), parseInt(time.slice(2)));
                return new Hover(date.toLocaleString() + ` (${fulldate} ${time})`);
            }
            if (word.match(/^[\d]+$/) && hoverSeconds) {
                let epochSeconds = parseInt(word) + Util.constants.epochDelta;
                if (epochSeconds < 2147483647) {
                    let date = new Date(epochSeconds * 1000);
                    return new Hover('S(0) Date: ' + date.toLocaleString(undefined, {hour12: false}));
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
