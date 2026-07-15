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
  availability: 'Weekdays',
  experience: '3-5',
  licenseState: 'IL',
  licenseNumber: 'RN-123456',
  licenseExpiration: '2028-06',
  workAuthorized: 'Yes',
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
