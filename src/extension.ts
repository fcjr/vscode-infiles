// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(doc => {
		let editor = vscode.window.visibleTextEditors.find(e => e.document === doc);
			if (editor) {
				checkForIn(editor);
			}
	}));
	checkForIn(vscode.window.activeTextEditor);
}

function checkForIn(editor: vscode.TextEditor|undefined): void {
	if (!editor || !editor.document || editor.document.isUntitled) {
		return;
	}
	try {
		let fileName = editor.document.fileName;
		let lastDot = fileName.lastIndexOf('.');
		if (lastDot === -1) {
			return;
		}
		let fileExt = fileName.slice(lastDot);
		if (fileExt !== '.in') {
			return;
		}
		let realFilename = fileName.slice(0, lastDot);
		let language = detectLanguage(realFilename);

		if (language && language.length > 0) {
			vscode.languages.getLanguages().then(codelangs => {
				let codelang = codelangs.find(codelang => codelang.toLowerCase() === language.toLowerCase());
				if (codelang) {
					console.log('[in-files] setting language to ' + codelang);
					vscode.languages.setTextDocumentLanguage(editor.document, codelang);
				}
			});
		}
	} catch (err) {
		console.error(err);
	}
}

function detectLanguage(fileName: string|undefined): string {
	if (fileName === undefined) {
		return '';
	}
	let lastDot = fileName.lastIndexOf('.');
	if (lastDot === -1) {
		return '';
	}
	let fileExt = fileName.slice(lastDot);
	switch (fileExt.substring(1).toLowerCase()) {
		case 'swift':
			return 'swift';
		case 'json':
			return 'json';
		case 'json5':
			return 'json5';
		case 'go':
			return 'go';
		case 'c':
		case 'h':
			return 'c';
		case 'jsx':
			return 'javascriptreact';
		case 'js':
			return 'javascript';
		case 'cpp':
			return 'cpp';
		case 'sh':
		case 'zsh':
		case 'ksh':
		case 'csh':
		case 'bash':
			return 'shellscript';
		case 'bat':
			return 'bat';
		default:
			return '';
	}
} 

// this method is called when your extension is deactivated
export function deactivate() {}
