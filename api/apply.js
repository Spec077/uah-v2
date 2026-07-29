import { readFileSync } from 'node:fs'
import { createApplicationPdf } from './application-pdf.js'

const RESEND_API_URL = 'https://api.resend.com/emails'
const FROM_EMAIL = 'UAH Careers <careers@unitedacehealthcare.com>'
const RECRUITER_EMAIL = 'info@unitedacehealthcare.com'
// const RECRUITER_EMAIL = 'boluwatifeobasa830@gmail.com'
const MAX_RESUME_SIZE = 3 * 1024 * 1024
const MAX_COMBINED_UPLOAD_SIZE = 3 * 1024 * 1024
const ALLOWED_RESUME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])
const TAXPAYER_ID_PATTERN =
  /^(?:(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}|9\d{2}-(?:7\d|8\d|9[0-2]|9[4-9])-\d{4})$/
const ALLOWED_ID_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/heic',
  'image/heif',
])

const applicantTemplate = readFileSync(new URL('../applicant-confirmation.html', import.meta.url), 'utf8')
const recruiterTemplate = readFileSync(new URL('../recruiter-notification.html', import.meta.url), 'utf8')

class UploadValidationError extends Error {}

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

function normalizeList(value) {
  return Array.isArray(value) ? value.map(normalizeText).filter(Boolean).join(', ') : normalizeText(value)
}

function firstName(name) {
  return normalizeText(name).split(/\s+/)[0] || 'there'
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isTaxpayerId(value) {
  return TAXPAYER_ID_PATTERN.test(value)
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

function validateUpload(upload, { allowedTypes, label, maxSize = MAX_RESUME_SIZE }) {
  if (!upload) {
    return null
  }

  const name = normalizeText(upload.name)
  const type = normalizeText(upload.type)
  const content = normalizeText(upload.content)
  const size = Number(upload.size)

  if (!name || !content || !Number.isFinite(size)) {
    throw new UploadValidationError(`${label} upload is invalid.`)
  }

  if (size > maxSize) {
    throw new UploadValidationError(`${label} must be 3 MB or smaller.`)
  }

  if (!allowedTypes.has(type)) {
    throw new UploadValidationError(`${label} must be an accepted file type.`)
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
      taxpayerIdType: normalizeText(body.taxpayerIdType),
      taxpayerId: normalizeText(body.taxpayerId),
      role: normalizeText(body.role),
      employmentType: normalizeText(body.employmentType),
      startDate: normalizeText(body.startDate),
      shifts: normalizeList(body.shifts),
      weeklyHours: normalizeText(body.weeklyHours),
      serviceAreas: normalizeText(body.serviceAreas),
      reliableTransportation: normalizeText(body.reliableTransportation),
      experience: normalizeText(body.experience),
      education: normalizeText(body.education),
      licenseState: normalizeText(body.licenseState),
      licenseNumber: normalizeText(body.licenseNumber),
      licenseExpiration: normalizeText(body.licenseExpiration),
      licenseStanding: normalizeText(body.licenseStanding),
      certifications: normalizeList(body.certifications),
      otherCertification: normalizeText(body.otherCertification),
      languages: normalizeText(body.languages),
      essentialDuties: normalizeText(body.essentialDuties),
      workAuthorized: normalizeText(body.workAuthorized),
      careExperience: normalizeList(body.careExperience),
      recentEmployer: normalizeText(body.recentEmployer),
      recentJobTitle: normalizeText(body.recentJobTitle),
      employmentDates: normalizeText(body.employmentDates),
      employmentResponsibilities: normalizeText(body.employmentResponsibilities),
      reasonForLeaving: normalizeText(body.reasonForLeaving),
      mayContactEmployer: normalizeText(body.mayContactEmployer),
      previousUah: normalizeText(body.previousUah),
      previousUahDetails: normalizeText(body.previousUahDetails),
      referenceName: normalizeText(body.referenceName),
      referenceRelationship: normalizeText(body.referenceRelationship),
      referencePhone: normalizeText(body.referencePhone),
      referenceEmail: normalizeText(body.referenceEmail),
      referralSource: normalizeText(body.referralSource),
      accuracyCertified: normalizeText(body.accuracyCertified),
      privacyPolicyAccepted: normalizeText(body.privacyPolicyAccepted),
      message: normalizeText(body.message),
    }

    if (
      !application.name ||
      !application.phone ||
      !application.email ||
      !application.city ||
      !application.state ||
      !application.taxpayerIdType ||
      !application.taxpayerId ||
      !application.role ||
      !application.employmentType ||
      !application.startDate ||
      !application.weeklyHours ||
      !application.serviceAreas ||
      !application.reliableTransportation ||
      !application.experience ||
      !application.education ||
      !application.licenseState ||
      !application.licenseNumber ||
      !application.licenseExpiration ||
      !application.licenseStanding ||
      !application.essentialDuties ||
      !application.workAuthorized ||
      !application.previousUah ||
      !application.accuracyCertified ||
      !application.privacyPolicyAccepted ||
      !application.message
    ) {
      json(res, 400, { error: 'Please complete all required fields.' })
      return
    }

    if (!isEmail(application.email)) {
      json(res, 400, { error: 'Please enter a valid email address.' })
      return
    }

    if (!isTaxpayerId(application.taxpayerId)) {
      json(res, 400, { error: 'Please enter a valid SSN or ITIN in the format 123-45-6789.' })
      return
    }

    const resume = validateUpload(body.resume, {
      allowedTypes: ALLOWED_RESUME_TYPES,
      label: 'Resume',
    })
    const identityDocument = validateUpload(body.identityDocument, {
      allowedTypes: ALLOWED_ID_TYPES,
      label: "Driver's license or state-issued ID",
    })

    if (!resume) {
      json(res, 400, { error: 'Please upload a resume.' })
      return
    }

    if (!identityDocument) {
      json(res, 400, { error: "Please upload a driver's license or state-issued ID." })
      return
    }

    if ((resume?.size || 0) + identityDocument.size > MAX_COMBINED_UPLOAD_SIZE) {
      json(res, 400, { error: 'Resume and ID files must be 3 MB or smaller in total.' })
      return
    }

    const submittedAt = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'America/Chicago',
    }).format(new Date())

    const values = {
      ...application,
      firstName: firstName(application.name),
      message: application.message,
      licenseNumber: application.licenseNumber,
      licenseExpiration: application.licenseExpiration,
      resumeName: resume?.name || 'No resume uploaded',
      identityDocumentName: identityDocument.name,
      submittedAt,
      source: 'Careers Page',
    }

    const applicationPdf = await createApplicationPdf(values, { submittedAt })
    const applicationPdfAttachment = {
      filename: attachmentName(application.name),
      content: applicationPdf.toString('base64'),
    }

    const recruiterDocuments = [
      ...(resume
        ? [
          {
            filename: resume.name,
            content: resume.content,
          },
          ]
        : []),
      {
        filename: identityDocument.name,
        content: identityDocument.content,
      },
    ]

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
        'A new candidate submitted an application through the Careers page.',
        'See the attached application PDF for the full submission details.',
      ].join('\n'),
      attachments: [applicationPdfAttachment, ...recruiterDocuments],
    })

    json(res, 200, { ok: true })
  } catch (error) {
    console.error(error)
    json(res, error instanceof UploadValidationError ? 400 : 500, {
      error: error.message || 'Unable to submit application.',
    })
  }
}
