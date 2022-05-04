import axios from 'axios';
import { ipcMain } from 'electron';
import { existsSync, statSync } from 'fs';
import { PATCH_NOTES_PATH, LAUNCHER_PATCH_NOTES_PATH, PATCH_NOTES_URL, LAUNCHER_PATCH_NOTES_URL } from './constants';
import { writeJson, loadJson } from './utils';

export class PatchNotes {
  public static registerEvents(): void {
    ipcMain.handle('ipc:get_patch_notes', async (ev) => {
      if (existsSync(PATCH_NOTES_PATH)) {
        const stats = statSync(PATCH_NOTES_PATH);
        const sinceWhen = Math.floor((new Date().getTime() - stats.mtime.getTime()) / 1000 / 60);

        if (sinceWhen > 60) {
          const data = await (await axios.get(PATCH_NOTES_URL)).data;
          writeJson(PATCH_NOTES_PATH, data);
          return data;
        } else {
          return loadJson(PATCH_NOTES_PATH);
        }
      } else {
        const data = await (await axios.get(PATCH_NOTES_URL)).data;
        writeJson(PATCH_NOTES_PATH, data);
        return data;
      }
    });

    ipcMain.handle('ipc:get_launcher_patch_notes', async (ev) => {
      if (existsSync(LAUNCHER_PATCH_NOTES_PATH)) {
        const stats = statSync(LAUNCHER_PATCH_NOTES_PATH);
        const sinceWhen = Math.floor((new Date().getTime() - stats.mtime.getTime()) / 1000 / 60);

        if (sinceWhen > 60) {
          const data = await (await axios.get(LAUNCHER_PATCH_NOTES_URL)).data;
          writeJson(LAUNCHER_PATCH_NOTES_PATH, data);
          return data;
        } else {
          return loadJson(LAUNCHER_PATCH_NOTES_PATH);
        }
      } else {
        const data = await (await axios.get(LAUNCHER_PATCH_NOTES_URL)).data;
        writeJson(LAUNCHER_PATCH_NOTES_PATH, data);
        return data;
      }
    });
  }
}
