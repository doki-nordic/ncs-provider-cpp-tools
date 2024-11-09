// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {CppToolsApi, Version, CustomConfigurationProvider, getCppToolsApi} from 'vscode-cpptools';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	activateAsync(context);

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ncs-provider-cpp-tools" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('ncs-provider-cpp-tools.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from NCS Configuration Provider for C/C++ for Visual Studio Code!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

async function activateAsync(context: vscode.ExtensionContext) {
	let api: CppToolsApi|undefined = await getCppToolsApi(Version.v2);
	console.log(api);

    if (api) {
        if (api.notifyReady) {
            // Inform cpptools that a custom config provider will be able to service the current workspace.
            api.registerCustomConfigurationProvider(provider);

            // Do any required setup that the provider needs.

            // Notify cpptools that the provider is ready to provide IntelliSense configurations.
            api.notifyReady(provider);
        } else {
            // Running on a version of cpptools that doesn't support v2 yet.
            
            // Do any required setup that the provider needs.

            // Inform cpptools that a custom config provider will be able to service the current workspace.
            api.registerCustomConfigurationProvider(provider);
            api.didChangeCustomConfiguration(provider);
        }
    }
}
