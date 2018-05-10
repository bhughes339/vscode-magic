import * as vscode from 'vscode';

import MagicHoverProvider from './features/hoverProvider';
import MagicFoldingProvider from './features/foldingProvider';
import { MagicDocFormatProvider, MagicSelFormatProvider } from './features/formatProvider';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('magic',
        new MagicDocFormatProvider));
    context.subscriptions.push(vscode.languages.registerDocumentRangeFormattingEditProvider('magic',
        new MagicSelFormatProvider));
    context.subscriptions.push(vscode.languages.registerHoverProvider('magic',
        new MagicHoverProvider));
    context.subscriptions.push(vscode.languages.registerFoldingRangeProvider('magic',
        new MagicFoldingProvider));
}
