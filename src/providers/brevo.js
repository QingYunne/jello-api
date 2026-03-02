import { BrevoClient } from '@getbrevo/brevo'
import { env } from '~/config/environment'

const SENDER = { email: env.BREVO_EMAIL_SENDER, name: env.BREVO_NAME_SENDER }

let client = null

const getClient = () => {
  if (!client) {
    client = new BrevoClient({ apiKey: env.BREVO_API_KEY })
  }
  client.transactionalEmail

  return client
}

export const send = async ({ to, toName, subject, html }) => {
  const brevoClient = getClient()

  const recipients = toName ? [{ email: to, name: toName }] : [{ email: to }]

  return await brevoClient.transactionalEmail.sendTransacEmail({
    subject,
    htmlContent: html,
    sender: SENDER,
    to: recipients
  })
}
