// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	console.log('Congratulations, your extension "Toggle Code Block" is now active!');

	let disposable = vscode.commands.registerCommand('simple-comment-toggle.toggleCodeBlock', function () {

		const editor = vscode.window.activeTextEditor;
		var position;

		if (editor.selection.isEmpty) {
			console.log('got here')
			position = editor.selection.active;
			//Find all comment blocks
			editor.document.getText().match(/(\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/)|(\/\/.*)/g).forEach(
				commentBlock => {
					console.log('and here')

					//comment block array
					let cbArray = commentBlock.split('\n');

					vscode.window.showInformationMessage(`cursor position line: ${position.line}`);

					let comIndex = cbArray.findIndex(
						(commentLine, index) => {
							console.log('also here with ' + commentLine + ' feat ' + index)
							return commentLine.includes(editor.document.lineAt(position.line).text) 
						}
					);

					if (comIndex > -1) {
						let comStartLine = position.line - comIndex
						let comEndLine = comStartLine + cbArray.length -1;

						editor.edit(editBuilder => {
							let range = new vscode.Range(comStartLine, 0,comEndLine, (cbArray[cbArray.length-1].length))
							console.log(range)
							editBuilder.replace(range, commentBlock.replace(new RegExp(/\/\**|\**\//g), "").replace("*", ""))
						})
					}

				}
			);
		}

		// Display a message box to the user
		//vscode.window.showInformationMessage(`cursor position line: ${position.line}, cursor position char: ${position.character}`);
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
