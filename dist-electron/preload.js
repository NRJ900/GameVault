"use strict";
const electron = require("electron");
console.log("Preload script loading...");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, listener);
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  },
  // Custom APIs
  selectGameExe: () => electron.ipcRenderer.invoke("select-game-exe"),
  launchGame: (game) => electron.ipcRenderer.invoke("launch-game", game),
  scanGames: (path) => electron.ipcRenderer.invoke("scan-games", path),
  openPath: (path) => electron.ipcRenderer.invoke("open-path", path),
  saveData: (key, data, encrypt = false) => electron.ipcRenderer.invoke("save-data", key, data, encrypt),
  loadData: (key) => electron.ipcRenderer.invoke("load-data", key),
  saveBackup: (data) => electron.ipcRenderer.invoke("save-backup", data),
  loadBackup: () => electron.ipcRenderer.invoke("load-backup"),
  selectImage: () => electron.ipcRenderer.invoke("select-image"),
  launchExternal: (protocol) => electron.ipcRenderer.invoke("launch-external", protocol),
  stopGame: (path) => electron.ipcRenderer.invoke("stop-game", path),
  minimize: () => electron.ipcRenderer.invoke("window-minimize"),
  maximize: () => electron.ipcRenderer.invoke("window-maximize"),
  close: () => electron.ipcRenderer.invoke("window-close"),
  checkAppInstalled: (appId) => electron.ipcRenderer.invoke("check-app-installed", appId),
  getGameScreenshots: (gameName) => electron.ipcRenderer.invoke("get-game-screenshots", gameName)
});
