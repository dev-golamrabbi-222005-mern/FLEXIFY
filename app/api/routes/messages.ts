import { dbConnect } from "@/lib/dbConnect";
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  const { userId, coachId } = req.query;
  if (!userId || !coachId)
    return res.status(400).json({ error: "Missing params" });

  const messagesCol = await dbConnect("messages");
  const messages = await messagesCol
    .find({ userId, coachId })
    .sort({ createdAt: 1 })
    .toArray();

  res.json(messages);
});

export default router;
