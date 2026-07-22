import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { createApplicationPdf } from '../api/application-pdf.js'

const outputPath = resolve('tmp/sample-application.pdf')

const sampleApplication = {
  name: 'Jane Smith',
  phone: '(224) 284-4949',
  email: 'jane.smith@example.com',
  city: 'Carpentersville',
  state: 'IL',
  role: 'RN',
  employmentType: 'Full-time',
  startDate: '2026-08-01',
  shifts: 'Days, Weekdays, Weekends',
  weeklyHours: '31-40',
  serviceAreas: 'Kane and northwest Cook counties',
  reliableTransportation: 'Yes',
  experience: '3-5',
  education: 'BSN',
  licenseState: 'IL',
  licenseNumber: 'RN-123456',
  licenseExpiration: '2028-06',
  licenseStanding: 'Yes',
  certifications: 'CPR / BLS, ACLS',
  otherCertification: 'None',
  languages: 'English — fluent; Spanish — conversational',
  essentialDuties: 'Yes',
  workAuthorized: 'Yes',
  careExperience: 'Home health, Geriatric care, Medication administration, Wound care',
  recentEmployer: 'Sample Community Health',
  recentJobTitle: 'Registered Nurse',
  employmentDates: 'January 2023 – June 2026',
  employmentResponsibilities: 'Provided skilled nursing visits, medication education, wound care, and care coordination.',
  reasonForLeaving: 'Seeking home health opportunities closer to home',
  mayContactEmployer: 'Yes',
  previousUah: 'No',
  previousUahDetails: '',
  referenceName: 'Alex Johnson',
  referenceRelationship: 'Former supervisor',
  referencePhone: '(224) 555-0100',
  referenceEmail: 'alex.johnson@example.com',
  referralSource: 'Web search',
  accuracyCertified: 'Yes',
  privacyPolicyAccepted: 'Yes',
  message:
    'BLS certified. Available for weekday day shifts and occasional weekends. Interested in home health and skilled nursing assignments.',
  resumeName: 'No resume uploaded',
  submittedAt: 'Jul 15, 2026, 10:30 AM',
}

const pdf = await createApplicationPdf(sampleApplication, {
  submittedAt: sampleApplication.submittedAt,
})

mkdirSync(dirname(outputPath), { recursive: true })
writeFileSync(outputPath, pdf)

console.log(`Sample application PDF created: ${outputPath}`)
