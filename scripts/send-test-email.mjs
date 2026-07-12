import { readFileSync } from 'node:fs'

const envText = readFileSync(new URL('../.env', import.meta.url), 'utf8')
const env = Object.fromEntries(
  envText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const separator = line.indexOf('=')
      return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()]
    }),
)

const apiKey = env.RESEND_KEY

if (!apiKey) {
  console.error('Missing RESEND_KEY in .env')
  process.exit(1)
}

const payload = {
  from: 'UAH Careers <careers@unitedacehealthcare.com>',
  to: ['boluwatifeobasa830@gmail.com'],
  subject: 'United Ace Healthcare careers email test',
  text: [
    'This is a Resend test email from United Ace Healthcare.',
    '',
    'If you received this, the careers sender is working.',
  ].join('\n'),
  html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #13201a;">
      <h1 style="font-size: 20px;">United Ace Healthcare careers email test</h1>
      <p>This is a Resend test email from United Ace Healthcare.</p>
      <p>If you received this, the careers sender is working.</p>
    </div>
  `,
}

const response = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(payload),
})

const result = await response.json().catch(() => ({}))

if (!response.ok) {
  console.error('Resend email send failed:')
  console.error(JSON.stringify(result, null, 2))
  process.exit(1)
}

console.log(`Email sent. Resend id: ${result.id}`)
