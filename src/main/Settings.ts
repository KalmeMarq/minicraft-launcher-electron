import { app, ipcMain } from 'electron';
import { existsSync } from 'fs';
import { json } from 'stream/consumers';
import { LAUNCHER_SETTINGS_PATH, LAUNCHER_THEMES_PATH } from './constants';
import { JsonLauncherThemes } from './types';
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

export const themes = {
  light: {
    'mainmenu.background': '#DDDDDD',
    'mainmenu.tab.background.hover': '#868686',
    'mainmenu.tab.background.active': '#727272',
    'mainmenu.tab.foreground': '#000000',
    'mainmenu.tab.active.marker': '#000000',
    'mainmenu.tab.focus': '#000000',
    'submenu.background': '#DDDDDD',
    'submenu.header.foreground': '#000000',
    'submenu.tab.foreground': '#000000',
    'submenu.tab.foreground.hover': '#555555',
    'submenu.tab.foreground.active': '#333333',
    'submenu.tab.active.marker': '#0e44b9',
    'page.background': '#20979b',
    'page.foreground': '#000000',
    'page.horizontal.line': '#ca1414',
    'patchnotecard.background': '#8b2929',
    'patchnotecard.background.hover': '#6d2121',
    'patchnotecard.background.active': '#581b1b',
    'patchnotecard.title': '#17d417',
    'loadingspinner.background': '#581658',
    'play.banner.shadow': '#3a3a3a',
    'playbutton.foreground': '#ffffff',
    'playbutton.foreground.disabled': '#AAA',
    'playbutton.border': '#000000',
    'playbutton.border.active': '#FFFFFF',
    'playbutton.top': '#1691e4',
    'playbutton.top.active': '#064D2A',
    'playbutton.top.disabled': '#1B902D',
    'playbutton.side': '#154dc5',
    'playbutton.bottom': '#092e7e',
    'playbutton.bottom.active': '#0AA618',
    'playbutton.bottom.disabled': '#04361D',
    'playbutton.gradient.top': '#0f48c4',
    'playbutton.gradient.top.hover': '#124bc7',
    'playbutton.gradient.top.active': '#852a00',
    'playbutton.gradient.top.focus': '#0e3c9e',
    'playbutton.gradient.top.disabled': '#273f74',
    'playbutton.gradient.bottom': '#0e3997',
    'playbutton.gradient.bottom.hover': '#1144b3',
    'playbutton.gradient.bottom.active': '#009147',
    'playbutton.gradient.bottom.focus': '#0a2f7e',
    'playbutton.gradient.bottom.disabled': '#1d2d52',
    'checkbox.background.on': '#1928ac',
    'checkbox.background.hover.on': '#5811a8',
    'modal.background': '#2f0a52',
    'modal.title.foreground': '#15a355',
    'modal.horizontal.line': '#113f94',
    'scrollbar.background': '#9c1313',
    'scrollbar.thumb.background': '#131585',
    'scrollbar.thumb.background.hover': '#5e0d53',
    'textbox.background': '#8a2222',
    'textbox.background.hover': '#08208a',
    'patchnote.h1.foreground': '#FFFF00',
    'patchnote.h2.foreground': '#FFFF00',
    'patchnote.h3.foreground': '#FFFF00',
    'patchnote.h4.foreground': '#FFFF00',
    'patchnote.h5.foreground': '#FFFF00',
    'patchnote.p.foreground': '#FFFF00',
    'patchnote.li.foreground': '#FFFF00',
    'patchnote.a.foreground': '#FFFF00'
  },
  dark: {
    'mainmenu.background': '#262626',
    'mainmenu.tab.foreground': '#FFFFFF',
    'mainmenu.tab.background.hover': '#3d3d3d',
    'mainmenu.tab.background.active': '#383838',
    'mainmenu.tab.active.marker': '#FFFFFF',
    'mainmenu.tab.focus': '#FFFFFF',
    'submenu.background': '#262626',
    'submenu.header.foreground': '#FFFFFF',
    'submenu.tab.foreground': '#e3e3e3',
    'submenu.tab.foreground.hover': '#c9c9c9',
    'submenu.tab.foreground.active': '#FFFFFF',
    'submenu.tab.active.marker': '#008542',
    'page.background': '#323232',
    'page.foreground': '#FFFFFF',
    'page.horizontal.line': '#494949',
    'patchnotecard.background': '#0F0F0F',
    'patchnotecard.background.hover': '#262626',
    'patchnotecard.background.active': '#131313',
    'patchnotecard.title': '#FFFFFF',
    'patchnote.h1.foreground': '#FFFFFF',
    'patchnote.h2.foreground': '#FFFFFF',
    'patchnote.h3.foreground': '#FFFFFF',
    'patchnote.h4.foreground': '#FFFFFF',
    'patchnote.h5.foreground': '#FFFFFF',
    'patchnote.p.foreground': '#FFFFFF',
    'patchnote.li.foreground': '#FFFFFF',
    'patchnote.a.foreground': '#FFFFFF',
    'loadingspinner.background': '#FFFFFF',
    'play.banner.shadow': '#000000',
    'playbutton.foreground': '#FFFFFF',
    'playbutton.foreground.disabled': '#AAA',
    'playbutton.border': '#000000',
    'playbutton.border.active': '#FFFFFF',
    'playbutton.top': '#27CE40',
    'playbutton.top.active': '#064D2A',
    'playbutton.top.disabled': '#1B902D',
    'playbutton.side': '#0C6E3D',
    'playbutton.bottom': '#064D2A',
    'playbutton.bottom.active': '#0AA618',
    'playbutton.bottom.disabled': '#04361D',
    'playbutton.gradient.top': '#009147',
    'playbutton.gradient.top.hover': '#0A8F4C',
    'playbutton.gradient.top.active': '#008542',
    'playbutton.gradient.top.focus': '#0A9B51',
    'playbutton.gradient.top.disabled': '#006532',
    'playbutton.gradient.bottom': '#008542',
    'playbutton.gradient.bottom.hover': '#0A9B51',
    'playbutton.gradient.bottom.active': '#009147',
    'playbutton.gradient.bottom.focus': '#0A8F4C',
    'playbutton.gradient.bottom.disabled': '#005D2E',
    'checkbox.background.on': '#008542',
    'checkbox.background.hover.on': '#0DD166',
    'modal.background': '#303030',
    'modal.title.foreground': '#FFFFFF',
    'modal.horizontal.line': '#373737',
    'scrollbar.background': '#262626',
    'scrollbar.thumb.background': '#4d4d4d',
    'scrollbar.thumb.background.hover': '#595959',
    'textbox.background': '#131313',
    'textbox.background.hover': '#0e0e0e'
  }
};

