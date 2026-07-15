import { readFileSync } from 'node:fs'
import PDFDocument from 'pdfkit'

const brand = '#bd23cd'
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
  drawField(doc, 'Availability', application.availability, left, y, col)
  drawField(doc, 'Years of experience', application.experience, left + col + gap, y, col)
  y += fieldHeight + rowGap
  drawField(doc, 'Current license state', application.licenseState, left, y, col)
  drawField(doc, 'License number', application.licenseNumber, left + col + gap, y, col)
  y += fieldHeight + rowGap
  drawField(doc, 'License expiration', application.licenseExpiration, left, y, col)
  drawField(doc, 'Authorized to work in the US', application.workAuthorized, left + col + gap, y, col)

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
  drawField(doc, 'Resume', application.resumeName || 'No resume uploaded', left + col + gap, y, col)

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
