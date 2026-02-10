import { NextResponse } from "next/server";

let demarches: any = null;
try {
  demarches = (await import("../../data/demarches.json")).default;
} catch (e) {
  // will handle below
}

export async function GET() {
  try {
    if (!demarches) {
      // attempted dynamic import failed — try synchronous require as fallback
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        demarches = require("../../data/demarches.json");
      } catch (err) {
        console.error("/api/demarches: failed to load data file", err);
        return NextResponse.json({ error: "Data not found" }, { status: 500 });
      }
    }

    console.log("/api/demarches: returning", Array.isArray(demarches) ? demarches.length : typeof demarches);
    return NextResponse.json(demarches ?? demarches);
  } catch (err) {
    console.error("/api/demarches error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
