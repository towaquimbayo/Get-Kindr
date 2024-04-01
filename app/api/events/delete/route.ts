import prisma from "@/lib/prisma";

/**
 * Endpoint to delete an event by id
 * @endpoint DELETE /events/delete - id
 * @param {Request} request - The incoming request
 * @returns {Response} - The response to the incoming request
 */
export async function DELETE(request: Request) {
  try {
    // Get the id from the request.
    const { id } = await request.json();
    // If the id is missing, return an error response.
    if (!id) {
      return new Response("Missing id", {
        status: 400,
      });
    }
    // Delete the event from the database.
    await prisma.event.delete({
      where: { id },
    });
    // Return a success message.
    return new Response("Event deleted", { status: 200 });
  } catch (error) {
    // If there is an error deleting the event, return an error response.
    console.error(error);
    return new Response("Error deleting event: " + error, {
      status: 500,
    });
  }
}
