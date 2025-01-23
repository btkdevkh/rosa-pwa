import { db } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import parseReadableStream from "@/app/helpers/parseReadableStream";
import authRequired from "../auth/authRequired";

// READ
export async function GET(request: NextRequest) {
  try {
    // Auth required
    await authRequired();

    // Access query parameters
    const query = request.nextUrl.searchParams;
    const exploitationID = query.get("exploitationID");

    if (!exploitationID) {
      throw new Error("There's no exploitation postgres id");
    }

    // Find wanted includes tables
    const plotsByExploitationID = await db.parcelles.findMany({
      where: {
        id_exploitation: +exploitationID,
      },
      include: {
        Rosiers: {
          include: {
            Observations: {
              orderBy: {
                timestamp: "asc",
              },
            },
            Parcelles: true,
          },
        },
      },
    });

    if (plotsByExploitationID.length === 0) {
      throw new Error("There're no plots in exploitation found");
    }

    // Plots
    const plots = plotsByExploitationID.flatMap(plot =>
      plot.Rosiers.flatMap(rosier => rosier.Parcelles)
    );

    // Rosiers
    const rosiers = plotsByExploitationID.flatMap(plot => plot.Rosiers);

    // Observations
    const observations = plotsByExploitationID.flatMap(plot =>
      plot.Rosiers.flatMap(rosier => rosier.Observations)
    );

    return NextResponse.json({ plots, rosiers, observations }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error getting plots:", error);

    if (error && error.message === "Not authorized") {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error, message: "Failed to get plots" },
      { status: 500 }
    );
  }
}

// CREATE
export async function POST(request: NextRequest) {
  try {
    // Auth required
    await authRequired();

    const data = request.body;

    const plotData = await parseReadableStream(data);

    if (!plotData) {
      throw new Error("There's no plot to create");
    }

    const createdPlot = await db.parcelles.create({
      data: plotData,
    });

    return NextResponse.json(createdPlot, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating plot:", error);

    if (error && error.message === "Not authorized") {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error, message: "Failed to create plot" },
      { status: 500 }
    );
  }
}

// UPDATE
export async function PUT(request: NextRequest) {
  try {
    // Auth required
    await authRequired();

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error updating plot:", error);

    if (error && error.message === "Not authorized") {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error, message: "Failed to update plot" },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(request: NextRequest) {
  try {
    // Auth required
    await authRequired();

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error deleting plot:", error);

    if (error && error.message === "Not authorized") {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error, message: "Failed to delete plot" },
      { status: 500 }
    );
  }
}
