export const CHARACTER = {
    WEEBEE: "wibee",
    USER: "user"
  } as const;
  
  export type CharacterType = typeof CHARACTER[keyof typeof CHARACTER];