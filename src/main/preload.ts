import { ipcRenderer, contextBridge } from 'electron';

declare global {
  interface Window {
    Main: typeof api;
    ipcRenderer: typeof ipcRenderer;
  }
}

const api = {
  send: (channel: string, ...args: any[]) => {
    ipcRenderer.send(channel, args);
  },
  on: (channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
    return ipcRenderer.on(channel, listener);
  },
  invoke: (channel: string, ...args: any[]) => {
    return ipcRenderer.invoke(channel, args);
  },
  off: (channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
    return ipcRenderer.off(channel, listener);
  },
  removeListener: (channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
    return ipcRenderer.removeListener(channel, listener);
  },
  removeAllListeners: (channel: string) => {
    return ipcRenderer.removeAllListeners(channel);
  }
};

contextBridge.exposeInMainWorld('Main', api);
contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer);
