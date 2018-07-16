import * as vscode from 'vscode';
import * as Util from '../util/magicUtil';

import { TextDocument, ProviderResult, SymbolInformation, SymbolKind } from 'vscode';

interface MagicMacro {
    firstLine: vscode.TextLine,
    name: string
}

export default class MagicDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    public provideDocumentSymbols(document: TextDocument): ProviderResult<SymbolInformation[]> {
        const matchExp = Util.constants.macroDefinitionRange;
        const blankExp = /^ *$/;

        let symbols: SymbolInformation[] = [];
        let macroStack: MagicMacro | null = null;
        let lastLineBlank = false;
        
        for (var i = 0; i < document.lineCount; i++) {
            let line = document.lineAt(i);
            if (lastLineBlank) {
                let match = line.text.match(matchExp);
                if (match) {
                    macroStack = {firstLine: line, name: match[1]};
                    lastLineBlank = false;
                }
            } else if (blankExp.test(line.text)) {
                if (macroStack) {
                    let range = new vscode.Range(macroStack.firstLine.range.start, document.lineAt(i-1).range.end);
                    symbols.push(new SymbolInformation(macroStack.name, SymbolKind.Function, range));
                    macroStack = null;
                }
                lastLineBlank = true;
            } else {
                lastLineBlank = false;
            }
        }
        if (macroStack) {
            let range = new vscode.Range(macroStack.firstLine.range.start, document.lineAt(document.lineCount-1).range.end);
            symbols.push(new SymbolInformation(macroStack.name, SymbolKind.Function, range));
        }
        return symbols;
    }
}
