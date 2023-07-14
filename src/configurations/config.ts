import dotenv from "dotenv"

dotenv.config()

const PORT = process.env.PORT || 8088
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || ""
const JWT_SECRET = process.env.JWT_SECRET || ""

export const config = {
    server: {
        PORT: PORT
    },
    sendgrid: {
        SENDGRID_API_KEY: SENDGRID_API_KEY
    },
    jwt: {
        JWT_SECRET: JWT_SECRET
    }
}