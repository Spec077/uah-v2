const RESEND_API_URL = 'https://api.resend.com/emails'
const FROM_EMAIL = 'UAH Website <careers@unitedacehealthcare.com>'
const INQUIRY_EMAIL = 'info@unitedacehealthcare.com'

function json(res, status, payload) {
  if (typeof res.status === 'function') res.status(status)
  else res.statusCode = status

  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

function normalizeText(value, maxLength) {
  const text = typeof value === 'string' ? value.trim() : ''
  return maxLength ? text.slice(0, maxLength) : text
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string') return JSON.parse(req.body)

  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const rawBody = Buffer.concat(chunks).toString('utf8')
  return rawBody ? JSON.parse(rawBody) : {}
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    json(res, 405, { error: 'Method not allowed.' })
    return
  }

  if (!process.env.RESEND_KEY) {
    json(res, 500, { error: 'Email service is not configured.' })
    return
  }

  try {
    const body = await readBody(req)
    const inquiry = {
      name: normalizeText(body.name, 120),
      phone: normalizeText(body.phone, 40),
      email: normalizeText(body.email, 200),
      inquiryType: normalizeText(body.inquiryType, 120),
      message: normalizeText(body.message, 1200),
    }

    if (!inquiry.name || !inquiry.phone || !inquiry.email || !inquiry.inquiryType || !inquiry.message) {
      json(res, 400, { error: 'Please complete all required fields.' })
      return
    }

    if (!isEmail(inquiry.email)) {
      json(res, 400, { error: 'Please enter a valid email address.' })
      return
    }

    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [INQUIRY_EMAIL],
        reply_to: inquiry.email,
        subject: `New website inquiry: ${inquiry.inquiryType}`,
        text: [
          'New website inquiry',
          '',
          `Name: ${inquiry.name}`,
          `Phone: ${inquiry.phone}`,
          `Email: ${inquiry.email}`,
          `Inquiry type: ${inquiry.inquiryType}`,
          '',
          'Message:',
          inquiry.message,
        ].join('\n'),
        html: `
          <h2>New website inquiry</h2>
          <p><strong>Name:</strong> ${escapeHtml(inquiry.name)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(inquiry.phone)}</p>
          <p><strong>Email:</strong> <a href="mailto:${escapeHtml(inquiry.email)}">${escapeHtml(inquiry.email)}</a></p>
          <p><strong>Inquiry type:</strong> ${escapeHtml(inquiry.inquiryType)}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-wrap">${escapeHtml(inquiry.message)}</p>
        `,
      }),
    })

    const result = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(result?.message || 'Email service rejected the inquiry.')

    json(res, 200, { ok: true })
  } catch (error) {
    json(res, 500, { error: error.message || 'Unable to submit inquiry.' })
  }
}
