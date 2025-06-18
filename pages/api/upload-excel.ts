export const dynamic = "force-dynamic";
import { getDb, getNextSeq } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getDb();

  if (req.method === "POST") {
    const { data } = req.body;

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ error: "Invalid or empty data" });
    }

    try {
      for (const item of data) {
        item.slNo = await getNextSeq("sl_no_seq");
        await db.collection("Samparka").insertOne(item);
      }

      return res
        .status(200)
        .json({ success: true, message: "Data inserted with slNo sequence" });
    } catch (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ error: "Failed to insert data" });
    }
  }

  res.status(405).end(); // Method Not Allowed
}
