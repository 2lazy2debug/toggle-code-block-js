const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let disposable = vscode.commands.registerCommand('simple-comment-toggle.toggleCodeBlock', function () {
		const editor = vscode.window.activeTextEditor;

		var position;

		if (editor.selection.isEmpty) {
			position = editor.selection.active;
			//Find all comment blocks
			editor.document.getText().match(/(\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/)|(\/\/.*)/g).forEach(
				commentBlock => {
					//comment block array
					let cbArray = commentBlock.split('\n');

					let comIndex = cbArray.findIndex(
						(commentLine) => {
							return commentLine.includes(editor.document.lineAt(position.line).text) 
						}
					);

					if (comIndex > -1) {
						let comStartLine = position.line - comIndex
						let comEndLine = comStartLine + cbArray.length -1;

						editor.edit(editBuilder => {
							let range = new vscode.Range(comStartLine, 0,comEndLine, (cbArray[cbArray.length-1].length))
							editBuilder.replace(range, commentBlock.replace(new RegExp(/\/\**|\**\//g), "").replace("*", ""))
						})
					}

				}
			);
		}
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
