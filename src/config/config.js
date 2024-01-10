import donenv from 'dotenv'
donenv.config({
    path: `.env.${process.env.NODE_ENV}`
})

export const MYSQL_HOST = process.env.MYSQL_HOST
export const MYSQL_DATABASE = process.env.MYSQL_DATABASE
export const MYSQL_USER = process.env.MYSQL_USER
export const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD
export const PORT = process.env.PORT