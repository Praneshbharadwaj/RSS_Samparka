export const dynamic = "force-dynamic";
import type { NextApiRequest, NextApiResponse } from "next";
import { getDb, getNextSeq } from "../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let data = req.body;
  const db = await getDb();

  if (data.slNo) {
    const { _id, ...updateData } = data; // Remove _id before update
    await db
      .collection("Samparka")
      .updateOne({ slNo: data.slNo }, { $set: updateData });
    return res.json({ status: "updated" });
  }

  data.slNo = await getNextSeq("sl_no_seq");
  await db.collection("Samparka").insertOne(data);
  res.json({ status: "created", slNo: data.slNo });
}
