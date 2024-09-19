export class FabricObjectIdError extends Error {
  constructor(obj: Object) {
    super(`The object ${obj} has no 'id' property`);
    this.name = "ObjectIdError";
  }
}
