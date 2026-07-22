import { readFileSync } from 'node:fs'
import PDFDocument from 'pdfkit'

const ink = '#18121f'
const muted = '#6f6878'
const border = '#e8e2ec'

const logoPath = new URL('../public/assets/uah-logo.png', import.meta.url)

function display(value, fallback = 'Not provided') {
  return value ? String(value) : fallback
}

function drawSectionTitle(doc, title, y) {
  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .fillColor(ink)
    .text(title.toUpperCase(), 54, y, { characterSpacing: 1 })

  doc
    .moveTo(54, y + 17)
    .lineTo(558, y + 17)
    .strokeColor(border)
    .lineWidth(1)
    .stroke()
}

function ensureSpace(doc, y, neededHeight) {
  if (y + neededHeight <= 724) {
    return y
  }

  doc.addPage()
  return 54
}

function drawField(doc, label, value, x, y, width, height = 38) {
  doc
    .fillColor(muted)
    .font('Helvetica-Bold')
    .fontSize(7.2)
    .text(label.toUpperCase(), x, y, {
      width,
      characterSpacing: .7,
    })
    .fillColor(ink)
    .font('Helvetica')
    .fontSize(10)
    .text(display(value), x, y + 14, {
      width,
      height: height - 20,
      ellipsis: true,
    })

  doc
    .moveTo(x, y + height)
    .lineTo(x + width, y + height)
    .strokeColor(border)
    .lineWidth(.7)
    .stroke()
}

function drawWideField(doc, label, value, x, y, width, height) {
  doc
    .fillColor(muted)
    .font('Helvetica-Bold')
    .fontSize(7.2)
    .text(label.toUpperCase(), x, y, {
      width,
      characterSpacing: .7,
    })
    .fillColor(ink)
    .font('Helvetica')
    .fontSize(9.8)
    .text(display(value), x, y + 15, {
      width,
      height: height - 23,
      lineGap: 2,
    })

  doc
    .moveTo(x, y + height)
    .lineTo(x + width, y + height)
    .strokeColor(border)
    .lineWidth(.7)
    .stroke()
}

function collectPdf(doc) {
  return new Promise((resolve, reject) => {
    const chunks = []

    doc.on('data', (chunk) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)
  })
}

function noteHeight(doc, note, width) {
  doc.font('Helvetica').fontSize(9.8)
  const textHeight = doc.heightOfString(display(note, 'No additional notes provided.'), {
    width,
    lineGap: 2,
  })

  return Math.min(Math.max(textHeight + 28, 48), 140)
}

