export interface SlideObjectTextStyles {
  [lineIndex: number]: {
    [charIndex: number]: {
      [property: string]: string | number | boolean;
    };
  };
}
