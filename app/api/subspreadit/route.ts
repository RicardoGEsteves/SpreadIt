import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubSpreadItValidator } from "@/lib/validators/sub-spreadIt";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name } = SubSpreadItValidator.parse(body);

    // check if subSpreadIt already exists
    const subSpreadItExists = await db.subSpreadIt.findFirst({
      where: {
        name,
      },
    });

    if (subSpreadItExists) {
      return new Response("SubSpreadIt already exists", { status: 409 });
    }

    // create subSpreadIt and associate it with the user
    const subSpreadIt = await db.subSpreadIt.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    });

    // creator also has to be subSpreadIt
    await db.subscription.create({
      data: {
        userId: session.user.id,
        subSpreadItId: subSpreadIt.id,
      },
    });

    return new Response(subSpreadIt.name);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not create subSpreadIt", { status: 500 });
  }
}
