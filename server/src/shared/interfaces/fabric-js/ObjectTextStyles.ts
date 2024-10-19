export interface ObjectTextStyles {
  [lineIndex: number]: {
    [charIndex: number]: {
      [property: string]: string | number | boolean;
    };
  };
}
