import { db } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import parseReadableStream from "@/app/helpers/parseReadableStream";

// READ
export async function GET(request: NextRequest) {
  try {
    // Access query parameters
    const query = request.nextUrl.searchParams;
    const rosierID = query.get("rosierID");

    if (!rosierID) {
      throw new Error("There's no rosier postgres id");
    }

    const observationsByRosierID = await db.observations.findMany({
      where: {
        id_rosier: +rosierID,
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    return NextResponse.json(
      { observations: observationsByRosierID },
      { status: 200 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error getting observations:", error);

    if (error && error.message === "Not authorized") {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error, message: "Failed to get observations" },
      { status: 500 }
    );
  }
}

// CREATE
export async function POST(request: NextRequest) {
  try {
    const data = request.body;
    const observationData = await parseReadableStream(data);

    if (!observationData) {
      throw new Error("There's no observation to create");
    }

    const createdObservation = await db.observations.create({
      data: observationData,
    });

    return NextResponse.json(createdObservation, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating observation:", error);

    if (error && error.message === "Not authorized") {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error, message: "Failed to create observation" },
      { status: 500 }
    );
  }
}

// UPDATE
export async function PUT(request: NextRequest) {
  try {
    // Access query parameters
    const query = request.nextUrl.searchParams;
    const observationID = query.get("observationID");
    const data = request.body;

    const observationData = await parseReadableStream(data);

    if (!observationID) {
      throw new Error("There's no observation ID");
    }

    if (!observationData) {
      throw new Error("There's no observation to update");
    }

    const updatedObservation = await db.observations.update({
      where: {
        id: +observationID,
      },
      data: observationData,
    });

    return NextResponse.json(updatedObservation, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error updating observation:", error);

    if (error && error.message === "Not authorized") {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error, message: "Failed to update observation" },
      { status: 500 }
    );
  }
}
