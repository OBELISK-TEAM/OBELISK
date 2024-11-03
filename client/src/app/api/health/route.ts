export async function GET(): Promise<Response> {
  return new Response("healthy", { status: 200 });
}
