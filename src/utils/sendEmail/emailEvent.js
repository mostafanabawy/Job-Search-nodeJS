import { EventEmitter } from 'events';
import sendEmail, { emails } from './sendEmail.js';
import { tokenSign } from '../tokenHandler/tokenHandler.js';


export const emailEmitter = new EventEmitter();
emailEmitter.on('OTPAndSendEmail', async ({ otp, email, name, emails }) => {
    /* const token = tokenSign({ email }, '30m', process.env.ACTIVATE_ACCOUNT_TOKEN_SECRET);
    const link = `http://localhost:3000/auth/activateAccount/${token}`; */
    sendEmail(
        {
            email,
            subject: emails.subject,
            html: emails.html(otp, name)
        }
    )
})