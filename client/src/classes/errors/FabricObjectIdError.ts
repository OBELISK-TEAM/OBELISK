export class FabricObjectIdError extends Error {
  constructor(obj: any) {
    super(`The object ${obj} has no '_id' property. If so, a dev has done an unfortunate mistake`);
    this.name = "ObjectIdError";
  }
}
