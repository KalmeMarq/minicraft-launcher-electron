import { createContext } from "react";

export const AboutContext = createContext<{ version: string }>({ version: '' });