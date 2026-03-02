import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend'
import { env } from '~/config/environment'

const { MAILERSEND_API_KEY, MAILERSEND_EMAIL_FROM, MAILERSEND_NAME_FROM } = env

let client = null
let sender = null

const getClient = () => {
  if (!client) client = new MailerSend({ apiKey: MAILERSEND_API_KEY })
  return client
}

const getSender = () => {
  if (!sender) sender = new Sender(MAILERSEND_EMAIL_FROM, MAILERSEND_NAME_FROM)
  return sender
}

export const send = async ({ to, toName = null, subject, html }) => {
  const mailerSendClient = getClient()
  const sender = getSender()

  const recipients = toName ? [new Recipient(to, toName)] : [new Recipient(to)]

  const emailParams = new EmailParams()
    .setFrom(sender)
    .setTo(recipients)
    .setReplyTo(sender)
    .setSubject(subject)
    .setHtml(html)

  return await mailerSendClient.email.send(emailParams)
}
