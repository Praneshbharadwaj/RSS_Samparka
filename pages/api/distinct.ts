// pages/api/distinct.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "../../lib/db";

const allowedFields = [
  "Title",
  "Organisation 1",
  "Organisation 2",
  "Designation 1",
  "Designation 2",
  "Category",
  "Area",
  "Nagara",
  "St Coordinator",
  "Re-assigned (Patti Hanchike)",
  "Group",
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { field } = req.query;
  if (typeof field !== "string" || !allowedFields.includes(field)) {
    return res.status(400).json({ error: "Invalid field" });
  }

  const db = await getDb();
  const vals = await db
    .collection("Samparka")
    .distinct(field, { [field]: { $exists: true, $ne: "" } });

  res.json(vals.sort());
}
