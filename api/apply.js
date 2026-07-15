import { readFileSync } from 'node:fs'
import { createApplicationPdf } from './application-pdf.js'

const RESEND_API_URL = 'https://api.resend.com/emails'
const FROM_EMAIL = 'UAH Careers <careers@unitedacehealthcare.com>'
const RECRUITER_EMAIL = 'info@unitedacehealthcare.com'
const MAX_RESUME_SIZE = 3 * 1024 * 1024
const ALLOWED_RESUME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

const applicantTemplate = readFileSync(new URL('../applicant-confirmation.html', import.meta.url), 'utf8')
const recruiterTemplate = readFileSync(new URL('../recruiter-notification.html', import.meta.url), 'utf8')

function json(res, status, payload) {
  if (typeof res.status === 'function') {
    res.status(status)
  } else {
    res.statusCode = status
  }

  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

function empty(res, status) {
  if (typeof res.status === 'function') {
    res.status(status)
  } else {
    res.statusCode = status
  }

  res.end()
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function renderTemplate(template, values) {
  return template.replaceAll(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key) => escapeHtml(values[key] ?? ''))
}

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function firstName(name) {
  return normalizeText(name).split(/\s+/)[0] || 'there'
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body
  }

  if (typeof req.body === 'string') {
    return JSON.parse(req.body)
  }

  const chunks = []

  for await (const chunk of req) {
    chunks.push(chunk)
  }

  const rawBody = Buffer.concat(chunks).toString('utf8')
  return rawBody ? JSON.parse(rawBody) : {}
}

function validateResume(resume) {
  if (!resume) {
    return null
  }

  const name = normalizeText(resume.name)
  const type = normalizeText(resume.type)
  const content = normalizeText(resume.content)
  const size = Number(resume.size)

  if (!name || !content || !Number.isFinite(size)) {
    throw new Error('Resume upload is invalid.')
  }

  if (size > MAX_RESUME_SIZE) {
    throw new Error('Resume must be 3 MB or smaller.')
  }

  if (!ALLOWED_RESUME_TYPES.has(type)) {
    throw new Error('Resume must be a PDF, DOC, or DOCX file.')
  }

  return { name, type, content, size }
}

function attachmentName(name) {
  const slug = normalizeText(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return `united-ace-application-${slug || 'applicant'}.pdf`
}

async function sendEmail(apiKey, payload) {
  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const result = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message = result?.message || result?.error || 'Resend rejected the email.'
    throw new Error(message)
  }

  return result
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    empty(res, 204)
    return
  }

  if (req.method !== 'POST') {
    json(res, 405, { error: 'Method not allowed.' })
    return
  }

  const apiKey = process.env.RESEND_KEY

  if (!apiKey) {
    json(res, 500, { error: 'Email service is not configured.' })
    return
  }

  try {
    const body = await readBody(req)
    const application = {
      name: normalizeText(body.name),
      phone: normalizeText(body.phone),
      email: normalizeText(body.email),
      city: normalizeText(body.city),
      state: normalizeText(body.state),
      role: normalizeText(body.role),
      employmentType: normalizeText(body.employmentType),
      availability: normalizeText(body.availability),
      experience: normalizeText(body.experience),
      licenseState: normalizeText(body.licenseState),
      licenseNumber: normalizeText(body.licenseNumber),
      licenseExpiration: normalizeText(body.licenseExpiration),
      workAuthorized: normalizeText(body.workAuthorized),
      accuracyCertified: normalizeText(body.accuracyCertified),
      message: normalizeText(body.message),
    }

    if (
      !application.name ||
      !application.phone ||
      !application.email ||
      !application.city ||
      !application.state ||
      !application.role ||
      !application.employmentType ||
      !application.availability ||
      !application.experience ||
      !application.licenseState ||
      !application.workAuthorized ||
      !application.accuracyCertified
    ) {
      json(res, 400, { error: 'Please complete all required fields.' })
      return
    }

    if (!isEmail(application.email)) {
      json(res, 400, { error: 'Please enter a valid email address.' })
      return
    }

    const resume = validateResume(body.resume)

    const submittedAt = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'America/Chicago',
    }).format(new Date())

    const values = {
      ...application,
      firstName: firstName(application.name),
      message: application.message || 'No additional notes provided.',
      licenseNumber: application.licenseNumber || 'Not provided',
      licenseExpiration: application.licenseExpiration || 'Not provided',
      resumeName: resume?.name || 'No resume uploaded',
      submittedAt,
      source: 'Careers Page',
    }

    const applicationPdf = await createApplicationPdf(values, { submittedAt })
    const applicationPdfAttachment = {
      filename: attachmentName(application.name),
      content: applicationPdf.toString('base64'),
    }

    const attachments = resume
      ? [
          {
            filename: resume.name,
            content: resume.content,
          },
        ]
      : []

    await sendEmail(apiKey, {
      from: FROM_EMAIL,
      to: [application.email],
      reply_to: RECRUITER_EMAIL,
      subject: 'We received your United Ace Healthcare application',
      html: renderTemplate(applicantTemplate, values),
      text: `Hi ${values.firstName},\n\nWe received your application for ${application.role}. Our team will review your information and contact you if your background matches a current opening.\n\nUnited Ace Healthcare`,
      attachments: [applicationPdfAttachment],
    })

    await sendEmail(apiKey, {
      from: FROM_EMAIL,
      to: [RECRUITER_EMAIL],
      reply_to: application.email,
      subject: `New careers application: ${application.name} - ${application.role}`,
      html: renderTemplate(recruiterTemplate, values),
      text: [
        'New Job Application',
        '',
        `Name: ${application.name}`,
        `Phone: ${application.phone}`,
        `Email: ${application.email}`,
        `City/State: ${application.city}, ${application.state}`,
        `Role: ${application.role}`,
        `Employment Type: ${application.employmentType}`,
        `Availability: ${application.availability}`,
        `Experience: ${application.experience}`,
        `Current License State: ${application.licenseState}`,
        `License Number: ${values.licenseNumber}`,
        `License Expiration: ${values.licenseExpiration}`,
        `Authorized to Work in US: ${application.workAuthorized}`,
        `Accuracy Certified: ${application.accuracyCertified}`,
        `Resume: ${values.resumeName}`,
        `Notes: ${values.message}`,
      ].join('\n'),
      attachments: [applicationPdfAttachment, ...attachments],
    })

    json(res, 200, { ok: true })
  } catch (error) {
    console.error(error)
    json(res, 500, { error: error.message || 'Unable to submit application.' })
  }
}
