export const dynamic = "force-dynamic";
import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const q = String(req.query.name || "").trim();
  const db = await getDb();

  if (!q) {
    return res.status(400).json({ error: "Search term is empty" });
  }

  // Get one document to infer fields
  const sample = await db.collection("Samparka").findOne();
  if (!sample) return res.json([]);

  // Build conditions for all string or number fields
  const conditions = Object.keys(sample)
    .filter((key) => {
      const value = sample[key];
      return typeof value === "string" || typeof value === "number";
    })
    .map((field) => ({
      [field]: { $regex: q, $options: "i" },
    }));

  const matches = await db
    .collection("Samparka")
    .find({ $or: conditions })
    .toArray();

  res.json(matches);
}
