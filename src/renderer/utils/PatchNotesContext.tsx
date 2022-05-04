import React, { createContext, useEffect, useState } from 'react';

export interface LPatchNote {
  id: string;
  version: string;
  date: string;
  body: string;
}

export interface MPatchNote {
  id: string;
  title: string;
  version: string;
  image: string;
  body: string;
}

export const PatchNotesContext = createContext<{ launcher: LPatchNote[]; minicraft: MPatchNote[] }>({ launcher: [], minicraft: [] });

export const PatchNotesProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [lnotes, setLNotes] = useState<LPatchNote[]>([]);
  const [mnotes, setMNotes] = useState<MPatchNote[]>([]);

  useEffect(() => {
    if (mnotes.length === 0) {
      window.ipcRenderer.invoke('ipc:get_patch_notes').then((pn) => setMNotes(pn.entries));
    }

    if (lnotes.length === 0) {
      window.ipcRenderer.invoke('ipc:get_launcher_patch_notes').then((pn) => setLNotes(pn.entries));
    }
  }, []);

  return <PatchNotesContext.Provider value={{ launcher: lnotes, minicraft: mnotes }}>{children}</PatchNotesContext.Provider>;
};
