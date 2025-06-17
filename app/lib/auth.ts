/* eslint-disable @typescript-eslint/no-explicit-any */

import jwt, { SignOptions } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export const generateToken = async (payload: object, expiresIn: jwt.SignOptions['expiresIn'] = '7d') => {
    const options: SignOptions = { expiresIn }
    return jwt.sign(payload, JWT_SECRET, options)
}

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch (error: any) {
        return null
    }
}
