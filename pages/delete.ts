import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  let { slNo, secretKey } = req.body;
  console.log("--->", { slNo, secretKey });
  slNo = Number(slNo); // Convert slNo to number

  if (!slNo || !secretKey || secretKey.length !== 6) {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  try {
    const db = await getDb();

    // 1. Verify secret key
    const secretDoc = await db
      .collection("secrets")
      .findOne({ key: secretKey });
    if (!secretDoc) {
      return res.status(403).json({ success: false, message: "Invalid key" });
    }

    // 2. Find the document by slNo
    const doc = await db.collection("Samparka").findOne({ slNo });

    if (!doc) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    console.log(`Found record with _id: ${doc._id} for slNo: ${slNo}`);

    // 3. Delete using _id
    const result = await db.collection("Samparka").deleteOne({ _id: doc._id });

    if (result.deletedCount === 1) {
      return res.json({ success: true, message: "Deleted successfully" });
    } else {
      return res.status(500).json({ success: false, message: "Delete failed" });
    }
  } catch (err) {
    console.error("Deletion error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
