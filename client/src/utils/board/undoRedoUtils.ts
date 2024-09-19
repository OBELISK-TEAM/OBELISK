export function removeListenersTemporarily(canvas: fabric.Canvas, key: string): any {
  // @ts-ignore
  const listeners = canvas.__eventListeners[key];
  // @ts-ignore
  canvas.__eventListeners[key] = [];

  return listeners;
}

export function addListenersBack(canvas: fabric.Canvas, key: string, listeners: any) {
  // @ts-ignore
  canvas.__eventListeners[key] = listeners;
}
