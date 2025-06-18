// pages/api/search.ts
export const dynamic = "force-dynamic";
import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const q = String(req.query.name || "");
  const db = await getDb();
  const matches = await db
    .collection("Samparka")
    .find({ Name: { $regex: q, $options: "i" } })
    .toArray();
  res.json(matches);
}
