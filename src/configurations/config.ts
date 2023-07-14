import dotenv from "dotenv"

dotenv.config()

const PORT = process.env.PORT || 8088
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || ""
const JWT_SECRET = process.env.JWT_SECRET || ""
const SENDGRID_VERIFIED_SENDER = process.env.SENDGRID_VERIFIED_SENDER

export const config = {
    server: {
        PORT: PORT
    },
    sendgrid: {
        SENDGRID_API_KEY: SENDGRID_API_KEY,
        SENDGRID_VERIFIED_SENDER: SENDGRID_VERIFIED_SENDER
    },
    jwt: {
        JWT_SECRET: JWT_SECRET
    }
}