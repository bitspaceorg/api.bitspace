import { Request, Response } from 'express'
import { pool } from '../../db'
import { newUser } from '../queries'
import { waitlistUserSchema } from '../validators'
import { fromZodError } from 'zod-validation-error'

export const addToWaitlist = async (req: Request, res: Response) => {
    const zod = waitlistUserSchema.safeParse(req.body)
    if (!zod.success) return res.status(417).json({ statusCode: 417, body: { message: "Zod error.", error: fromZodError(zod.error) } })

    const { email, name } = req.body

    try {
        const data = await pool.query(newUser, [email, name])
        return res.status(200).json({ statusCode: 200, body: { message: "User added to waitlist successfully." , data } })
    } catch (err) {
        return res.status(400).json({ statusCode: 400, body: { message: "Failed to add user to waitlist.", err } })
    }
}
