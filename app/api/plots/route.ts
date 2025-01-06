import { db } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import parseReadableStream from "@/app/helpers/parseReadableStream";
import { getServerSession } from "next-auth";
import authOptions from "../auth/authOptions";

// READ
export async function GET(request: NextRequest) {
  // Auth required
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  try {
    // Access query parameters
    const query = request.nextUrl.searchParams;
    const exploitationID = query.get("exploitationID");

    if (!exploitationID) {
      throw new Error("There's no exploitation postgres id");
    }

    const plotsByexploitationID = await db.parcelles.findMany({
      where: {
        id_exploitation: +exploitationID,
      },
    });

    return NextResponse.json({ plots: plotsByexploitationID }, { status: 200 });
  } catch (error) {
    console.error("Error getting plots:", error);

    return NextResponse.json(
      { error, message: "Failed to get plots" },
      { status: 500 }
    );
  }
}

// CREATE
export async function POST(request: NextRequest) {
  // Auth required
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  try {
    const data = request.body;

    const plotData = await parseReadableStream(data);

    if (!plotData) {
      throw new Error("There's no plot to create");
    }

    const createdPlot = await db.parcelles.create({
      data: plotData,
    });

    return NextResponse.json(createdPlot, { status: 200 });
  } catch (error) {
    console.error("Error creating plot:", error);

    return NextResponse.json(
      { error, message: "Failed to create plot" },
      { status: 500 }
    );
  }
}

// UPDATE
export async function PUT(request: NextRequest) {
  // Auth required
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  try {
    const data = request.body;
    const plotData = await parseReadableStream(data);

    if (!plotData) {
      throw new Error("There's no plot to update");
    }

    const updatedPlot = await db.parcelles.update({
      where: {
        id: +plotData.id,
      },
      data: plotData,
    });

    return NextResponse.json(updatedPlot, { status: 200 });
  } catch (error) {
    console.error("Error updating plot:", error);

    return NextResponse.json(
      { error, message: "Failed to update plot" },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(request: NextRequest) {
  // Auth required
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  try {
    // Access query parameters
    const query = request.nextUrl.searchParams;
    const plotID = query.get("plotID");

    if (!plotID) {
      throw new Error("There's no plot ID present");
    }

    // Get the related rosiers and their IDs
    const rosierIds = await db.parcelles
      .findUnique({
        where: { id: +plotID },
        select: { Rosiers: { select: { id: true } } },
      })
      .then(plot => plot?.Rosiers.map(rosier => rosier.id));

    // Delete the related observations by rosier IDs
    await db.observations.deleteMany({
      where: {
        id_rosier: {
          in: rosierIds, // Array of Rosier IDs
        },
      },
    });

    // Delete rosier(s) associated with the plot
    await db.rosiers.deleteMany({
      where: {
        id_parcelle: +plotID,
      },
    });

    // Delete plot
    const deletedPlot = await db.parcelles.delete({
      where: {
        id: +plotID,
      },
    });

    return NextResponse.json(deletedPlot, { status: 200 });
  } catch (error) {
    console.error("Error deleting plot:", error);

    return NextResponse.json(
      { error, message: "Failed to delete plot" },
      { status: 500 }
    );
  }
}
