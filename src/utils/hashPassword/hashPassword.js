import bcrypt from 'bcryptjs';
export function hashGiven(str){
    return bcrypt.hash(str.toString(), Number(process.env.ROUNDS))
}
export function compareHash(plain, encrypted){
    return bcrypt.compare(plain, encrypted)
}