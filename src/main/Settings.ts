import { ipcMain } from 'electron';
import { existsSync } from 'fs';
import { LAUNCHER_SETTINGS_PATH } from './constants';
import { loadJson, writeJson } from './utils';

// hmmm
export class Option<T> {
  #key: string;
  default: T;
  #value: T;

  public constructor(key: string, v: T) {
    this.#key = key;
    this.default = v;
    this.#value = v;
  }

  public set(v: T) {
    this.#value = v;

    // ipcMain.emit('ipc:updated_option', this.#key, this.#value);
  }

  public get() {
    return this.#value;
  }

  public load(obj: Record<string, T>) {
    if (obj[this.#key]) {
      this.#value = obj[this.#key] as T;
    }
  }

  public save(obj: Record<string, T>) {
    obj[this.#key] = this.#value;
  }
}

export class Settings {
  static validLangs = ['en-US', 'en-GB', 'pt-PT', 'pt-BR'];

  static #keepLauncherOpen = true;
  static #showCommunityTab = true;
  static #language = 'en-US';
  static #openOutputLog = false;

  public static setShowCommunityTab(val: boolean) {
    this.#showCommunityTab = val;
  }

  public static getShowCommunityTab() {
    return this.#showCommunityTab;
  }

  public static setOpenOutputLog(val: boolean) {
    this.#openOutputLog = val;
  }

  public static getOpenOutputLog() {
    return this.#openOutputLog;
  }

  public static setKeepLauncherOpen(val: boolean) {
    this.#keepLauncherOpen = val;
  }

  public static getKeepLauncherOpen() {
    return this.#keepLauncherOpen;
  }

  public static setLanguage(val: string) {
    if (!this.validLangs.includes(val)) return;
    this.#language = val;
  }

  public static getLanguage() {
    return this.#language;
  }

  static load() {
    if (!existsSync(LAUNCHER_SETTINGS_PATH)) return;

    const obj = loadJson<{ keepLauncherOpen?: boolean; language?: string; showCommunityTab?: boolean; openOutputLog?: boolean }>(LAUNCHER_SETTINGS_PATH);
    console.log('Settings: ' + JSON.stringify(obj));

    if (obj.keepLauncherOpen) this.setKeepLauncherOpen(obj.keepLauncherOpen);
    if (obj.language) this.setLanguage(obj.language);
    if (obj.showCommunityTab) this.setShowCommunityTab(obj.showCommunityTab);
    if (obj.openOutputLog) this.setOpenOutputLog(obj.openOutputLog);
  }

  static save() {
    const obj: Record<string, unknown> = {};
    obj['keepLauncherOpen'] = this.getKeepLauncherOpen();
    obj['language'] = this.getLanguage();
    obj['showCommunityTab'] = this.getShowCommunityTab();
    obj['openOutputLog'] = this.getOpenOutputLog();

    writeJson(LAUNCHER_SETTINGS_PATH, obj);
  }

  public static registerEvents() {
    ipcMain.handle('ipc:get_option', (ev, key: string) => {
      if (key === 'keepLauncherOpen') {
        return Settings.getKeepLauncherOpen();
      } else if (key === 'language') {
        return Settings.getLanguage();
      } else if (key === 'showCommunityTab') {
        return Settings.getShowCommunityTab();
      } else if (key === 'openOutputLog') {
        return Settings.getOpenOutputLog();
      } else {
        return undefined;
      }
    });

    ipcMain.handle('ipc:get_options', (ev) => {
      return {
        showCommunityTab: this.#showCommunityTab,
        language: this.#language,
        keepLauncherOpen: this.#keepLauncherOpen,
        openOutputLog: this.#openOutputLog
      };
    });

    ipcMain.on('ipc:set_option', (ev, key: string, value: unknown) => {
      console.log(key, value);

      if (key === 'keepLauncherOpen' && typeof value === 'boolean') {
        Settings.setKeepLauncherOpen(value);
        ev.sender.send('ipc:updated_option', key, Settings.getKeepLauncherOpen());
      }

      if (key === 'language' && typeof value === 'string') {
        Settings.setLanguage(value);
        ev.sender.send('ipc:updated_option', key, Settings.getLanguage());
      }

      if (key === 'showCommunityTab' && typeof value === 'boolean') {
        Settings.setShowCommunityTab(value);
        ev.sender.send('ipc:updated_option', key, Settings.getShowCommunityTab());
      }

      if (key === 'openOutputLog' && typeof value === 'boolean') {
        Settings.setOpenOutputLog(value);
        ev.sender.send('ipc:updated_option', key, Settings.getOpenOutputLog());
      }
    });
  }
}