export class Themes {
  static themes: Record<string, Record<string, string>> = {
    dark: themes.dark,
    light: themes.light
  };

  static load() {
    if (!existsSync(LAUNCHER_THEMES_PATH)) return;

    const jsonThemes = loadJson<JsonLauncherThemes>(LAUNCHER_THEMES_PATH);

    try {
      Object.entries(jsonThemes.themes).forEach(([themename, themedata]) => {
        if (themename === 'dark') {
          Themes.themes.dark = { ...themes.dark, ...themedata };
        } else if (themename === 'light') {
          Themes.themes.light = { ...themes.light, ...themedata };
        } else {
          const nm = themename.split(':');
          if (nm.length === 2 && ['dark', 'light'].includes(nm[0]) && !['dark', 'light'].includes(nm[1])) {
            if (nm[0] === 'dark') {
              Themes.themes[nm[1]] = { ...themes.dark, ...themedata };
            } else if (nm[0] === 'light') {
              Themes.themes[nm[1]] = { ...themes.light, ...themedata };
            }
          }
        }
      });
    } catch (e) {}
  }

  static getAvailableThemes() {
    return Object.keys(Themes.themes);
  }

  static registerEvents() {
    ipcMain.handle('ipc:get_themes', () => {
      return this.themes;
    });
  }
}

export class Settings {
  static validLangs = ['en-US', 'en-GB', 'pt-PT', 'pt-BR'];

  static #keepLauncherOpen = true;
  static #showCommunityTab = true;
  static #language = 'en-US';
  static #theme = 'dark';
  static #openOutputLog = false;
  static #animatePages = false;
  static #disableHardwareAcceleration = false;

  public static setDisableHardwareAcceleration(val: boolean) {
    this.#disableHardwareAcceleration = val;
  }

