require('dotenv').config()
import aws from 'aws-sdk'
import crypto from 'crypto'

aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_SES,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_SES,
    region: 'us-west-2',
})

const EMAIL_VERIFICATION_TOKEN_BYTES = 24

const getEmailBody = (href: string) => {
    return `<a href="${href}" target="_blank">Click here to verify your email and become a referrer.</a>`
}

export const getVerificationToken = () =>
    crypto.randomBytes(EMAIL_VERIFICATION_TOKEN_BYTES).toString('hex')

export const sendEmail = async (to: string, username: string, link: string) => {
    const params = {
        Destination: {
            // /* required */
            ToAddresses: [to],
        },
        Message: {
            /* required */
            Subject: {
                Charset: 'UTF-8',
                Data: `Conirm your subscription to ${username}'s list`,
            },
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: getEmailBody(link),
                },
                // Text: {
                //     Charset: 'UTF-8',
                //     Data: ,
                // },
            },
        },
        Source: `${username}@circel.me` /* required */,
    }

    // Create the promise and SES service object
    const sendPromise = new aws.SES().sendEmail(params).promise()

    const data = await sendPromise
    console.log('Sent email', data.MessageId)
}
