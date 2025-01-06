import { db } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import parseReadableStream from "@/app/helpers/parseReadableStream";

// READ
export async function GET(request: NextRequest) {
  try {
    // Access query parameters
    const query = request.nextUrl.searchParams;
    const plotID = query.get("plotID");

    if (!plotID) {
      throw new Error("There's no plot postgres id");
    }

    const rosiersByPlotID = await db.rosiers.findMany({
      where: {
        id_parcelle: +plotID,
      },
    });

    return NextResponse.json({ rosiers: rosiersByPlotID }, { status: 200 });
  } catch (error) {
    console.error("Error getting rosiers:", error);

    return NextResponse.json(
      { error, message: "Failed to get rosiers" },
      { status: 500 }
    );
  }
}

// CREATE
export async function POST(request: NextRequest) {
  try {
    const data = request.body;

    const rosierData = await parseReadableStream(data);

    if (!rosierData) {
      throw new Error("There's no rosier to create");
    }

    const createdRosier = await db.rosiers.create({
      data: rosierData,
    });

    return NextResponse.json(createdRosier, { status: 200 });
  } catch (error) {
    console.error("Error creating rosier:", error);

    return NextResponse.json(
      { error, message: "Failed to create rosier" },
      { status: 500 }
    );
  }
}

// UPDATE
export async function PUT(request: NextRequest) {
  try {
    const data = request.body;
    const rosierData = await parseReadableStream(data);

    if (!rosierData) {
      throw new Error("There's no rosier to update");
    }

    const updatedPlot = await db.rosiers.update({
      where: {
        id: +rosierData.id,
      },
      data: rosierData,
    });

    return NextResponse.json(updatedPlot, { status: 200 });
  } catch (error) {
    console.error("Error updating rosier:", error);

    return NextResponse.json(
      { error, message: "Failed to update rosier" },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(request: NextRequest) {
  try {
    // Access query parameters
    const query = request.nextUrl.searchParams;
    const rosierID = query.get("rosierID");

    if (!rosierID) {
      throw new Error("There's no rosier ID present");
    }

    // Delete observations
    await db.observations.deleteMany({
      where: {
        id_rosier: +rosierID,
      },
    });

    // Delete rosier
    const deletedPlot = await db.rosiers.delete({
      where: {
        id: +rosierID,
      },
    });

    return NextResponse.json(deletedPlot, { status: 200 });
  } catch (error) {
    console.error("Error deleting rosier:", error);

    return NextResponse.json(
      { error, message: "Failed to delete rosier" },
      { status: 500 }
    );
  }
}
