'use strict';

import * as vscode from 'vscode';

import MagicHoverProvider from './features/hoverProvider';
import { MagicDocFormatProvider, MagicSelFormatProvider } from './features/formatProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "magic" is now active!');
    vscode.languages.registerDocumentFormattingEditProvider('magic', new MagicDocFormatProvider);
    vscode.languages.registerDocumentRangeFormattingEditProvider('magic', new MagicSelFormatProvider);
    vscode.languages.registerHoverProvider('magic', new MagicHoverProvider);
}
