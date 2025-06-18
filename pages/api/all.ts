// pages/api/all.ts
export const dynamic = "force-dynamic";
import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "../../lib/db";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const db = await getDb();
  const all = await db.collection("Samparka").find().toArray();
  res.json(all);
}
