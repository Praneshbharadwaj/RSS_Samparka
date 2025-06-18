// pages/api/user.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const sl = Number(req.query.sl);
  const db = await getDb();
  const user = await db.collection("Samparka").findOne({ slNo: sl });
  res.json(user || {});
}
