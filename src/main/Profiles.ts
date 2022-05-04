import { ipcMain, shell } from 'electron';
import { existsSync } from 'fs';
import { LAUNCHER_PROFILES_PATH, SAVEDIR_PATH } from './constants';
import { ProfileData } from './types';
import { loadJson, writeJson } from './utils';

export class Profile {
  public constructor(public id: string, public data: ProfileData) {
    this.id = id;
    this.data = data;
  }
}

export class Profiles {
  public static profiles: Profile[] = [];
  public static logs: Record<string, string[]> = {};

  public static load() {
    if (!existsSync(LAUNCHER_PROFILES_PATH)) return;

    const obj = loadJson<{ profiles: Record<string, ProfileData> }>(LAUNCHER_PROFILES_PATH);

    Object.entries(obj.profiles).forEach(([id, data]) => {
      const d: ProfileData = {
        modloader: data.modloader ?? '',
        mods: data.mods ?? [],
        totalPlayTime: data['totalPlayTime'] ?? 0,
        jvmArgs: data.jvmArgs ?? '',
        lastUsed: data.lastUsed,
        lastVersionId: data.lastVersionId,
        saveDir: data.saveDir,
        name: data.name
      };
      this.profiles.push(new Profile(id, d));
    });
  }

  public static save() {
    const obj: { format: number; profiles: Record<string, ProfileData> } = {
      format: 1,
      profiles: {}
    };

    this.profiles.forEach((profile) => {
      obj.profiles[profile.id] = profile.data;
    });

    writeJson(LAUNCHER_PROFILES_PATH, obj);
  }

  public static registerEvents() {
    ipcMain.on('ipc:create_profile', (ev, id: string, name: string, versionId: string, saveDir: string, jvmArgs: string, modloader: string, mods: string[]) => {
      Profiles.profiles.push(
        new Profile(id, {
          name: name,
          lastUsed: new Date().toISOString(),
          lastVersionId: versionId,
          saveDir: saveDir === '' ? SAVEDIR_PATH : existsSync(saveDir) ? saveDir : SAVEDIR_PATH,
          jvmArgs: jvmArgs,
          totalPlayTime: 0,
          modloader: modloader ?? '',
          mods: []
        })
      );
    });

    ipcMain.on(
      'ipc:update_profile',
      (ev, id: string, name: string | null, versionId: string | null, saveDir: string | null, jvmArgs: string | null, modloader: string | null, mods: string[] | null) => {
        const profile = Profiles.profiles.find((prof) => prof.id === id);
        if (profile) {
          if (name !== null) profile.data.name = name;
          if (versionId !== null) profile.data.lastVersionId = versionId;
          if (saveDir !== null) profile.data.saveDir = saveDir;
          if (jvmArgs !== null) profile.data.jvmArgs = jvmArgs;
          if (modloader !== null) profile.data.modloader = modloader;
          if (mods !== null) profile.data.mods = mods;
        }
      }
    );

    ipcMain.handle('ipc:get_profile_logs', (ev, id: string) => {
      const profile = Profiles.profiles.find((prof) => prof.id === id);

      if (profile) {
        return Profiles.logs[profile.id] ?? [];
      }

      return [];
    });

    ipcMain.on('ipc:delete_profile', (ev, id: string) => {
      Profiles.profiles = Profiles.profiles.filter((profile) => profile.id !== id);
    });

    ipcMain.handle('ipc:get_profiles', (ev) => {
      const profiles = Profiles.profiles.map((prof) => {
        return {
          id: prof.id,
          name: prof.data.name,
          versionId: prof.data.lastVersionId,
          saveDir: prof.data.saveDir,
          lastUsed: prof.data.lastUsed,
          totalPlayTime: prof.data.totalPlayTime,
          modloader: prof.data.modloader,
          mods: prof.data.mods
        };
      });

      return profiles;
    });

    ipcMain.on('ipc:open_savedir', (ev, id: string) => {
      const profile = Profiles.profiles.find((prof) => prof.id === id);

      if (profile) {
        shell.showItemInFolder(profile.data.saveDir);
      }
    });
  }
}
