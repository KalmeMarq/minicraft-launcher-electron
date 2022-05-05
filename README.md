# Minicraft Launcher

#### Launcher Settings
```ts
{
  keepLauncherOpen: boolean
  language: string
  theme: string
  showCommunityTab: boolean
  openOutputLog: boolean
  animatePages: boolean
  disableHardwareAcceleration: boolean
}
```

#### Launcher Profiles
```ts
{
  profiles: {
    [id: string]: {
      name: string
      modloader: string
      totalPlayTime: number
      jvmArgs: string
      lastUsed: string
      lastVersionId: string
      saveDir: string
    }
  }
}
```

#### Launcher Themes


Create a ```launcher_themes.json``` file and create your own themes
```go
{
  themes: {
    dark?: {}, // Modify default dark theme
    light?: {} // Modify default light theme
    dark|light:custom_theme: {} // Custom theme (based on dark or light theme)
  }
}
```

### Default Themes

Dark
```ts
{
  'mainmenu-background': '#262626',
  'mainmenu-tab-foreground': '#FFFFFF',
  'mainmenu-tab-background-hover': '#3d3d3d',
  'mainmenu-tab-background-active': '#383838',
  'mainmenu-tab-active-marker': '#FFFFFF',
  'mainmenu-tab-focus': '#FFFFFF',
  'submenu-background': '#262626',
  'submenu-header-foreground': '#FFFFFF',
  'submenu-tab-foreground': '#e3e3e3',
  'submenu-tab-foreground-hover': '#c9c9c9',
  'submenu-tab-foreground-active': '#FFFFFF',
  'submenu-tab-active-marker': '#008542',
  'page-background': '#323232',
  'page-foreground': '#FFFFFF',
  'page-horizontal-line': '#494949',
  'patchnotecard-background': '#0F0F0F',
  'patchnotecard-background-hover': '#262626',
  'patchnotecard-background-active': '#131313',
  'patchnotecard-title': '#FFFFFF',
  'patchnote-h1-foreground': '#FFFFFF',
  'patchnote-h2-foreground': '#FFFFFF',
  'patchnote-h3-foreground': '#FFFFFF',
  'patchnote-h4-foreground': '#FFFFFF',
  'patchnote-h5-foreground': '#FFFFFF',
  'patchnote-p-foreground': '#FFFFFF',
  'patchnote-li-foreground': '#FFFFFF',
  'patchnote-a-foreground': '#FFFFFF',
  'loadingspinner-background': '#FFFFFF',
  'play-banner-shadow': '#000000',
  'playbutton-foreground': '#FFFFFF',
  'playbutton-foreground-disabled': '#AAA',
  'playbutton-border': '#000000',
  'playbutton-border-active': '#FFFFFF',
  'playbutton-top': '#27CE40',
  'playbutton-top-active': '#064D2A',
  'playbutton-top-disabled': '#1B902D',
  'playbutton-side': '#0C6E3D',
  'playbutton-bottom': '#064D2A',
  'playbutton-bottom-active': '#0AA618',
  'playbutton-bottom-disabled': '#04361D',
  'playbutton-gradient-top': '#009147',
  'playbutton-gradient-top-hover': '#0A8F4C',
  'playbutton-gradient-top-active': '#008542',
  'playbutton-gradient-top-focus': '#0A9B51',
  'playbutton-gradient-top-disabled': '#006532',
  'playbutton-gradient-bottom': '#008542',
  'playbutton-gradient-bottom-hover': '#0A9B51',
  'playbutton-gradient-bottom-active': '#009147',
  'playbutton-gradient-bottom-focus': '#0A8F4C',
  'playbutton-gradient-bottom-disabled': '#005D2E',
  'checkbox-background-on': '#008542',
  'checkbox-background-hover-on': '#0DD166',
  'modal-background': '#303030',
  'modal-title-foreground': '#FFFFFF',
  'modal-horizontal-line': '#373737',
  'scrollbar-background': '#262626',
  'scrollbar-thumb-background': '#4d4d4d',
  'scrollbar-thumb-background-hover': '#595959',
  'textbox-background': '#131313',
  'textbox-background-hover': '#0e0e0e'
}
```


Light (not finished :/)
```ts
{
  'mainmenu-background': '#DDDDDD',
  'mainmenu-tab-background-hover': '#868686',
  'mainmenu-tab-background-active': '#727272',
  'mainmenu-tab-foreground': '#000000',
  'mainmenu-tab-active-marker': '#000000',
  'mainmenu-tab-focus': '#000000',
  'submenu-background': '#DDDDDD',
  'submenu-header-foreground': '#000000',
  'submenu-tab-foreground': '#000000',
  'submenu-tab-foreground-hover': '#555555',
  'submenu-tab-foreground-active': '#333333',
  'submenu-tab-active-marker': '#0e44b9',
  'page-background': '#20979b',
  'page-foreground': '#000000',
  'page-horizontal-line': '#ca1414',
  'patchnotecard-background': '#8b2929',
  'patchnotecard-background-hover': '#6d2121',
  'patchnotecard-background-active': '#581b1b',
  'patchnotecard-title': '#17d417',
  'loadingspinner-background': '#581658',
  'play-banner-shadow': '#3a3a3a',
  'playbutton-foreground': '#ffffff',
  'playbutton-foreground-disabled': '#AAA',
  'playbutton-border': '#000000',
  'playbutton-border-active': '#FFFFFF',
  'playbutton-top': '#1691e4',
  'playbutton-top-active': '#064D2A',
  'playbutton-top-disabled': '#1B902D',
  'playbutton-side': '#154dc5',
  'playbutton-bottom': '#092e7e',
  'playbutton-bottom-active': '#0AA618',
  'playbutton-bottom-disabled': '#04361D',
  'playbutton-gradient-top': '#0f48c4',
  'playbutton-gradient-top-hover': '#124bc7',
  'playbutton-gradient-top-active': '#852a00',
  'playbutton-gradient-top-focus': '#0e3c9e',
  'playbutton-gradient-top-disabled': '#273f74',
  'playbutton-gradient-bottom': '#0e3997',
  'playbutton-gradient-bottom-hover': '#1144b3',
  'playbutton-gradient-bottom-active': '#009147',
  'playbutton-gradient-bottom-focus': '#0a2f7e',
  'playbutton-gradient-bottom-disabled': '#1d2d52',
  'checkbox-background-on': '#1928ac',
  'checkbox-background-hover-on': '#5811a8',
  'modal-background': '#2f0a52',
  'modal-title-foreground': '#15a355',
  'modal-horizontal-line': '#113f94',
  'scrollbar-background': '#9c1313',
  'scrollbar-thumb-background': '#131585',
  'scrollbar-thumb-background-hover': '#5e0d53',
  'textbox-background': '#8a2222',
  'textbox-background-hover': '#08208a',
  'patchnote-h1-foreground': '#FFFF00',
  'patchnote-h2-foreground': '#FFFF00',
  'patchnote-h3-foreground': '#FFFF00',
  'patchnote-h4-foreground': '#FFFF00',
  'patchnote-h5-foreground': '#FFFF00',
  'patchnote-p-foreground': '#FFFF00',
  'patchnote-li-foreground': '#FFFF00',
  'patchnote-a-foreground': '#FFFF00'
}
```