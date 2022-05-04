import { join } from 'path';
import os from 'os';
import { BrowserWindow, app, ipcMain, dialog, shell } from 'electron';
import isDev from 'electron-is-dev';
import { mkdirSync, readdir, readdirSync, rmSync } from 'fs';
import childp from 'child_process';
import axios from 'axios';
import { decode, downloadLibrary, downloadVersion, exists, loadJson, shortSecurePath, writeJson } from './utils';
import {
  VERSIONS_PATH,
  SAVEDIR_PATH,
  LAUNCHER_TEMP_PATH,
  LAUNCHER_PATH,
  LAUNCHER_CACHE_PATH,
  LAUNCHER_PATCH_NOTES_PATH_OLD,
  PATCH_NOTES_PATH_OLD,
  LAUNCHER_CACHE_PATH_OLD,
  NOT_LAUNCHER_PATH,
  LAUNCHER_LOGS,
  MODS_PATH,
  MOD_LOADER_PATH,
  MOD_LOADER_URL,
  LIBRARIES_PATH
} from './constants';
import { Profile, Profiles } from './Profiles';
import { Version, Versions } from './Versions';
import { Settings } from './Settings';
import { PatchNotes } from './PatchNotes';
import { autoUpdater } from 'electron-updater';
import { JsonModLoader, JsonModLoaders } from './types';
axios.defaults.adapter = require('axios/lib/adapters/http.js');

app.setPath('crashDumps', join(LAUNCHER_CACHE_PATH, 'Crashpad'));
app.setPath('cache', LAUNCHER_CACHE_PATH);
app.setPath('logs', join(LAUNCHER_CACHE_PATH, 'logs'));
app.setPath('userData', LAUNCHER_CACHE_PATH);
app.disableHardwareAcceleration();

if (os.release().startsWith('6.1')) app.disableHardwareAcceleration();
if (process.platform === 'win32') app.setAppUserModelId(app.getName());
if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

app.on('quit', () => {
  rmSync(LAUNCHER_TEMP_PATH, { recursive: true, force: true });
});

mkdirSync(VERSIONS_PATH, { recursive: true });
mkdirSync(SAVEDIR_PATH, { recursive: true });
mkdirSync(MODS_PATH, { recursive: true });
mkdirSync(LIBRARIES_PATH, { recursive: true });
mkdirSync(LAUNCHER_TEMP_PATH, { recursive: true });

exists(NOT_LAUNCHER_PATH).then((ex) => {
  if (ex) rmSync(NOT_LAUNCHER_PATH, { recursive: true });
});
exists(LAUNCHER_CACHE_PATH_OLD).then((ex) => {
  if (ex) rmSync(LAUNCHER_CACHE_PATH_OLD, { recursive: true });
});
exists(LAUNCHER_PATCH_NOTES_PATH_OLD).then((ex) => {
  if (ex) rmSync(LAUNCHER_PATCH_NOTES_PATH_OLD);
});
exists(PATCH_NOTES_PATH_OLD).then((ex) => {
  if (ex) rmSync(PATCH_NOTES_PATH_OLD);
});

const MIN_WIDTH = 1018;
const MIN_HEIGHT = 640;

console.log(`Launcher Version: ${app.getVersion()}`);
console.log(`Operation System: ${os.version()}`);
console.log(`Application Data Directory: ${shortSecurePath(LAUNCHER_PATH)}`);
console.log(`Application WebCache Directory: ${shortSecurePath(LAUNCHER_CACHE_PATH)}`);
console.log(`x64: ${os.arch() === 'x64'}`);

let window: BrowserWindow;
let logOutputWin: BrowserWindow;

let updateDownloaded = false;

function createWindow() {
  window = new BrowserWindow({
    center: true,
    width: MIN_WIDTH,
    height: MIN_HEIGHT,
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    title: 'Minicraft Launcher',
    icon: isDev ? join(__dirname, '../..', 'resources/icon.ico') : undefined,
    show: true,
    backgroundColor: '#1f1f1f',
    resizable: true,
    webPreferences: {
      safeDialogs: true,
      devTools: isDev,
      preload: join(__dirname, 'preload.js')
    }
  });

  const port = process.env.PORT || 3000;
  const url = isDev ? `http://localhost:${port}` : join(__dirname, '../renderer/index.html');

  if (isDev) {
    window?.loadURL(url);
  } else {
    window?.loadFile(url);
  }

  window.once('ready-to-show', () => {
    try {
      autoUpdater.checkForUpdatesAndNotify();
    } catch (err) {
      console.log('autoUpdater.checkForUpdatesAndNotify(); err = ', err);
    }
  });

  window.menuBarVisible = false;
  Settings.load();
  Profiles.load();
  Versions.load();

  window.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  window.on('close', () => {
    Settings.save();
    Profiles.save();
  });
}

