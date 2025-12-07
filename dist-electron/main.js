"use strict";
const electron = require("electron");
const node_child_process = require("node:child_process");
const path = require("node:path");
const fs = require("node:fs");
const crypto = require("node:crypto");
class Store {
  constructor(fileName) {
    const userDataPath = electron.app.getPath("userData");
    this.path = path.join(userDataPath, fileName);
    const secret = "game-vault-secure-storage-key-v1";
    this.encryptionKey = crypto.scryptSync(secret, "salt", 32);
  }
  get(key) {
    try {
      if (!fs.existsSync(this.path)) {
        return void 0;
      }
      const data = JSON.parse(fs.readFileSync(this.path, "utf8"));
      const value = data[key];
      if (!value) return void 0;
      if (typeof value === "string" && value.startsWith("ENC:")) {
        return this.decrypt(value.substring(4));
      }
      return value;
    } catch (error) {
      console.error("Error reading store:", error);
      return void 0;
    }
  }
  set(key, value, encrypt = false) {
    try {
      let data = {};
      if (fs.existsSync(this.path)) {
        data = JSON.parse(fs.readFileSync(this.path, "utf8"));
      }
      if (encrypt) {
        data[key] = "ENC:" + this.encrypt(value);
      } else {
        data[key] = value;
      }
      fs.writeFileSync(this.path, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error writing to store:", error);
    }
  }
  encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", this.encryptionKey, iv);
    let encrypted = cipher.update(JSON.stringify(text));
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
  }
  decrypt(text) {
    const textParts = text.split(":");
    const iv = Buffer.from(textParts.shift(), "hex");
    const encryptedText = Buffer.from(textParts.join(":"), "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", this.encryptionKey, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return JSON.parse(decrypted.toString());
  }
}
const store = new Store("data.json");
electron.ipcMain.handle("save-data", async (_, key, data, encrypt = false) => {
  store.set(key, data, encrypt);
  return true;
});
electron.ipcMain.handle("load-data", async (_, key) => {
  return store.get(key);
});
electron.ipcMain.handle("select-game-exe", async () => {
  const result = await electron.dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Executables", extensions: ["exe"] }]
  });
  return result.filePaths[0];
});
electron.ipcMain.handle("select-folder", async () => {
  const result = await electron.dialog.showOpenDialog({
    properties: ["openDirectory"]
  });
  return result.filePaths[0];
});
electron.ipcMain.handle("save-backup", async (_, data) => {
  const result = await electron.dialog.showSaveDialog({
    title: "Save Backup",
    defaultPath: "gamevault-backup.json",
    filters: [{ name: "JSON", extensions: ["json"] }]
  });
  if (!result.canceled && result.filePath) {
    fs.writeFileSync(result.filePath, data);
    return true;
  }
  return false;
});
electron.ipcMain.handle("load-backup", async () => {
  const result = await electron.dialog.showOpenDialog({
    title: "Load Backup",
    filters: [{ name: "JSON", extensions: ["json"] }],
    properties: ["openFile"]
  });
  if (!result.canceled && result.filePaths.length > 0) {
    const data = fs.readFileSync(result.filePaths[0], "utf-8");
    return JSON.parse(data);
  }
  return null;
});
electron.ipcMain.handle("open-path", async (_, filePath) => {
  electron.shell.showItemInFolder(filePath);
});
electron.ipcMain.handle("select-image", async () => {
  const result = await electron.dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Images", extensions: ["jpg", "png", "webp", "jpeg"] }]
  });
  return result.filePaths[0];
});
electron.ipcMain.handle("launch-external", async (_, protocol2) => {
  try {
    await electron.shell.openExternal(protocol2);
    return true;
  } catch (e) {
    console.error("Failed to open external protocol:", e);
    return false;
  }
});
electron.ipcMain.handle("window-minimize", () => {
  win == null ? void 0 : win.minimize();
});
electron.ipcMain.handle("window-maximize", () => {
  if (win == null ? void 0 : win.isMaximized()) {
    win.unmaximize();
  } else {
    win == null ? void 0 : win.maximize();
  }
});
electron.ipcMain.handle("window-close", () => {
  win == null ? void 0 : win.close();
});
electron.ipcMain.handle("launch-game", async (_, game) => {
  return new Promise((resolve, reject) => {
    const exeName = path.basename(game.executablePath);
    console.log(`Preparing to launch ${exeName}...`);
    if (game.steamAppId) {
      console.log(`Launching Steam game: ${game.steamAppId}`);
      electron.shell.openExternal(`steam://run/${game.steamAppId}`);
    } else {
      console.log(`Launching executable: ${game.executablePath}`);
      const gameProcess = node_child_process.spawn(game.executablePath, [], {
        detached: true,
        stdio: "ignore",
        cwd: path.dirname(game.executablePath)
      });
      gameProcess.unref();
    }
    resolve(true);
    let attempts = 0;
    const maxAttempts = 30;
    const checkProcess = () => {
      node_child_process.exec("tasklist /FO CSV /NH", (err, stdout) => {
        if (err) {
          console.error("Tasklist error:", err);
        }
        const processList = stdout.toLowerCase();
        const targetExe = exeName.toLowerCase();
        const isRunning = processList.includes(`"${targetExe}"`);
        if (isRunning) {
          console.log(`Game process ${exeName} detected! Monitoring...`);
          const monitorInterval = setInterval(() => {
            node_child_process.exec("tasklist /FO CSV /NH", (err2, stdout2) => {
              const currentList = stdout2.toLowerCase();
              const stillRunning = currentList.includes(`"${targetExe}"`);
              if (!stillRunning) {
                clearInterval(monitorInterval);
                console.log(`Game process ${exeName} exited.`);
                win == null ? void 0 : win.webContents.send("game-exited");
              }
            });
          }, 2e3);
        } else {
          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(checkProcess, 2e3);
          } else {
            console.log(`Timed out waiting for ${exeName} to start.`);
            win == null ? void 0 : win.webContents.send("game-exited");
          }
        }
      });
    };
    setTimeout(checkProcess, 2e3);
  });
});
electron.ipcMain.handle("stop-game", async (_, executablePath) => {
  const exeName = path.basename(executablePath);
  console.log(`Stopping game: ${exeName}`);
  return new Promise((resolve) => {
    node_child_process.exec(`taskkill /IM "${exeName}" /F`, (err, stdout, stderr) => {
      var _a;
      if (err) {
        console.error(`Failed to kill process ${exeName}:`, err);
        if (stderr.includes("Access is denied") || ((_a = err.message) == null ? void 0 : _a.includes("Access is denied"))) {
          console.log("Access denied. Retrying with Admin privileges...");
          node_child_process.exec(`powershell Start-Process taskkill -ArgumentList '/IM "${exeName}" /F' -Verb RunAs`, (adminErr) => {
            if (adminErr) {
              console.error("Failed to kill process as Admin:", adminErr);
              resolve(false);
            } else {
              console.log(`Successfully triggered Admin kill for ${exeName}`);
              resolve(true);
            }
          });
        } else {
          resolve(false);
        }
      } else {
        console.log(`Successfully killed ${exeName}`);
        resolve(true);
      }
    });
  });
});
const checkRegistryForPath = (keyPath, valueName) => {
  return new Promise((resolve) => {
    node_child_process.exec(`reg query "${keyPath}" /v "${valueName}"`, (err, stdout) => {
      if (err) {
        resolve(null);
        return;
      }
      const match = stdout.match(/REG_SZ\s+(.+)/);
      if (match && match[1]) {
        resolve(match[1].trim());
      } else {
        resolve(null);
      }
    });
  });
};
electron.ipcMain.handle("check-app-installed", async (_, appId) => {
  const commonPaths = {
    steam: [
      "C:\\Program Files (x86)\\Steam\\steam.exe",
      "C:\\Program Files\\Steam\\steam.exe"
    ],
    epic: [
      "C:\\Program Files (x86)\\Epic Games\\Launcher\\Portal\\Binaries\\Win32\\EpicGamesLauncher.exe",
      "C:\\Program Files (x86)\\Epic Games\\Launcher\\Portal\\Binaries\\Win64\\EpicGamesLauncher.exe",
      "C:\\Program Files\\Epic Games\\Launcher\\Portal\\Binaries\\Win32\\EpicGamesLauncher.exe",
      "C:\\Program Files\\Epic Games\\Launcher\\Portal\\Binaries\\Win64\\EpicGamesLauncher.exe"
    ],
    gog: [
      "C:\\Program Files (x86)\\GOG Galaxy\\GalaxyClient.exe",
      "C:\\Program Files\\GOG Galaxy\\GalaxyClient.exe"
    ]
  };
  const pathsToCheck = commonPaths[appId] || [];
  for (const p of pathsToCheck) {
    if (fs.existsSync(p)) {
      return true;
    }
  }
  try {
    if (appId === "steam") {
      const path2 = await checkRegistryForPath("HKCU\\Software\\Valve\\Steam", "SteamExe");
      if (path2 && fs.existsSync(path2)) return true;
    } else if (appId === "epic") {
      let path2 = await checkRegistryForPath("HKLM\\SOFTWARE\\WOW6432Node\\Epic Games\\EpicGamesLauncher", "AppDataPath");
      if (path2) {
        return true;
      }
    } else if (appId === "gog") {
      const path2 = await checkRegistryForPath("HKLM\\SOFTWARE\\WOW6432Node\\GOG.com\\GalaxyClient", "clientExecutable");
      if (path2 && fs.existsSync(path2)) return true;
    }
  } catch (e) {
    console.error(`Registry check failed for ${appId}:`, e);
  }
  return false;
});
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
let win = null;
electron.ipcMain.handle("scan-games", async (_, customPath) => {
  console.log("Starting smart game scan...", customPath ? `Custom path: ${customPath}` : "Full scan");
  const foundGames = [];
  const getDrives = async () => {
    return new Promise((resolve) => {
      node_child_process.exec("wmic logicaldisk get name", (error, stdout) => {
        if (error) {
          resolve(["C:", "D:", "E:"]);
          return;
        }
        const drives2 = stdout.split("\n").map((line) => line.trim()).filter((line) => /^[A-Z]:$/.test(line));
        resolve(drives2.length > 0 ? drives2 : ["C:", "D:", "E:"]);
      });
    });
  };
  const drives = await getDrives();
  console.log("Detected drives:", drives);
  const blocklist = [
    "unins",
    "setup",
    "update",
    "crash",
    "config",
    "redist",
    "framework",
    "helper",
    "sys",
    "dx",
    "vcredist",
    "microsoft",
    "windows",
    "common files",
    "internet explorer",
    "reference assemblies",
    "windows defender"
  ];
  const gameSignatures = [
    "steam_api.dll",
    "steam_api64.dll",
    "galaxy.dll",
    "UnityPlayer.dll",
    "fmod.dll",
    "D3Dcompiler_47.dll",
    "os_api.dll",
    "bink2w64.dll"
  ];
  const hasGameSignatures = (dir) => {
    try {
      return fs.readdirSync(dir).some((f) => gameSignatures.includes(f));
    } catch {
      return false;
    }
  };
  const parseAcf = (content) => {
    const nameMatch = content.match(/"name"\s+"([^"]+)"/i);
    const installDirMatch = content.match(/"installdir"\s+"([^"]+)"/i);
    const appIdMatch = content.match(/"appid"\s+"(\d+)"/i);
    if (nameMatch && installDirMatch) {
      return {
        name: nameMatch[1],
        installDir: installDirMatch[1],
        appId: appIdMatch ? appIdMatch[1] : void 0
      };
    }
    return null;
  };
  const scanManualDir = (rootDir, currentDepth = 0, maxDepth = 3, strict = false) => {
    if (!fs.existsSync(rootDir)) return;
    if (currentDepth > maxDepth) return;
    try {
      const folders = fs.readdirSync(rootDir);
      for (const folder of folders) {
        if (blocklist.some((b) => folder.toLowerCase().includes(b))) continue;
        const gamePath = path.join(rootDir, folder);
        try {
          const stats = fs.statSync(gamePath);
          if (!stats.isDirectory()) continue;
          const hasSigs = hasGameSignatures(gamePath);
          const files = fs.readdirSync(gamePath);
          const exes = files.filter((f) => f.toLowerCase().endsWith(".exe"));
          const validExes = exes.filter((e) => !blocklist.some((b) => e.toLowerCase().includes(b)));
          let isGame = false;
          let bestExe = "";
          if (hasSigs) {
            isGame = true;
          } else if (validExes.length > 0) {
            const matchingExe = validExes.find((e) => e.toLowerCase().includes(folder.toLowerCase()));
            if (matchingExe) {
              bestExe = matchingExe;
              isGame = true;
            } else if (!strict) {
              const sortedExes = validExes.sort((a, b) => {
                try {
                  return fs.statSync(path.join(gamePath, b)).size - fs.statSync(path.join(gamePath, a)).size;
                } catch {
                  return 0;
                }
              });
              const largestExe = sortedExes[0];
              const largestSize = fs.statSync(path.join(gamePath, largestExe)).size;
              if (largestSize > 20 * 1024 * 1024) {
                bestExe = largestExe;
                isGame = true;
              }
            }
          }
          if (isGame) {
            if (!bestExe && validExes.length > 0) {
              bestExe = validExes.find((e) => e.toLowerCase().includes(folder.toLowerCase())) || validExes[0];
            }
            if (bestExe) {
              foundGames.push({ name: folder, path: path.join(gamePath, bestExe) });
              continue;
            }
          }
          scanManualDir(gamePath, currentDepth + 1, maxDepth, strict);
        } catch {
        }
      }
    } catch {
    }
  };
  if (customPath) {
    console.log(`Scanning custom path: ${customPath}`);
    scanManualDir(customPath, 0, 5, false);
    const uniqueGames2 = foundGames.filter(
      (game, index, self) => index === self.findIndex((t) => t.path === game.path)
    );
    const finalGames2 = [];
    const names2 = /* @__PURE__ */ new Set();
    for (const game of uniqueGames2) {
      if (!names2.has(game.name)) {
        names2.add(game.name);
        finalGames2.push(game);
      }
    }
    console.log(`Custom scan complete. Found ${finalGames2.length} games.`);
    return finalGames2;
  }
  const steamPaths = [
    "C:\\Program Files (x86)\\Steam",
    "C:\\Program Files\\Steam"
  ];
  for (const drive of drives) {
    steamPaths.push(`${drive}\\SteamLibrary`);
    steamPaths.push(`${drive}\\Steam`);
  }
  const potentialSteamRoots = [
    "C:\\Program Files (x86)\\Steam",
    "C:\\Program Files\\Steam",
    ...drives.map((d) => `${d}\\Steam`)
  ];
  for (const root of potentialSteamRoots) {
    const vdfPath = path.join(root, "steamapps", "libraryfolders.vdf");
    if (fs.existsSync(vdfPath)) {
      try {
        const content = fs.readFileSync(vdfPath, "utf-8");
        const pathMatches = content.match(/"path"\s+"([^"]+)"/g);
        if (pathMatches) {
          pathMatches.forEach((match) => {
            const libPath = match.split('"')[3].replace(/\\\\/g, "\\");
            if (!steamPaths.includes(libPath)) {
              steamPaths.push(libPath);
            }
          });
        }
      } catch (e) {
        console.error("Error parsing libraryfolders.vdf:", e);
      }
    }
  }
  for (const steamPath of steamPaths) {
    const steamAppsPath = path.join(steamPath, "steamapps");
    if (fs.existsSync(steamAppsPath)) {
      try {
        const files = fs.readdirSync(steamAppsPath);
        for (const file of files) {
          if (file.startsWith("appmanifest_") && file.endsWith(".acf")) {
            try {
              const content = fs.readFileSync(path.join(steamAppsPath, file), "utf-8");
              const gameData = parseAcf(content);
              if (gameData) {
                const gamePath = path.join(steamAppsPath, "common", gameData.installDir);
                if (fs.existsSync(gamePath)) {
                  try {
                    const gameFiles = fs.readdirSync(gamePath);
                    const exes = gameFiles.filter((f) => f.toLowerCase().endsWith(".exe"));
                    let bestExe = "";
                    bestExe = exes.find((e) => e.toLowerCase().includes(gameData.installDir.toLowerCase())) || "";
                    if (!bestExe) bestExe = exes.find((e) => ["launcher.exe", "game.exe", "start.exe"].includes(e.toLowerCase())) || "";
                    if (!bestExe && exes.length > 0) {
                      const exeSizes = exes.map((e) => {
                        try {
                          return { name: e, size: fs.statSync(path.join(gamePath, e)).size };
                        } catch {
                          return { name: e, size: 0 };
                        }
                      });
                      exeSizes.sort((a, b) => b.size - a.size);
                      bestExe = exeSizes[0].name;
                    }
                    if (bestExe) {
                      foundGames.push({
                        name: gameData.name,
                        path: path.join(gamePath, bestExe),
                        steamAppId: gameData.appId
                      });
                    }
                  } catch (e) {
                  }
                }
              }
            } catch (e) {
            }
          }
        }
      } catch (e) {
      }
    }
  }
  const commonGameRoots = [
    "C:\\Games",
    "C:\\Program Files\\Epic Games",
    "C:\\Program Files (x86)\\Epic Games",
    "C:\\Program Files\\GOG Galaxy\\Games",
    "C:\\GOG Galaxy\\Games",
    "C:\\Program Files (x86)\\Ubisoft\\Ubisoft Game Launcher\\games",
    "C:\\Program Files\\Ubisoft\\Ubisoft Game Launcher\\games",
    "C:\\XboxGames"
  ];
  for (const drive of drives) {
    if (drive === "C:") continue;
    commonGameRoots.push(`${drive}\\Games`);
    commonGameRoots.push(`${drive}\\Epic Games`);
    commonGameRoots.push(`${drive}\\Program Files\\Epic Games`);
    commonGameRoots.push(`${drive}\\GOG Galaxy\\Games`);
  }
  for (const root of commonGameRoots) {
    scanManualDir(root, 0, 3, true);
  }
  const uniqueGames = foundGames.filter(
    (game, index, self) => index === self.findIndex((t) => t.path === game.path)
  );
  const finalGames = [];
  const names = /* @__PURE__ */ new Set();
  for (const game of uniqueGames) {
    if (!names.has(game.name)) {
      names.add(game.name);
      finalGames.push(game);
    }
  }
  console.log(`Scan complete. Found ${finalGames.length} games.`);
  return finalGames;
});
electron.ipcMain.handle("get-game-screenshots", async (_, gameName) => {
  try {
    const screenshotsDir = path.join(electron.app.getPath("userData"), "screenshots", gameName);
    if (!fs.existsSync(screenshotsDir)) return [];
    const files = fs.readdirSync(screenshotsDir);
    return files.filter((file) => file.endsWith(".png")).map((file) => `media://${gameName}/${file}`);
  } catch (error) {
    console.error("Failed to get screenshots:", error);
    return [];
  }
});
electron.ipcMain.handle("open-screenshots-folder", async (_, gameName) => {
  const screenshotsDir = path.join(electron.app.getPath("userData"), "screenshots", gameName);
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  await electron.shell.openPath(screenshotsDir);
});
electron.protocol.registerSchemesAsPrivileged([
  { scheme: "media", privileges: { secure: true, standard: true, supportFetchAPI: true, corsEnabled: true } }
]);
electron.app.whenReady().then(() => {
  electron.protocol.registerFileProtocol("media", (request, callback) => {
    const url = request.url.replace("media://", "");
    try {
      const decodedUrl = decodeURIComponent(url);
      if (decodedUrl.includes("..")) {
        callback({ path: "" });
        return;
      }
      const filePath = path.join(electron.app.getPath("userData"), "screenshots", decodedUrl);
      callback({ path: filePath });
    } catch (error) {
      console.error("Failed to handle media protocol:", error);
      callback({ path: "" });
    }
  });
  createWindow();
  startGlobalMonitoring();
});
const logFile = path.join(process.cwd(), "debug_log.txt");
const log = (msg) => {
  try {
    fs.appendFileSync(logFile, `[${(/* @__PURE__ */ new Date()).toISOString()}] ${msg}
`);
  } catch (e) {
    console.error("Failed to write to log file:", e);
  }
};
const takeScreenshotNew = async (gameName, executablePath) => {
  log(`Attempting to take screenshot for ${gameName} (Exe: ${executablePath})...`);
  try {
    const primaryDisplay = electron.screen.getPrimaryDisplay();
    const sources = await electron.desktopCapturer.getSources({
      types: ["window", "screen"],
      thumbnailSize: primaryDisplay.size,
      // Request full resolution
      fetchWindowIcons: false
    });
    let targetSource = null;
    const exeName = executablePath ? path.basename(executablePath, path.extname(executablePath)).toLowerCase() : "";
    if (!targetSource) {
      targetSource = sources.find((s) => s.name.toLowerCase() === gameName.toLowerCase());
      if (targetSource) log(`Found window matching game title: ${targetSource.name}`);
    }
    if (!targetSource && exeName) {
      targetSource = sources.find((s) => s.name.toLowerCase().includes(exeName));
      if (targetSource) log(`Found window matching executable name: ${targetSource.name}`);
    }
    if (!targetSource) {
      targetSource = sources.find((s) => s.name.toLowerCase().includes(gameName.toLowerCase()));
      if (targetSource) log(`Found window fuzzy matching game title: ${targetSource.name}`);
    }
    if (!targetSource) {
      log("No matching window found. Falling back to primary display.");
      targetSource = sources.find((s) => s.display_id === primaryDisplay.id.toString()) || sources.find((s) => s.name === "Entire Screen") || sources[0];
    }
    if (targetSource) {
      const image = targetSource.thumbnail;
      const screenshotsDir = path.join(electron.app.getPath("userData"), "screenshots", gameName);
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
      }
      const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
      const filename = `screenshot-${timestamp}.png`;
      const filePath = path.join(screenshotsDir, filename);
      fs.writeFileSync(filePath, image.toPNG());
      log(`Screenshot saved to: ${filePath}`);
      win == null ? void 0 : win.webContents.send("screenshot-captured", { path: filePath, gameName });
    } else {
      log("No source found for screenshot.");
    }
  } catch (error) {
    log(`Failed to take screenshot: ${error}`);
    console.error("Failed to take screenshot:", error);
  }
};
const registerScreenshotShortcut = (gameName, executablePath) => {
  log(`Attempting to register screenshot shortcut for ${gameName}`);
  const shortcuts = ["F12", "CommandOrControl+F12", "F9"];
  let registered = false;
  for (const key of shortcuts) {
    try {
      if (electron.globalShortcut.isRegistered(key)) {
        log(`${key} is already registered. Unregistering first...`);
        electron.globalShortcut.unregister(key);
      }
      const ret = electron.globalShortcut.register(key, () => {
        log(`${key} pressed - Taking screenshot...`);
        takeScreenshotNew(gameName, executablePath);
      });
      if (ret) {
        log(`Screenshot shortcut (${key}) registered successfully.`);
        win == null ? void 0 : win.webContents.send("shortcut-registered", key);
        registered = true;
        break;
      } else {
        log(`Failed to register ${key}.`);
      }
    } catch (err) {
      log(`Error registering ${key}: ${err}`);
    }
  }
  if (!registered) {
    log("All shortcut registration attempts failed.");
    win == null ? void 0 : win.webContents.send("shortcut-registration-failed");
  }
};
const unregisterScreenshotShortcut = () => {
  const shortcuts = ["F12", "CommandOrControl+F12", "F9"];
  shortcuts.forEach((key) => {
    if (electron.globalShortcut.isRegistered(key)) {
      electron.globalShortcut.unregister(key);
      log(`Screenshot shortcut (${key}) unregistered`);
    }
  });
};
let globalMonitorInterval = null;
const startGlobalMonitoring = () => {
  if (globalMonitorInterval) return;
  console.log("Starting global game monitoring...");
  log("Starting global game monitoring...");
  const runningGames = /* @__PURE__ */ new Set();
  let activeGameName = null;
  globalMonitorInterval = setInterval(async () => {
    const gamesData = store.get("games");
    if (!gamesData || !Array.isArray(gamesData) || gamesData.length === 0) {
      return;
    }
    node_child_process.exec("tasklist /FO CSV /NH", (err, stdout) => {
      if (err) {
        log(`Tasklist error: ${err.message}`);
        return;
      }
      const processList = stdout.toLowerCase();
      const currentDetectedPaths = /* @__PURE__ */ new Set();
      for (const game of gamesData) {
        if (game.executablePath) {
          const exeName = path.basename(game.executablePath).toLowerCase();
          const fullPath = game.executablePath.toLowerCase();
          if (processList.includes(`"${exeName}"`)) {
            currentDetectedPaths.add(fullPath);
            if (!runningGames.has(fullPath)) {
              log(`MATCH FOUND! ${exeName} started.`);
              runningGames.add(fullPath);
              win == null ? void 0 : win.webContents.send("game-detected", game);
              activeGameName = game.title;
              registerScreenshotShortcut(game.title, game.executablePath);
            }
          }
        }
      }
      for (const runningPath of runningGames) {
        if (!currentDetectedPaths.has(runningPath)) {
          log(`Game exited: ${path.basename(runningPath)}`);
          runningGames.delete(runningPath);
          const game = gamesData.find((g) => {
            var _a;
            return ((_a = g.executablePath) == null ? void 0 : _a.toLowerCase()) === runningPath;
          });
          if (game) {
            win == null ? void 0 : win.webContents.send("game-exited", game);
            if (activeGameName === game.title) {
              unregisterScreenshotShortcut();
              activeGameName = null;
              if (runningGames.size > 0) {
                const nextGamePath = Array.from(runningGames)[0];
                const nextGame = gamesData.find((g) => {
                  var _a;
                  return ((_a = g.executablePath) == null ? void 0 : _a.toLowerCase()) === nextGamePath;
                });
                if (nextGame) {
                  activeGameName = nextGame.title;
                  registerScreenshotShortcut(nextGame.title, nextGame.executablePath);
                }
              }
            }
          }
        }
      }
    });
  }, 5e3);
};
function createWindow() {
  const preloadPath = path.join(__dirname, "preload.js");
  console.log("Preload path:", preloadPath);
  win = new electron.BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 600,
    icon: path.join(process.env.VITE_PUBLIC || path.join(__dirname, "../src/public"), "VAULTED.ico"),
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: true,
      contextIsolation: true
    },
    frame: false,
    // Custom title bar
    titleBarStyle: "hidden",
    title: "VAULTED Game Launcher",
    backgroundColor: "#000000"
  });
  win.webContents.on("before-input-event", (event, input) => {
    if (input.control && input.shift && input.key.toLowerCase() === "i") {
      event.preventDefault();
      console.log("Blocked DevTools shortcut");
    }
    if (input.key === "F12") {
      event.preventDefault();
      console.log("Blocked F12 shortcut");
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
    if (electron.app.isPackaged) {
      const { autoUpdater } = require("electron-updater");
      autoUpdater.checkForUpdatesAndNotify();
      autoUpdater.on("update-available", () => {
        win == null ? void 0 : win.webContents.send("update-available");
      });
      autoUpdater.on("update-downloaded", () => {
        win == null ? void 0 : win.webContents.send("update-downloaded");
      });
    }
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  }
}
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
    win = null;
  }
});
electron.app.on("activate", () => {
  if (electron.BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
