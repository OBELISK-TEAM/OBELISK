export class FabricObjectIdError extends Error {
  constructor(obj: any) {
    super(`The object ${obj} has no 'id' property`);
    this.name = "ObjectIdError";
  }
}
