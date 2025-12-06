
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_RAWG_API_KEY: string
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
interface Window {
    ipcRenderer: {
        on: (channel: string, listener: (event: any, ...args: any[]) => void) => void;
        off: (channel: string, listener: (event: any, ...args: any[]) => void) => void;
        selectGameExe: () => Promise<string | null>;
        launchGame: (game: { executablePath: string; steamAppId?: string }) => Promise<boolean>;
        scanGames: () => Promise<{ name: string; path: string; steamAppId?: string }[]>;
        openPath: (path: string) => Promise<void>;
        saveData: (key: string, data: any, encrypt?: boolean) => Promise<boolean>;
        loadData: (key: string) => Promise<any>;
        saveBackup: (data: string) => Promise<boolean>;
        loadBackup: () => Promise<any>;
        selectImage: () => Promise<string | undefined>;
        launchExternal: (protocol: string) => Promise<boolean>;
        stopGame: (path: string) => Promise<boolean>;
        minimize: () => Promise<void>;
        maximize: () => Promise<void>;
        close: () => Promise<void>;
        invoke: (channel: string, ...args: any[]) => Promise<any>;
    }
}
