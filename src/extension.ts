'use strict';

import * as vscode from 'vscode';

import MagicHoverProvider from './features/hoverProvider';
import { MagicDocFormatProvider, MagicSelFormatProvider } from './features/formatProvider';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('magic',
        new MagicDocFormatProvider));
    context.subscriptions.push(vscode.languages.registerDocumentRangeFormattingEditProvider('magic',
        new MagicSelFormatProvider));
    context.subscriptions.push(vscode.languages.registerHoverProvider('magic',
        new MagicHoverProvider));
}