autoUpdater.on('update-available', (_event, releaseNotes, releaseName) => {
  window.webContents.send('ipc:update_available');

  const dialogOpts = {
    type: 'info',
    buttons: ['Ok'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new version is being downloaded.'
  };
  dialog.showMessageBox(dialogOpts);
});

autoUpdater.on('update-downloaded', (_event, releaseNotes, releaseName) => {
  window.webContents.send('ipc:update_downloaded');

  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new version has been downloaded. Restart the application to apply the updates.'
  };
  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall();
  });
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows();
    if (allWindows.length) {
      allWindows[0].focus();
    } else {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('quit', () => {
  if (updateDownloaded) autoUpdater.quitAndInstall();
});

app.on('second-instance', () => {
  if (window) {
    if (window.isMinimized()) window.restore();
    window.focus();
  }
});

Profiles.registerEvents();
Versions.registerEvents();
Settings.registerEvents();
PatchNotes.registerEvents();

ipcMain.handle('ipc:open_dir', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(window, {
    properties: ['openDirectory'],
    defaultPath: LAUNCHER_PATH
  });
  if (canceled) {
    return;
  } else {
    return filePaths[0];
  }
});

let modLoader: JsonModLoaders;

async function prepareModdedProfile(profile: Profile, version: Version) {
  window?.webContents.send('ipc:prepare_start');
  console.log('prepare start');

  if (modLoader === undefined) {
    if (await exists(MOD_LOADER_PATH)) {
      modLoader = loadJson(MOD_LOADER_PATH);
    } else {
      const data = await (await axios.get(MOD_LOADER_URL)).data;
      writeJson(MOD_LOADER_PATH, data);
      modLoader = data;
    }
  }

  console.log('has json mod loader');

  let loader: JsonModLoader;
  let current = 0;
  let total = 0;
  let deps: string[] = [];
  let provs: string[] = [];

  if (Object.keys(modLoader.loaders).includes(profile.data.modloader)) {
    loader = modLoader.loaders[profile.data.modloader];
  } else {
    window?.webContents.send('ipc:error_message', 'Failed to load profile', 'Mod loader is not correct.');
    window?.webContents.send('ipc:prepare_finished');
    console.log('error', modLoader.loaders, profile.data.modloader);
    return { cp: [] };
  }

  for (const dep of loader.dependencies) {
    if (!(await exists(join(LIBRARIES_PATH, modLoader.dependencies[dep].path)))) {
      total += modLoader.dependencies[dep].size;
      deps.push(dep);
    }
  }

  for (const prov of loader.providers) {
    if (!(await exists(join(LIBRARIES_PATH, modLoader.providers[prov].path)))) {
      total += modLoader.providers[prov].size;
      provs.push(prov);
    }
  }

  console.log('deps/prov to be dl', deps, provs);

  window?.webContents.send('ipc:preparing', current, total);

  for (const dep of deps) {
    const d = modLoader.dependencies[dep];
    await downloadLibrary(
      d.url,
      d.path,
      (dloaded) => {
        current += dloaded;
        console.log('Preparing (Dep) ' + current + '/' + total);
        window?.webContents.send('ipc:preparing', current, total);
      },
      () => {}
    );
  }

  for (const prov of provs) {
    const p = modLoader.providers[prov];
    await downloadLibrary(
      p.url,
      p.path,
      (dloaded) => {
        current += dloaded;
        console.log('Preparing (Prov) ' + current + '/' + total);
        window?.webContents.send('ipc:preparing', current, total);
      },
      () => {}
    );
  }

  window?.webContents.send('ipc:prepare_finished');
  console.log('prepare finished');
  return {
    cp: [
      ...loader.providers.map((prov) => modLoader.providers[prov].path).map((prov) => join(LIBRARIES_PATH, prov)),
      ...loader.dependencies.map((dep) => modLoader.dependencies[dep].path).map((dep) => join(LIBRARIES_PATH, dep))
    ]
  };
}

async function playModdedProfile(profile: Profile, version: Version) {
  const { cp } = await prepareModdedProfile(profile, version);

  const loader = modLoader.loaders[profile.data.modloader];
  if (!loader) return;

  profile.data.lastUsed = new Date().toISOString();
  window.webContents.send('ipc:launch_start');
  const timeStart = Date.now();

  console.log(...loader.cmd.map((l) => l.replace('${game_jar}', version.path).replace('${game_dir}', LAUNCHER_PATH).replace('${dependencies}', cp.join(';'))));

  // prettier-ignore
  const pv = childp.spawn('java', [
    // For Minicraft+
    // '-Dtinylog.writer2.file=' + join(LAUNCHER_LOGS, 'log.txt'),
    // '-Dtinylog.writer3.file=' + join(LAUNCHER_LOGS, 'unlocalized.txt'),
    
    ...loader.cmd.map(l => l.replace('${game_jar}', version.path).replace('${game_dir}', LAUNCHER_PATH).replace('${dependencies}', cp.join(';'))),

    '--savedir',
    profile.data.saveDir,
    profile.data.jvmArgs
  ]);

  pv.stdout.on('data', (d) => {
    if (Profiles.logs[profile.id] === undefined) Profiles.logs[profile.id] = [];
    const line = decode(d);
    console.log(line);

    Profiles.logs[profile.id].push(line);
    window.webContents.send('ipc:log_line_added', profile.id, line);
  });

  pv.on('close', () => {
    const timePlayed = Date.now() - timeStart;
    profile.data.totalPlayTime += timePlayed;
    window.webContents.send('ipc:updated_profile_tpm', profile.id, profile.data.totalPlayTime);
    Profiles.logs[profile.id] = [];
  });

  pv.stderr.on('error', (err) => {
    console.log(err);
  });

  console.log(`Playing ${profile.data.name} (${version.id})`);
  setTimeout(() => {
    if (!Settings.getKeepLauncherOpen()) {
      app.quit();
    }
    window.webContents.send('ipc:launch_end');
  }, 700);
}

