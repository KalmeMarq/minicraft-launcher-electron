import { app } from 'electron';
import { join } from 'path';

export const NOT_LAUNCHER_PATH = join(app.getPath('appData'), 'minicraft-launcher');
export const LAUNCHER_PATH = join(app.getPath('appData'), '.minicraftlauncher');
export const LAUNCHER_TEMP_PATH = join(app.getPath('temp'), 'minicraftlauncher_temp');
export const CACHE_PATH = join(LAUNCHER_PATH, 'cache');
export const LAUNCHER_CACHE_PATH = join(CACHE_PATH, 'webcache');
export const LAUNCHER_CACHE_PATH_OLD = join(LAUNCHER_PATH, 'webcache');
export const LAUNCHER_LOGS = join(LAUNCHER_PATH, 'logs');
export const LAUNCHER_PROFILES_PATH = join(LAUNCHER_PATH, 'launcher_profiles.json');
export const LAUNCHER_SETTINGS_PATH = join(LAUNCHER_PATH, 'launcher_settings.json');
export const VERSIONS_PATH = join(LAUNCHER_PATH, 'versions');
export const VERSION_MANIFEST_PATH = join(VERSIONS_PATH, 'version_manifest.json');
export const PATCH_NOTES_PATH = join(CACHE_PATH, 'minicraftPatchNotes.json');
export const PATCH_NOTES_PATH_OLD = join(VERSIONS_PATH, 'minicraftPatchNotes.json');
export const LAUNCHER_PATCH_NOTES_PATH = join(CACHE_PATH, 'launcherPatchNotes.json');
export const LAUNCHER_PATCH_NOTES_PATH_OLD = join(VERSIONS_PATH, 'launcherPatchNotes.json');
export const SAVEDIR_PATH = join(LAUNCHER_PATH, 'saves');
export const MODS_PATH = join(LAUNCHER_PATH, 'mods');
export const LIBRARIES_PATH = join(LAUNCHER_PATH, 'libraries');
export const MOD_LOADER_PATH = join(VERSIONS_PATH, 'mod_loader.json');

export const LAUNCHER_PATCH_NOTES_URL = 'https://gitlab.com/KalmeMarq/minicraft-index/-/raw/main/launcherPatchNotes.json';
export const PATCH_NOTES_URL = 'https://gitlab.com/KalmeMarq/minicraft-index/-/raw/main/minicraftPatchNotes.json';
export const VERSION_MANIFEST_URL = 'https://gitlab.com/KalmeMarq/minicraft-index/-/raw/main/version_manifest.json';
export const MOD_LOADER_URL = 'https://gitlab.com/KalmeMarq/minicraft-mods/-/raw/main/mod_loader.json';
