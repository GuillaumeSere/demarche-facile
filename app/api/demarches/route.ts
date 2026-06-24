import { NextResponse } from "next/server";
import demarches from "../../data/demarches.json";

export async function GET() {
  return NextResponse.json(demarches);
}