  public static getDisableHardwareAcceleration() {
    return this.#disableHardwareAcceleration;
  }

  public static setAnimatePages(val: boolean) {
    this.#animatePages = val;
  }

  public static getAnimatePages() {
    return this.#animatePages;
  }

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

  public static setTheme(val: string) {
    if (!Themes.getAvailableThemes().includes(val)) return;
    this.#theme = val;
  }

  public static getTheme() {
    return this.#theme;
  }

  static load() {
    if (!existsSync(LAUNCHER_SETTINGS_PATH)) return;

    const obj = loadJson<{
      theme?: string;
      animatePages?: boolean;
      disableHardwareAcceleration?: boolean;
      keepLauncherOpen?: boolean;
      language?: string;
      showCommunityTab?: boolean;
      openOutputLog?: boolean;
    }>(LAUNCHER_SETTINGS_PATH);
    console.log('Settings: ' + JSON.stringify(obj));

    if (obj.keepLauncherOpen) this.setKeepLauncherOpen(obj.keepLauncherOpen);
    if (obj.language) this.setLanguage(obj.language);
    if (obj.theme) this.setTheme(obj.theme);
    if (obj.showCommunityTab) this.setShowCommunityTab(obj.showCommunityTab);
    if (obj.openOutputLog) this.setOpenOutputLog(obj.openOutputLog);
    if (obj.animatePages) this.setAnimatePages(obj.animatePages);
    if (obj.disableHardwareAcceleration) this.setDisableHardwareAcceleration(obj.disableHardwareAcceleration);
  }

  static save() {
    const obj: Record<string, unknown> = {};
    obj['keepLauncherOpen'] = this.getKeepLauncherOpen();
    obj['language'] = this.getLanguage();
    obj['theme'] = this.getTheme();
    obj['showCommunityTab'] = this.getShowCommunityTab();
    obj['openOutputLog'] = this.getOpenOutputLog();
    obj['animatePages'] = this.getAnimatePages();
    obj['disableHardwareAcceleration'] = this.getDisableHardwareAcceleration();

    writeJson(LAUNCHER_SETTINGS_PATH, obj);
  }

  public static registerEvents() {
    ipcMain.handle('ipc:get_option', (ev, key: string) => {
      if (key === 'keepLauncherOpen') {
        return Settings.getKeepLauncherOpen();
      } else if (key === 'language') {
        return Settings.getLanguage();
      } else if (key === 'theme') {
        return Settings.getTheme();
      } else if (key === 'showCommunityTab') {
        return Settings.getShowCommunityTab();
      } else if (key === 'openOutputLog') {
        return Settings.getOpenOutputLog();
      } else if (key === 'animatePages') {
        return Settings.getAnimatePages();
      } else if (key === 'disableHardwareAcceleration') {
        return Settings.getDisableHardwareAcceleration();
      } else {
        return undefined;
      }
    });

    ipcMain.handle('ipc:get_options', (ev) => {
      return {
        showCommunityTab: this.#showCommunityTab,
        language: this.#language,
        theme: this.#theme,
        keepLauncherOpen: this.#keepLauncherOpen,
        openOutputLog: this.#openOutputLog,
        animatePages: this.#animatePages,
        disableHardwareAcceleration: this.#disableHardwareAcceleration
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

      if (key === 'theme' && typeof value === 'string') {
        Settings.setTheme(value);
        ev.sender.send('ipc:updated_option', key, Settings.getTheme());
      }

      if (key === 'showCommunityTab' && typeof value === 'boolean') {
        Settings.setShowCommunityTab(value);
        ev.sender.send('ipc:updated_option', key, Settings.getShowCommunityTab());
      }

      if (key === 'openOutputLog' && typeof value === 'boolean') {
        Settings.setOpenOutputLog(value);
        ev.sender.send('ipc:updated_option', key, Settings.getOpenOutputLog());
      }

      if (key === 'animatePages' && typeof value === 'boolean') {
        Settings.setAnimatePages(value);
        ev.sender.send('ipc:updated_option', key, Settings.getAnimatePages());
      }

      if (key === 'disableHardwareAcceleration' && typeof value === 'boolean') {
        Settings.setDisableHardwareAcceleration(value);
        ev.sender.send('ipc:updated_option', key, Settings.getDisableHardwareAcceleration());
      }
    });
  }
}
