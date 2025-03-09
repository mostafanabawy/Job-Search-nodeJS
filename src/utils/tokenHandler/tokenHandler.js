import jwt from "jsonwebtoken"

export function tokenSign(load, time, secret) {
    return jwt.sign(load, secret, {expiresIn: time})
}

export function tokenVerify(token, secret) {
    return jwt.verify(token, secret)
}

