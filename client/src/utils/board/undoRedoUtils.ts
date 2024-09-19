export function removeListenersTemporarily(canvas: fabric.Canvas, key: string): any {
  // @ts-expect-error This whole code is hacky enough
  const listeners = canvas.__eventListeners[key];
  // @ts-expect-error This whole code is hacky enough
  canvas.__eventListeners[key] = [];

  return listeners;
}

export function addListenersBack(canvas: fabric.Canvas, key: string, listeners: any) {
  // @ts-expect-error This whole code is hacky enough
  canvas.__eventListeners[key] = listeners;
}
