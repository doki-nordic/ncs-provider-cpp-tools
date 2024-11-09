// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CppToolsApi, Version, CustomConfigurationProvider, getCppToolsApi, SourceFileConfigurationItem, WorkspaceBrowseConfiguration } from 'vscode-cpptools';


export function activate(context: vscode.ExtensionContext) {
    activateAsync(context);
}

// This method is called when your extension is deactivated
export function deactivate() {

}

class MyProvider implements CustomConfigurationProvider {

    public name: string = "ncs-provider";
    public extensionId: string;

    constructor(private context: vscode.ExtensionContext) {
        console.log('Provider constructed', context.storageUri?.fsPath);
        this.extensionId = context.extension.id;
    }

    async canProvideConfiguration(uri: vscode.Uri, token?: vscode.CancellationToken): Promise<boolean> {
        console.log(`canProvideConfiguration: ${uri.toString()}`);
        return true;
    }

    async canProvideBrowseConfiguration(token?: vscode.CancellationToken): Promise<boolean> {
        console.log(`canProvideBrowseConfiguration`);
        return true;
    }

    async canProvideBrowseConfigurationsPerFolder(token?: vscode.CancellationToken): Promise<boolean> {
        console.log(`canProvideBrowseConfigurationsPerFolder`);
        return true;
    }

    async provideConfigurations(uris: vscode.Uri[], token?: vscode.CancellationToken): Promise<SourceFileConfigurationItem[]> {
        console.log(`provideConfigurations: ${uris.map(x => x.toString()).join(', ')}`);
        let res: SourceFileConfigurationItem[] = [];
        for (let uri of uris) {
            res.push({
                uri,
                configuration: {
                    defines: ['SOME=123', 'FUNC=aaaa'],
                    includePath: ['C:\\work\\env\\ncs-provider-cpp-tools\\temp'],
                    forcedInclude: [],
                    standard: 'gnu17',
                    intelliSenseMode: 'gcc-arm',
                }
            });
        }
        return res;
    }

    async provideBrowseConfiguration(token?: vscode.CancellationToken): Promise<WorkspaceBrowseConfiguration | null> {
        console.log(`provideBrowseConfiguration`);
        for (let folder of vscode.workspace.workspaceFolders ?? []) {
            console.log(`    Workspace ${folder.index}: ${folder.name} = ${folder.uri.fsPath}`);
        }
        return {
            browsePath: [
                vscode.workspace.workspaceFolders![0].uri.fsPath,
            ],
            standard: 'gnu17',
        };
    }

    async provideFolderBrowseConfiguration(uri: vscode.Uri, token?: vscode.CancellationToken): Promise<WorkspaceBrowseConfiguration | null> {
        console.log(`provideFolderBrowseConfiguration: ${uri.fsPath}`);
        return {
            browsePath: [
                vscode.workspace.workspaceFolders![0].uri.fsPath,
            ],
            standard: 'gnu17',
        };
    }

    dispose() {
        console.log("Dispose provider");
    }
}

async function activateAsync(context: vscode.ExtensionContext) {
    let api: CppToolsApi | undefined = await getCppToolsApi(Version.v6);

    if (api) {
        let provider = new MyProvider(context);
        context.subscriptions.push(provider);
        api.registerCustomConfigurationProvider(provider);
        api.notifyReady(provider);
    }
}
