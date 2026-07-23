import { readFileSync } from 'node:fs'
import { createApplicationPdf } from './application-pdf.js'

const RESEND_API_URL = 'https://api.resend.com/emails'
const FROM_EMAIL = 'UAH Careers <careers@unitedacehealthcare.com>'
const RECRUITER_EMAIL = 'info@unitedacehealthcare.com'
// const RECRUITER_EMAIL = 'boluwatifeobasa830@gmail.com'
const MAX_RESUME_SIZE = 3 * 1024 * 1024
const MAX_ID_SIZE = 3 * 1024 * 1024
const MAX_COMBINED_UPLOAD_SIZE = 3 * 1024 * 1024
const ALLOWED_RESUME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])
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
    throw new UploadValidationError('Resume upload is invalid.')
  }

  if (size > MAX_RESUME_SIZE) {
    throw new UploadValidationError('Resume must be 3 MB or smaller.')
  }

  if (!ALLOWED_RESUME_TYPES.has(type)) {
    throw new UploadValidationError('Resume must be a PDF, DOC, or DOCX file.')
  }

  return { name, type, content, size }
}

function validateIdentityDocument(document) {
  if (!document) {
    throw new UploadValidationError("Please upload a driver's license or state-issued ID.")
  }

  const name = normalizeText(document.name)
  const type = normalizeText(document.type)
  const content = normalizeText(document.content)
  const size = Number(document.size)

  if (!name || !content || !Number.isFinite(size) || size <= 0) {
    throw new UploadValidationError("Driver's license or state-issued ID upload is invalid.")
  }

  if (size > MAX_ID_SIZE) {
    throw new UploadValidationError("Driver's license or state-issued ID must be 3 MB or smaller.")
  }

  if (!ALLOWED_ID_TYPES.has(type)) {
    throw new UploadValidationError("Driver's license or state-issued ID must be a PDF, JPG, PNG, HEIC, or HEIF file.")
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
      !application.role ||
      !application.employmentType ||
      !application.startDate ||
      !application.weeklyHours ||
      !application.serviceAreas ||
      !application.reliableTransportation ||
      !application.experience ||
      !application.education ||
      !application.licenseState ||
      !application.licenseStanding ||
      !application.essentialDuties ||
      !application.workAuthorized ||
      !application.previousUah ||
      !application.accuracyCertified ||
      !application.privacyPolicyAccepted
    ) {
      json(res, 400, { error: 'Please complete all required fields.' })
      return
    }

    if (!isEmail(application.email)) {
      json(res, 400, { error: 'Please enter a valid email address.' })
      return
    }

    const resume = validateResume(body.resume)
    const identityDocument = validateIdentityDocument(body.identityDocument)

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
      message: application.message || 'No additional notes provided.',
      licenseNumber: application.licenseNumber || 'Not provided',
      licenseExpiration: application.licenseExpiration || 'Not provided',
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
