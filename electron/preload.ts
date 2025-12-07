import { contextBridge, ipcRenderer } from 'electron'

console.log('Preload script loading...')

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
    on(...args: Parameters<typeof ipcRenderer.on>) {
        const [channel, listener] = args
        return ipcRenderer.on(channel, listener)
    },
    off(...args: Parameters<typeof ipcRenderer.off>) {
        const [channel, ...omit] = args
        return ipcRenderer.off(channel, ...omit)
    },
    send(...args: Parameters<typeof ipcRenderer.send>) {
        const [channel, ...omit] = args
        return ipcRenderer.send(channel, ...omit)
    },
    invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
        const [channel, ...omit] = args
        return ipcRenderer.invoke(channel, ...omit)
    },

    // Custom APIs
    selectGameExe: () => ipcRenderer.invoke('select-game-exe'),
    launchGame: (game: { executablePath: string; steamAppId?: string }) => ipcRenderer.invoke('launch-game', game),
    scanGames: (path?: string) => ipcRenderer.invoke('scan-games', path),
    openPath: (path: string) => ipcRenderer.invoke('open-path', path),
    saveData: (key: string, data: any, encrypt: boolean = false) => ipcRenderer.invoke('save-data', key, data, encrypt),
    loadData: (key: string) => ipcRenderer.invoke('load-data', key),
    saveBackup: (data: string) => ipcRenderer.invoke('save-backup', data),
    loadBackup: () => ipcRenderer.invoke('load-backup'),
    selectImage: () => ipcRenderer.invoke('select-image'),
    launchExternal: (protocol: string) => ipcRenderer.invoke('launch-external', protocol),
    stopGame: (path: string) => ipcRenderer.invoke('stop-game', path),
    minimize: () => ipcRenderer.invoke('window-minimize'),
    maximize: () => ipcRenderer.invoke('window-maximize'),
    close: () => ipcRenderer.invoke('window-close'),
    checkAppInstalled: (appId: 'steam' | 'epic' | 'gog') => ipcRenderer.invoke('check-app-installed', appId),
    getGameScreenshots: (gameName: string) => ipcRenderer.invoke('get-game-screenshots', gameName),
})
