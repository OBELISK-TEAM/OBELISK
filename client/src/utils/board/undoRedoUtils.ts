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

/**
 * In fabricjs, if an object is assigned to a group, its properties are relative to the group's properties
 * and they are no longer absolute (i.e. relative to the canvas).
 *
 * This function returns JSON of a fabric.Object with "derelativised" properties (top, left) from a group it is currently in.
 * @param obj An object to process
 * @returns JSON representation according to
 */
export const getJsonWithAbsoluteProperties = (obj: fabric.Object): any[] => {
  const objJSON = obj.toJSON(["id"]) as any;

  const group = obj.group;
  if (!group) {
    return objJSON;
  }

  if (objJSON.left && group.left && group.width) {
    objJSON.left += group.left + group.width / 2;
  }
  if (objJSON.top && group.top && group.height) {
    objJSON.top += group.top + group.height / 2;
  }
  
  return objJSON;
};