function playProfile(profile: Profile, version: Version) {
  if (profile.data.modloader !== '') {
    console.log('has mod loader');
    playModdedProfile(profile, version);
    return;
  }

  if (Settings.getOpenOutputLog() && logOutputWin === undefined) {
    // logOutputWin = createWindowInstance('Minicraft game output', 'secwin');
  }

  profile.data.lastUsed = new Date().toISOString();

  window.webContents.send('ipc:launch_start');
  const timeStart = Date.now();

  // prettier-ignore
  const pv = childp.spawn('java', [
    '-jar',
    
    // For Minicraft+
    '-Dtinylog.writer2.file=' + join(LAUNCHER_LOGS, 'log.txt'),
    '-Dtinylog.writer3.file=' + join(LAUNCHER_LOGS, 'unlocalized.txt'),

    version.path,
    '--savedir',
    profile.data.saveDir,
    profile.data.jvmArgs
  ]);

  pv.stdout.on('data', (d) => {
    if (Profiles.logs[profile.id] === undefined) {
      Profiles.logs[profile.id] = [];
    }
    const line = decode(d);
    Profiles.logs[profile.id].push(line);
    window.webContents.send('ipc:log_line_added', profile.id, line);
  });

  pv.on('close', () => {
    const timePlayed = Date.now() - timeStart;
    profile.data.totalPlayTime += timePlayed;
    window.webContents.send('ipc:updated_profile_tpm', profile.id, profile.data.totalPlayTime);
    Profiles.logs[profile.id] = [];
  });

  console.log(`Playing ${profile.data.name} (${version.id})`);
  setTimeout(() => {
    if (!Settings.getKeepLauncherOpen()) {
      app.quit();
    }
    window.webContents.send('ipc:launch_end');
  }, 700);
}

function createWindowInstance(title: string, route: string) {
  const secWindow = new BrowserWindow({
    center: true,
    width: MIN_WIDTH,
    height: MIN_HEIGHT,
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    title: title,
    icon: isDev ? join(__dirname, '../..', 'resources/icon.ico') : undefined,
    show: true,
    backgroundColor: '#1f1f1f',
    resizable: true,
    webPreferences: {
      safeDialogs: true,
      devTools: isDev,
      preload: join(__dirname, 'preload.js')
    }
  });

  const port = process.env.PORT || 3000;
  const url = isDev ? `http://localhost:${port}/#/` + route : join(__dirname, '../renderer/index.html#/' + route);

  if (isDev) {
    secWindow?.loadURL(url);
  } else {
    secWindow?.loadFile(url);
  }

  secWindow.menuBarVisible = false;
  return secWindow;
}

ipcMain.on('ipc:play', (ev, id: string) => {
  const profile = Profiles.profiles.find((profile) => profile.id === id);
  if (!profile) return;

  console.log(profile);

  const version = Versions.versions.find((version) => version.id === profile.data.lastVersionId);
  if (!version) return;

  if (version.hasLocally) {
    playProfile(profile, version);
  } else {
    if (!window.isDestroyed()) ev.sender.send('ipc:download_start');

    try {
      downloadVersion(
        version.url,
        version.id,
        version.size,
        (dloaded) => {
          if (!window.isDestroyed()) ev.sender.send('ipc:downloading', dloaded, version.size);
        },
        () => {
          if (!window.isDestroyed()) ev.sender.send('ipc:download_finished');
          playProfile(profile, version);
        }
      );
    } catch (e) {}
  }
});

ipcMain.handle('ipc:get_launcher_version', (ev) => {
  return app.getVersion();
});

ipcMain.handle('ipc:get_loaders', async () => {
  if (modLoader === undefined) {
    if (await exists(MOD_LOADER_PATH)) {
      modLoader = loadJson(MOD_LOADER_PATH);
    } else {
      const data = await (await axios.get(MOD_LOADER_URL)).data;
      writeJson(MOD_LOADER_PATH, data);
      modLoader = data;
    }
  }

  return Object.keys(modLoader.loaders);
});

ipcMain.handle('ipc:get_mod_list', () => {
  return readdirSync(MODS_PATH).filter((p) => p.endsWith('.jar'));
});
