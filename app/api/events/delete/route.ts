import prisma from "@/lib/prisma";

/**
 * Endpoint to delete an event by id
 * @endpoint DELETE /events/delete
 * @param {Request} request - The incoming request
 * @returns {Response} - The response to the incoming request
 */
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return new Response("Missing id", {
        status: 400,
      });
    }
    await prisma.event.delete({
      where: { id },
    });
    return new Response("Event deleted", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error deleting event: " + error, {
      status: 500,
    });
  }
}
