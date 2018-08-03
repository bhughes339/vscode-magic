import * as vscode from 'vscode';
import * as Util from '../util/magicUtil';

import { TextDocument, Position, ProviderResult, Location } from 'vscode';

export default class MagicMacroDefinitionProvider implements vscode.DefinitionProvider {
    public provideDefinition(document: TextDocument, position: Position): ProviderResult<Location | undefined> {
        let range = document.getWordRangeAtPosition(position);
        let word = (range) ? document.getText(range) : null;
        if (word) {
            let exp = new RegExp(`${Util.constants.macroPrefix.source}${word}$`, 'm');
            let match = document.getText().search(exp)
            if (match > -1) {
                let pos = document.positionAt(match)
                return new Location(document.uri, pos)
            }
        }
        return;
    }
}
