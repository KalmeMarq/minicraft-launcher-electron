import axios from 'axios';
import { app } from 'electron';
import { copyFileSync, createWriteStream, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { join, parse } from 'path';
import { LAUNCHER_TEMP_PATH, LIBRARIES_PATH, VERSIONS_PATH } from './constants';

const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

export const decode = (buffer: BufferSource) => {
  return textDecoder.decode(buffer);
};

export const encode = (text: string) => {
  return textEncoder.encode();
};

export const shortSecurePath = (path: string) => {
  const parsedPath = parse(path);
  return `${parsedPath.root}...\\${parsedPath.base}`;
};

export const loadJson = <T>(path: string): T => {
  return JSON.parse(readFileSync(path, 'utf-8')) as T;
};

export const writeJson = <T>(path: string, data: T) => {
  writeFileSync(path, JSON.stringify(data, null, 2));
};

export const exists = (path: string) => {
  return new Promise<boolean>((res) => {
    const exists = existsSync(path);
    res(exists);
  });
};

export const downloadVersion = (url: string, versionId: string, totalSize: number, onData: (downloaded: number) => void, onEnd: () => void) => {
  axios({
    method: 'GET',
    url: url,
    responseType: 'stream'
  })
    .then((response) => {
      response.data.pipe(createWriteStream(join(LAUNCHER_TEMP_PATH, `${versionId}_temp.jar`)));
      let downloaded = 0;
      response.data.on('data', (data: any) => {
        downloaded += Buffer.byteLength(data);
        onData(downloaded);
      });
      response.data.on('end', () => {
        copyFileSync(join(LAUNCHER_TEMP_PATH, `${versionId}_temp.jar`), join(VERSIONS_PATH, `${versionId}.jar`));
        rmSync(join(LAUNCHER_TEMP_PATH, `${versionId}_temp.jar`));
        onEnd();
      });
      response.data.on('error', (error: any) => {
        console.log('downloadError', error);
      });
    })
    .catch((error) => {
      console.log('downloadError', error);
    });
};

export const downloadLibrary = async (url: string, path: string, onData: (downloaded: number) => void, onEnd: () => void) => {
  try {
    const res = await axios({ method: 'GET', url: url, responseType: 'stream' });
    const name = path.replace(/\//g, '.').replace('.jar', '');

    mkdirSync(join(LIBRARIES_PATH, parse(path).dir), { recursive: true });

    await new Promise((resolve, reject) => {
      res.data.pipe(createWriteStream(join(LIBRARIES_PATH, path)));
      let downloaded = 0;

      res.data.on('data', (data: any) => {
        downloaded += Buffer.byteLength(data);
        onData(downloaded);
      });

      res.data.on('end', () => {
        mkdirSync(join(LIBRARIES_PATH, parse(path).dir), { recursive: true });
        // rmSync(join(LAUNCHER_TEMP_PATH, `${name}_temp.jar`));
        // copyFileSync(join(LAUNCHER_TEMP_PATH, `${name}_temp.jar`), join(LIBRARIES_PATH, path));
        resolve(onEnd());
      });

      res.data.on('error', (error: any) => {
        console.log('downloadError', error);
        reject();
      });
    });
  } catch (e) {
    console.log('Failed to download: ', url, path);
  }
};
