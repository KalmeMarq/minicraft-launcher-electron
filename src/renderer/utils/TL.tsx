import { createContext, useContext } from "react";

export interface TLTranslation {
  [key: string]: string
}

export const TLContext = createContext<TLTranslation>({});

export const tl = (key: string) => {
  const tlCtx = useContext(TLContext);

  if (tlCtx[key] !== undefined) {
    return tlCtx[key];
  } else {
    return key;
  }
}

export const TL: React.FC<{ children: string }> = ({ children }) => {
  const tlCtx = useContext(TLContext);

  return (
    <>{tlCtx[children] !== undefined ? tlCtx[children] : children}</>
  )
}

export const useTLTranslation = () => {
  const tlCtx = useContext(TLContext);

  const tlTranslate = (key: string) => {
    if (tlCtx[key] !== undefined) {
      return tlCtx[key];
    } else {
      return key;
    }
  }

  return {
    tl: tlTranslate
  }
}