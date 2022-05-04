import axios from 'axios';
import { ipcMain, shell } from 'electron';
import { existsSync, rmSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';
import { VERSIONS_PATH, VERSION_MANIFEST_PATH, VERSION_MANIFEST_URL } from './constants';
import { VersionManifest } from './types';
import { loadJson } from './utils';

export class Version {
  public constructor(public id: string, public url: string, public size: number) {
    this.id = id;
    this.url = url;
    this.size = size;
  }

  public get hasLocally() {
    return existsSync(join(VERSIONS_PATH, `${this.id}.jar`));
  }

  public get path() {
    return join(VERSIONS_PATH, this.id + '.jar');
  }
}

export class Versions {
  public static versions: Version[] = [];

  public static async load() {
    let obj: VersionManifest;
    if (!existsSync(VERSION_MANIFEST_PATH)) {
      const data = await (await axios.get(VERSION_MANIFEST_URL)).data;
      writeFileSync(VERSION_MANIFEST_PATH, JSON.stringify(data, null, 2));
      obj = data;
    } else {
      const stats = statSync(VERSION_MANIFEST_PATH);
      const sinceWhen = Math.floor((new Date().getTime() - stats.mtime.getTime()) / 1000 / 60);

      if (sinceWhen > 60) {
        const data = await (await axios.get(VERSION_MANIFEST_URL)).data;
        writeFileSync(VERSION_MANIFEST_PATH, JSON.stringify(data, null, 2));
        obj = data;
      } else {
        obj = loadJson(VERSION_MANIFEST_PATH);
      }
    }

    Object.entries(obj).forEach(([name, { versions }]) => {
      versions.forEach(({ id, url, size }) => {
        const versionId = `${name}_${id}`;
        Versions.versions.push(new Version(versionId, url, size));
      });
    });
  }

  public static registerEvents() {
    ipcMain.handle('ipc:get_versions', (ev) => {
      const versions = Versions.versions.map((version) => version.id);
      return versions;
    });

    ipcMain.handle('ipc:getInstalledVersions', (ev) => {
      const vers = Versions.versions;
      const versions: Version[] = [];

      for (let i = 0; i < vers.length; i++) {
        if (existsSync(join(VERSIONS_PATH, `${vers[i].id}.jar`))) {
          versions.push(vers[i]);
        }
      }

      return versions;
    });

    ipcMain.on('ipc:deleteInstalledVersion', (ev, id: string) => {
      if (existsSync(join(VERSIONS_PATH, `${id}.jar`))) {
        rmSync(join(VERSIONS_PATH, `${id}.jar`));
      }
    });

    ipcMain.on('ipc:openInstalledVersion', (ev, id: string) => {
      shell.showItemInFolder(join(VERSIONS_PATH, `${id}.jar`));
    });
  }
}