export async function createApplicationPdf(application, options = {}) {
  const doc = new PDFDocument({
    size: 'LETTER',
    margin: 54,
    info: {
      Title: `United Ace Healthcare Application - ${display(application.name, 'Applicant')}`,
      Author: 'United Ace Healthcare',
      Subject: 'Career application summary',
    },
  })
  const pdf = collectPdf(doc)
  const logo = readFileSync(logoPath)
  const submittedAt = options.submittedAt || application.submittedAt || 'Not provided'

  doc.image(logo, (doc.page.width - 56) / 2, 32, { width: 56 })

  doc
    .moveDown(3.25)
    .font('Helvetica-Bold')
    .fontSize(17)
    .fillColor(ink)
    .text('Career Application Summary', { align: 'center' })
    .moveDown(.3)
    .font('Helvetica')
    .fontSize(9)
    .fillColor(muted)
    .text('United Ace Healthcare', { align: 'center' })
    .moveDown(.25)
    .text(`Submitted: ${submittedAt}`, { align: 'center' })

  doc
    .moveTo(54, 148)
    .lineTo(558, 148)
    .strokeColor(border)
    .lineWidth(1)
    .stroke()

  drawSectionTitle(doc, 'Applicant Information', 168)

  const left = 54
  const gap = 28
  const col = (504 - gap) / 2
  const rowGap = 11
  const fieldHeight = 38
  let y = 194

  drawField(doc, 'Full name', application.name, left, y, col)
  drawField(doc, 'Phone number', application.phone, left + col + gap, y, col)
  y += fieldHeight + rowGap
  drawField(doc, 'Email address', application.email, left, y, col)
  drawField(doc, 'Location', `${display(application.city)}, ${display(application.state)}`, left + col + gap, y, col)

  y += fieldHeight + 24
  drawSectionTitle(doc, 'Professional Details', y)
  y += 26
  drawField(doc, 'Role applying for', application.role, left, y, col)
  drawField(doc, 'Employment type', application.employmentType, left + col + gap, y, col)
  y += fieldHeight + rowGap
  drawField(doc, 'Available start date', application.startDate, left, y, col)
  drawField(doc, 'Hours available per week', application.weeklyHours, left + col + gap, y, col)
  y += fieldHeight + rowGap
  drawField(doc, 'Available shifts', application.shifts, left, y, col)
  drawField(doc, 'Service areas', application.serviceAreas, left + col + gap, y, col)
  y += fieldHeight + rowGap
  drawField(doc, 'Years of experience', application.experience, left, y, col)
  drawField(doc, 'Education / credential', application.education, left + col + gap, y, col)

  y += fieldHeight + 24
  y = ensureSpace(doc, y, 250)
  drawSectionTitle(doc, 'Credentials & Eligibility', y)
  y += 26
  drawField(doc, 'Current license state', application.licenseState, left, y, col)
  drawField(doc, 'License number', application.licenseNumber, left + col + gap, y, col)
  y += fieldHeight + rowGap
  drawField(doc, 'License expiration', application.licenseExpiration, left, y, col)
  drawField(doc, 'License in good standing', application.licenseStanding, left + col + gap, y, col)
  y += fieldHeight + rowGap
  drawField(doc, 'Certifications', application.certifications, left, y, col)
  drawField(doc, 'Other certification', application.otherCertification, left + col + gap, y, col)
  y += fieldHeight + rowGap
  drawField(doc, 'Languages', application.languages, left, y, col)
  drawField(doc, 'Reliable transportation', application.reliableTransportation, left + col + gap, y, col)
  y += fieldHeight + rowGap
  drawField(doc, 'Authorized to work in the US', application.workAuthorized, left, y, col)
  drawField(doc, 'Can perform essential duties', application.essentialDuties, left + col + gap, y, col)

  y += fieldHeight + 24
  y = ensureSpace(doc, y, 300)
  drawSectionTitle(doc, 'Experience & Employment', y)
  y += 26
  const careHeight = noteHeight(doc, application.careExperience, 504)
  drawWideField(doc, 'Types of care experience', application.careExperience, left, y, 504, careHeight)
  y += careHeight + rowGap
  drawField(doc, 'Most recent employer', application.recentEmployer, left, y, col)
  drawField(doc, 'Job title', application.recentJobTitle, left + col + gap, y, col)
  y += fieldHeight + rowGap
  drawField(doc, 'Employment dates', application.employmentDates, left, y, col)
  drawField(doc, 'Reason for leaving', application.reasonForLeaving, left + col + gap, y, col)
  y += fieldHeight + rowGap
  const responsibilitiesHeight = noteHeight(doc, application.employmentResponsibilities, 504)
  y = ensureSpace(doc, y, responsibilitiesHeight + 60)
  drawWideField(doc, 'Primary responsibilities', application.employmentResponsibilities, left, y, 504, responsibilitiesHeight)
  y += responsibilitiesHeight + rowGap
  drawField(doc, 'May contact employer', application.mayContactEmployer, left, y, col)
  drawField(doc, 'Previously applied / worked here', application.previousUah, left + col + gap, y, col)
  y += fieldHeight + rowGap
  drawWideField(doc, 'Previous UAH details', application.previousUahDetails, left, y, 504, 48)
  y += 48 + 24

  y = ensureSpace(doc, y, 180)
  drawSectionTitle(doc, 'Reference & Source', y)
  y += 26
  drawField(doc, 'Professional reference', application.referenceName, left, y, col)
  drawField(doc, 'Relationship', application.referenceRelationship, left + col + gap, y, col)
  y += fieldHeight + rowGap
  drawField(doc, 'Reference phone', application.referencePhone, left, y, col)
  drawField(doc, 'Reference email', application.referenceEmail, left + col + gap, y, col)
  y += fieldHeight + rowGap
  drawField(doc, 'How applicant heard about us', application.referralSource, left, y, col)

  y += fieldHeight + 24
  y = ensureSpace(doc, y, 150)
  drawSectionTitle(doc, 'Notes & Agreement', y)
  y += 26
  const notes = application.message || 'No additional notes provided.'
  const notesHeight = noteHeight(doc, notes, 504)
  y = ensureSpace(doc, y, notesHeight + fieldHeight + 20)
  drawWideField(doc, 'Additional notes', notes, left, y, 504, notesHeight)
  y += notesHeight + rowGap
  drawField(doc, 'Accuracy certified', application.accuracyCertified, left, y, col)
  drawField(doc, 'Privacy policy accepted', application.privacyPolicyAccepted, left + col + gap, y, col)
  y += fieldHeight + rowGap
  drawField(doc, 'Resume', application.resumeName || 'No resume uploaded', left, y, col)

  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor(muted)
    .text(
      'This document was automatically generated from the United Ace Healthcare Careers application form.',
      54,
      Math.max(y + fieldHeight + 28, 724),
      { width: 504, align: 'center' },
    )

  doc.end()
  return pdf
}
