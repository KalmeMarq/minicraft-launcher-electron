export interface VersionManifest {
  [key: string]: {
    versions: {
      id: string;
      url: string;
      size: number;
    }[];
  };
}

export interface ProfileData {
  name: string;
  lastUsed: string;
  lastVersionId: string;
  saveDir: string;
  jvmArgs: string;
  totalPlayTime: number;
  modloader: string;
  mods: string[];
}

export interface JsonModLoader {
  cmd: string[];
  providers: string[];
  dependencies: string[];
}

export interface JsonModLoaders {
  dependencies: Record<string, { path: string; size: number; url: string }>;
  providers: Record<string, { path: string; size: number; url: string }>;
  loaders: Record<string, JsonModLoader>;
}

export interface JsonLauncherThemes {
  themes: { [key: string]: Record<string, string> };
}
