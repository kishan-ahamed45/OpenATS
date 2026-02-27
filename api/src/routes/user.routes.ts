import { Router,type Router as ExpressRouter } from "express";
import { db } from "../db";
import { usersTable } from "../db/schema";

const router: ExpressRouter = Router();
router.get("/", async (req, res) => {
    const users = await db.select().from(usersTable);
    res.json(users);
});

router.post("/", async (req, res) => {
    const { name, age, email } = req.body;
    const user = await db.insert(usersTable).values({ name, age, email });
    res.json(user);
});


export default router;