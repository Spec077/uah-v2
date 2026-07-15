import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import SiteFooter from './components/home/SiteFooter'
import SiteHeader from './components/home/SiteHeader'
import { formatUSPhoneNumber } from './utils/formatUSPhoneNumber'
import { smoothScrollHashClick, smoothScrollToTarget } from './utils/smoothScroll'
import './Home.css'
import './Careers.css'

const navLinks = [
  { href: '/#services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/#process', label: 'Process' },
  { href: '/#contact', label: 'Contact' },
]

const ArrowRightIcon = () => (
  <svg className="arrow-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
)

const applicationSteps = [
  { eyebrow: 'Step 1 of 3', title: 'Basic Information' },
  { eyebrow: 'Step 2 of 3', title: 'Professional Information' },
  { eyebrow: 'Step 3 of 3', title: 'Resume & Agreement' },
]

const applicationSuccessAnimation =
  'https://lottie.host/582dbd92-15e4-4f9e-b32e-69c26ac28619/AHPBLzwL0i.lottie'

const DotLottieReact = lazy(() =>
  import('@lottiefiles/dotlottie-react').then((module) => ({
    default: module.DotLottieReact,
  })),
)

const expirationMonths = [
  ['01', 'Jan'],
  ['02', 'Feb'],
  ['03', 'Mar'],
  ['04', 'Apr'],
  ['05', 'May'],
  ['06', 'Jun'],
  ['07', 'Jul'],
  ['08', 'Aug'],
  ['09', 'Sep'],
  ['10', 'Oct'],
  ['11', 'Nov'],
  ['12', 'Dec'],
]

const currentYear = new Date().getFullYear()
const expirationYears = Array.from({ length: 16 }, (_, index) => String(currentYear + index))

const usStates = [
  ['AL', 'Alabama'],
  ['AK', 'Alaska'],
  ['AZ', 'Arizona'],
  ['AR', 'Arkansas'],
  ['CA', 'California'],
  ['CO', 'Colorado'],
  ['CT', 'Connecticut'],
  ['DE', 'Delaware'],
  ['DC', 'District of Columbia'],
  ['FL', 'Florida'],
  ['GA', 'Georgia'],
  ['HI', 'Hawaii'],
  ['ID', 'Idaho'],
  ['IL', 'Illinois'],
  ['IN', 'Indiana'],
  ['IA', 'Iowa'],
  ['KS', 'Kansas'],
  ['KY', 'Kentucky'],
  ['LA', 'Louisiana'],
  ['ME', 'Maine'],
  ['MD', 'Maryland'],
  ['MA', 'Massachusetts'],
  ['MI', 'Michigan'],
  ['MN', 'Minnesota'],
  ['MS', 'Mississippi'],
  ['MO', 'Missouri'],
  ['MT', 'Montana'],
  ['NE', 'Nebraska'],
  ['NV', 'Nevada'],
  ['NH', 'New Hampshire'],
  ['NJ', 'New Jersey'],
  ['NM', 'New Mexico'],
  ['NY', 'New York'],
  ['NC', 'North Carolina'],
  ['ND', 'North Dakota'],
  ['OH', 'Ohio'],
  ['OK', 'Oklahoma'],
  ['OR', 'Oregon'],
  ['PA', 'Pennsylvania'],
  ['RI', 'Rhode Island'],
  ['SC', 'South Carolina'],
  ['SD', 'South Dakota'],
  ['TN', 'Tennessee'],
  ['TX', 'Texas'],
  ['UT', 'Utah'],
  ['VT', 'Vermont'],
  ['VA', 'Virginia'],
  ['WA', 'Washington'],
  ['WV', 'West Virginia'],
  ['WI', 'Wisconsin'],
  ['WY', 'Wyoming'],
]

const showPausedSections = false
const maxResumeSize = 3 * 1024 * 1024
const allowedResumeTypes = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const result = String(reader.result)
      resolve(result.includes(',') ? result.split(',').pop() : result)
    }

    reader.onerror = () => reject(new Error('Unable to read resume file.'))
    reader.readAsDataURL(file)
  })
}

const benefits = [
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3v18" />
        <path d="M17 7.5C16.2 6.6 14.7 6 12.9 6H10.5a3 3 0 0 0 0 6h3a3 3 0 0 1 0 6H9.8c-1.4 0-2.8-.5-3.8-1.4" />
      </svg>
    ),
    title: 'Competitive pay',
    description: 'Per-visit and hourly rates that reflect your role, credentials, and experience.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="5" width="16" height="16" rx="2" />
        <path d="M8 3v4" />
        <path d="M16 3v4" />
        <path d="M4 10h16" />
        <path d="m8.5 15.5 2 2 5-5" />
      </svg>
    ),
    title: 'Flexible scheduling',
    description: 'Choose full-time, part-time, PRN, weekend, evening, or overnight availability.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21s7-5.3 7-11a7 7 0 0 0-14 0c0 5.7 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
    title: 'Local assignments',
    description: 'We keep placements practical so you spend more time supporting care and less time commuting.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 12a8 8 0 0 1 16 0" />
        <path d="M4 12v3a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2Z" />
        <path d="M20 12v3a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2Z" />
        <path d="M14 19h-2a3 3 0 0 1-3-3" />
      </svg>
    ),
    title: 'Coordinator support',
    description: 'A responsive staffing team helps with questions, scheduling, and placement details.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M3 10h18" />
        <path d="M7 15h4" />
        <path d="M16 14.5h1" />
      </svg>
    ),
    title: 'Weekly pay',
    description: 'Reliable direct deposit keeps compensation predictable from week to week.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 12v8H4v-8" />
        <path d="M2 7h20v5H2z" />
        <path d="M12 7v13" />
        <path d="M12 7H8.5A2.5 2.5 0 1 1 11 4.5L12 7Z" />
        <path d="M12 7h3.5A2.5 2.5 0 1 0 13 4.5L12 7Z" />
      </svg>
    ),
    title: 'Referral bonuses',
    description: 'Bring a great clinician with you and we will thank you both.',
  },
]

const positions = [
  {
    label: 'RN',
    title: 'Registered Nurse',
    description:
      'Support skilled nursing visits, assessments, care planning, and patient-centered clinical documentation.',
  },
  {
    label: 'LPN / LVN',
    title: 'Licensed Practical Nurse',
    description:
      'Provide medication support, follow-up care, skilled visits, and dependable clinical assistance.',
  },
  {
    label: 'CNA / HHA',
    title: 'Certified Nursing Assistant',
    description:
      'Help patients with personal care, mobility, daily routines, and dignified support at the bedside.',
  },
  {
    label: 'Allied',
    title: 'PT / OT / SLP and MSW',
    description:
      'Bring therapy, rehabilitation, and social work expertise to patients who need steady care support.',
  },
]

const requirements = [
  'Active Illinois license or certification for your role',
  'Current CPR or BLS certification',
  'Reliable transportation and a valid driver license',
  'Ability to pass background check and drug screen',
  'Compassionate, professional bedside manner',
]

const faqs = [
  {
    question: 'Do I need home health experience to apply?',
    answer:
      'No. Strong bedside, long-term care, clinic, or facility experience can translate well. We help qualified candidates understand placement expectations.',
  },
  {
    question: 'What areas do you cover?',
    answer:
      'United Ace Healthcare is based in Carpentersville and supports nearby Illinois communities and care settings.',
  },
  {
    question: 'How soon can I start?',
    answer:
      'Timelines depend on credentialing and role requirements, but we follow up quickly after receiving your application.',
  },
  // {
  //   question: 'Can I work PRN?',
  //   answer:
  //     'Yes. Full-time, part-time, and PRN availability are welcome for many roles.',
  // },
]

function Careers() {
  const [menuState, setMenuState] = useState('closed')
  const [applicationStatus, setApplicationStatus] = useState({ type: 'idle', message: '' })
  const [applicationStep, setApplicationStep] = useState(0)
  const [phoneValue, setPhoneValue] = useState('')
  const [isHeroOutOfSight, setIsHeroOutOfSight] = useState(false)
  const [licenseExpiration, setLicenseExpiration] = useState({ month: '', year: '' })
  const heroRef = useRef(null)
  const applicationFormRef = useRef(null)
  const applicationSuccessRef = useRef(null)
  const isMenuOpen = menuState === 'open'
  const isMenuMounted = menuState !== 'closed'
  const isSubmitting = applicationStatus.type === 'submitting'
  const isFirstApplicationStep = applicationStep === 0
  const isFinalApplicationStep = applicationStep === applicationSteps.length - 1

  useEffect(() => {
    document.body.classList.toggle('menu-open', isMenuMounted)

    return () => document.body.classList.remove('menu-open')
  }, [isMenuMounted])

  useEffect(() => {
    if (menuState !== 'closing') {
      return undefined
    }

    const timer = window.setTimeout(() => setMenuState('closed'), 240)

    return () => window.clearTimeout(timer)
  }, [menuState])

  useEffect(() => {
    let frame = 0

    const updateHeroVisibility = () => {
      frame = 0
      const heroBounds = heroRef.current?.getBoundingClientRect()
      setIsHeroOutOfSight(Boolean(heroBounds && heroBounds.bottom <= 0))
    }

    const handleViewportChange = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(updateHeroVisibility)
      }
    }

    updateHeroVisibility()
    window.addEventListener('scroll', handleViewportChange, { passive: true })
    window.addEventListener('resize', handleViewportChange)

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame)
      }
      window.removeEventListener('scroll', handleViewportChange)
      window.removeEventListener('resize', handleViewportChange)
    }
  }, [])

  useEffect(() => {
    if (applicationStatus.type !== 'success') {
      return
    }

    window.requestAnimationFrame(() => {
      smoothScrollToTarget(applicationSuccessRef.current, { block: 'center' })
      applicationSuccessRef.current?.focus({ preventScroll: true })
    })
  }, [applicationStatus.type])

  const openMenu = () => setMenuState('open')
  const closeMenu = () => setMenuState('closing')
  const scrollToApplication = (event) => {
    event?.preventDefault()
    closeMenu()
    window.setTimeout(() => {
      smoothScrollToTarget('apply', { updateHash: true })
    }, 40)
  }
  const handleNavLinkClick = (event, href) => {
    const didScroll = smoothScrollHashClick(event, href)

    if (didScroll && isMenuMounted) {
      closeMenu()
    }
  }
  const validateApplicationStep = (stepIndex = applicationStep) => {
    const stepNode = applicationFormRef.current?.querySelector(`[data-application-step="${stepIndex}"]`)

    if (!stepNode) {
      return true
    }

    const fields = Array.from(stepNode.querySelectorAll('input, select, textarea'))
    const invalidField = fields.find((field) => !field.checkValidity())

    if (invalidField) {
      invalidField.reportValidity()
      return false
    }

    return true
  }
  const scrollApplicationToTop = () => {
    window.requestAnimationFrame(() => {
      smoothScrollToTarget(applicationFormRef.current)
    })
  }
  const goToNextApplicationStep = () => {
    if (!validateApplicationStep()) {
      return
    }

    setApplicationStep((currentStep) => Math.min(currentStep + 1, applicationSteps.length - 1))
    scrollApplicationToTop()
  }
  const goToPreviousApplicationStep = () => {
    setApplicationStep((currentStep) => Math.max(currentStep - 1, 0))
    scrollApplicationToTop()
  }
  const handlePhoneChange = (event) => {
    setPhoneValue(formatUSPhoneNumber(event.target.value))
  }
  const handleLicenseExpirationChange = (field) => (event) => {
    setLicenseExpiration((currentExpiration) => ({
      ...currentExpiration,
      [field]: event.target.value,
    }))
  }

  const handleApplicationSubmit = async (event) => {
    event.preventDefault()

    const form = event.currentTarget

    if (!validateApplicationStep(applicationSteps.length - 1)) {
      return
    }

    const formData = new FormData(form)
    const resumeFile = formData.get('resume')

    setApplicationStatus({ type: 'submitting', message: 'Submitting your application...' })

    try {
      let resume = null

      if (resumeFile instanceof File && resumeFile.size > 0) {
        if (resumeFile.size > maxResumeSize) {
          throw new Error('Resume must be 3 MB or smaller.')
        }

        if (!allowedResumeTypes.has(resumeFile.type)) {
          throw new Error('Resume must be a PDF, DOC, or DOCX file.')
        }

        resume = {
          name: resumeFile.name,
          type: resumeFile.type,
          size: resumeFile.size,
          content: await fileToBase64(resumeFile),
        }
      }

      const payload = {
        name: String(formData.get('name') || '').trim(),
        phone: String(formData.get('phone') || '').trim(),
        email: String(formData.get('email') || '').trim(),
        city: String(formData.get('city') || '').trim(),
        state: String(formData.get('state') || '').trim(),
        role: String(formData.get('role') || '').trim(),
        employmentType: String(formData.get('employmentType') || '').trim(),
        availability: String(formData.get('availability') || '').trim(),
        experience: String(formData.get('experience') || '').trim(),
        licenseState: String(formData.get('licenseState') || '').trim(),
        licenseNumber: String(formData.get('licenseNumber') || '').trim(),
        licenseExpiration: String(formData.get('licenseExpiration') || '').trim(),
        workAuthorized: String(formData.get('workAuthorized') || '').trim(),
        accuracyCertified: formData.get('accuracyCertified') === 'on' ? 'Yes' : '',
        privacyPolicyAccepted: formData.get('privacyPolicyAccepted') === 'on' ? 'Yes' : '',
        message: String(formData.get('message') || '').trim(),
        resume,
      }

      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(result.error || 'Unable to submit application.')
      }

      form.reset()
      setPhoneValue('')
      setLicenseExpiration({ month: '', year: '' })
      setApplicationStep(0)
      setApplicationStatus({
        type: 'success',
        message: 'Application submitted. Please check your email for confirmation.',
      })
    } catch (error) {
      setApplicationStatus({
        type: 'error',
        message: error.message || 'Unable to submit application. Please try again.',
      })
    }
  }

  return (
    <>
      <Helmet>
        <title>Careers | United Ace Healthcare</title>
        <meta
          name="description"
          content="Apply for nursing, CNA, LPN, and allied healthcare roles with United Ace Healthcare."
        />
        <link rel="canonical" href="https://unitedacehealthcare.com/careers" />
        <meta property="og:title" content="Careers | United Ace Healthcare" />
        <meta
          property="og:description"
          content="Join United Ace Healthcare for flexible healthcare roles, responsive support, and trusted care placements."
        />
        <meta property="og:url" content="https://unitedacehealthcare.com/careers" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://unitedacehealthcare.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div id="top" className="home-page careers-page">
      <SiteHeader
        ArrowRightIcon={ArrowRightIcon}
        brandHref="/"
        isMenuMounted={isMenuMounted}
        isMenuOpen={isMenuOpen}
        isScrolled
        mobileCta={{ href: '#apply', label: 'Start application', onClick: scrollToApplication }}
        navLinks={navLinks}
        onCloseMenu={closeMenu}
        onNavLinkClick={handleNavLinkClick}
        onOpenMenu={openMenu}
      />

      <main>
        <section className="careers-hero" ref={heroRef}>
          <div className="container careers-hero__grid">
            <div className="careers-hero__content">
              <p className="eyebrow">Careers at United Ace Healthcare</p>
              <h1>Join our healthcare team.</h1>
              <p>
                Join our network of compassionate healthcare professionals. Our initial
                application takes approximately 3-5 minutes to complete.
              </p>
              <div className="hero__actions">
                <a className="button button--primary" href="#apply">
                  <span>Start your application</span>
                  <svg className="button-arrow-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </a>
                <a className="button careers-button--outline" href="#recruiting">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Temporarily hidden: Why work with us section. */}
        {showPausedSections && (
          <section className="section container">
            <div className="section-intro">
              <div>
                <p className="eyebrow">Why work with us</p>
                <h2>A team that treats clinicians the way we treat patients.</h2>
              </div>
              <p>
                Steady schedules, professional placements, and responsive support help you
                focus on the work you do best.
              </p>
            </div>

            <div className="careers-card-grid">
              {benefits.map((benefit) => (
                <article className="career-info-card" key={benefit.title}>
                  <span className="career-info-card__icon">{benefit.icon}</span>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="section section--accent">
          <div className="container">
            <div className="section-intro">
              <div>
                <p className="eyebrow">Open positions</p>
                <h2>Find the role that fits.</h2>
              </div>
              <p>
                Full-time, part-time, and PRN opportunities are available. Do not see
                your exact title? Apply anyway so our recruiting team can connect with you.
              </p>
            </div>

            <div className="positions-grid">
              {positions.map((position, index) => (
                <article
                  className="position-card"
                  key={position.title}
                  style={{ '--reveal-delay': `${index * 90}ms` }}
                >
                  <span>{position.label}</span>
                  <h3>{position.title}</h3>
                  <p>{position.description}</p>
                  <a className="learn-more" href="#apply">
                    <span>Apply for this role</span>
                    <svg className="arrow-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12h14" />
                      <path d="m13 6 6 6-6 6" />
                    </svg>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Temporarily hidden: Requirements section. */}
        {showPausedSections && (
          <section className="section container">
            <div className="requirements-grid">
              <div>
                <p className="eyebrow">Requirements</p>
                <h2>What we look for.</h2>
                <p>
                  We hire clinicians who bring both competence and warmth into every setting.
                  Credentials get the conversation started; professionalism and compassion
                  carry it forward.
                </p>
              </div>
              <ul>
                {requirements.map((requirement) => (
                  <li key={requirement}>{requirement}</li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section id="apply" className="section section--accent">
          <div className="container careers-form-wrap">
            <p className="eyebrow">Start Your Application</p>
            <h2>Apply to United Ace Healthcare.</h2>
            <p>
              This first step is intentionally short. If your qualifications match our
              current opportunities, our recruitment team will contact you with the remaining
              employment paperwork.
            </p>

            {applicationStatus.type === 'success' ? (
              <div
                className="application-success"
                ref={applicationSuccessRef}
                role="status"
                aria-live="polite"
                tabIndex="-1"
              >
                <div className="application-success__animation" aria-hidden="true">
                  <Suspense fallback={<div className="application-success__animation-fallback" />}>
                    <DotLottieReact src={applicationSuccessAnimation} loop autoplay />
                  </Suspense>
                </div>
                <div className="application-success__message">
                  <h3>Application submitted.</h3>
                  <p>
                    Thank you for applying. We sent a confirmation email to your inbox, and our team will review your information.
                    If your qualifications match our current opportunities, our recruitment team will contact you with the next steps.
                  </p>
                </div>
              </div>
            ) : (
              <form
                className="contact-form careers-form"
                ref={applicationFormRef}
                noValidate
                onSubmit={handleApplicationSubmit}
              >
                <ol className="application-stepper" aria-label="Application progress">
                  {applicationSteps.map((step, index) => (
                    <li
                      className={index === applicationStep ? 'is-active' : undefined}
                      aria-current={index === applicationStep ? 'step' : undefined}
                      key={step.title}
                    >
                      <span>{index + 1}</span>
                      <strong>{step.title}</strong>
                    </li>
                  ))}
                </ol>

                <fieldset disabled={isSubmitting}>
                  <div
                    className={`careers-form__group application-step-panel${applicationStep === 0 ? ' is-active' : ''}`}
                    data-application-step="0"
                  >
                    <h3>Basic Information</h3>
                    <div className="form-grid">
                      <label>
                        <span>Full name</span>
                        <input name="name" type="text" autoComplete="name" placeholder="Jane Smith" required />
                      </label>
                      <label>
                        <span>Phone number</span>
                        <input
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          inputMode="tel"
                          placeholder="(224) 284-4949"
                          value={phoneValue}
                          onChange={handlePhoneChange}
                          required
                        />
                      </label>
                      <label>
                        <span>Email address</span>
                        <input
                          name="email"
                          type="email"
                          autoComplete="email"
                          inputMode="email"
                          placeholder="jane@example.com"
                          required
                        />
                      </label>
                      <label>
                        <span>City</span>
                        <input name="city" type="text" autoComplete="address-level2" placeholder="Carpentersville" required />
                      </label>
                      <label>
                        <span>State</span>
                        <select name="state" autoComplete="address-level1" defaultValue="IL" required>
                          {usStates.map(([value, label]) => (
                            <option value={value} key={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>

                  <div
                    className={`careers-form__group application-step-panel${applicationStep === 1 ? ' is-active' : ''}`}
                    data-application-step="1"
                  >
                    <h3>Professional Information</h3>
                    <div className="form-grid">
                      <label>
                        <span>Role applying for</span>
                        <select name="role" defaultValue="RN" required>
                          <option>RN</option>
                          <option>LPN</option>
                          <option>CNA</option>
                          <option>Caregiver</option>
                          <option>Other</option>
                        </select>
                      </label>
                      <label>
                        <span>Employment type</span>
                        <select name="employmentType" defaultValue="Full-time" required>
                          <option>Full-time</option>
                          <option>Part-time</option>
                          <option>PRN / Per Diem</option>
                        </select>
                      </label>
                      <label>
                        <span>Availability</span>
                        <select name="availability" defaultValue="" required>
                          <option value="" disabled>
                            Select availability
                          </option>
                          <option>Immediate start</option>
                          <option>Weekdays</option>
                          <option>Weekends</option>
                          <option>Evenings</option>
                          <option>Nights</option>
                          <option>Flexible</option>
                        </select>
                      </label>
                      <label>
                        <span>Years of experience</span>
                        <select name="experience" defaultValue="Less than 1" required>
                          <option>Less than 1</option>
                          <option>1-3</option>
                          <option>3-5</option>
                          <option>5-10</option>
                          <option>10+</option>
                        </select>
                      </label>
                      <label>
                        <span>Current license state</span>
                        <select name="licenseState" defaultValue="IL" required>
                          {usStates.map(([value, label]) => (
                            <option value={value} key={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        <span>License number</span>
                        <input name="licenseNumber" type="text" placeholder="Optional for some roles" />
                      </label>
                      <label>
                        <span>License expiration</span>
                        <div className="license-expiration-field">
                          <select
                            aria-label="License expiration month"
                            value={licenseExpiration.month}
                            onChange={handleLicenseExpirationChange('month')}
                          >
                            <option value="">Month</option>
                            {expirationMonths.map(([value, label]) => (
                              <option value={value} key={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                          <select
                            aria-label="License expiration year"
                            value={licenseExpiration.year}
                            onChange={handleLicenseExpirationChange('year')}
                          >
                            <option value="">Year</option>
                            {expirationYears.map((year) => (
                              <option value={year} key={year}>
                                {year}
                              </option>
                            ))}
                          </select>
                          <input
                            name="licenseExpiration"
                            type="hidden"
                            value={
                              licenseExpiration.month && licenseExpiration.year
                                ? `${licenseExpiration.year}-${licenseExpiration.month}`
                                : ''
                            }
                          />
                        </div>
                      </label>
                      <fieldset className="inline-fieldset inline-fieldset--compact">
                        <legend>Authorized to work in the US?</legend>
                        <label className="radio-option">
                          <input name="workAuthorized" type="radio" value="Yes" required />
                          <span>Yes</span>
                        </label>
                        <label className="radio-option">
                          <input name="workAuthorized" type="radio" value="No" />
                          <span>No</span>
                        </label>
                      </fieldset>
                    </div>
                  </div>

                  <div
                    className={`careers-form__group application-step-panel${applicationStep === 2 ? ' is-active' : ''}`}
                    data-application-step="2"
                  >
                    <h3>Resume & Agreement</h3>
                    <div className="form-grid">
                      <label className="resume-upload">
                        <span>Upload resume (optional PDF, DOC, DOCX)</span>
                        <input name="resume" type="file" accept=".pdf,.doc,.docx" />
                      </label>
                      <label>
                        <span>Additional notes</span>
                        <textarea
                          name="message"
                          rows="4"
                          maxLength="1500"
                          placeholder="Certifications, referrals, preferred shifts, or anything else helpful."
                        />
                      </label>
                      <label className="agreement-check">
                        <input name="accuracyCertified" type="checkbox" required />
                        <span>I certify that the information submitted is accurate to the best of my knowledge.</span>
                      </label>
                      <label className="agreement-check">
                        <input name="privacyPolicyAccepted" type="checkbox" required />
                        <span>
                          I have read and accept the privacy policy and agree that United Ace Healthcare may use my
                          information to review and respond to my application.
                        </span>
                      </label>
                    </div>
                  </div>
                </fieldset>

                {applicationStatus.message && (
                  <p className={`form-status form-status--${applicationStatus.type}`} aria-live="polite">
                    {applicationStatus.message}
                  </p>
                )}

                <div className="application-step-actions">
                  <button
                    className="button application-back-button"
                    type="button"
                    disabled={isFirstApplicationStep || isSubmitting}
                    onClick={goToPreviousApplicationStep}
                  >
                    <ArrowRightIcon />
                    <span>Back</span>
                  </button>
                  {isFinalApplicationStep ? (
                    <button
                      className={`button button--primary form-submit${isSubmitting ? ' is-processing' : ''}`}
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && <span className="button-spinner" aria-hidden="true" />}
                      <span>{isSubmitting ? 'Processing application' : 'Submit application'}</span>
                    </button>
                  ) : (
                    <button className="button button--primary" type="button" onClick={goToNextApplicationStep}>
                      <span>Continue</span>
                      <ArrowRightIcon />
                    </button>
                  )}
                </div>
                <p className="application-reassurance">
                  By completing and submitting this application, you agree that United Ace Healthcare may use the
                  information provided to review your qualifications and contact you about employment opportunities.
                </p>
              </form>
            )}
          </div>
        </section>

        <section className="section container faq-section">
          <p className="eyebrow">FAQ</p>
          <h2>Candidate questions we hear the most.</h2>
          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>
                  <span>{faq.question}</span>
                  <strong aria-hidden="true">
                    <svg className="faq-arrow-icon" viewBox="0 0 24 24">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </strong>
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="recruiting" className="recruiting-section">
          <div className="container recruiting-grid">
            <div>
              <p className="eyebrow eyebrow--light">Recruiting</p>
              <h2>Prefer to talk to a person first?</h2>
              <p>
                Call or email us directly. We answer the phone Monday
                through Friday, 9:00 AM - 5:00 PM.
              </p>
            </div>
            <div className="recruiting-details">
              <div>
                <p>Phone</p>
                <a href="tel:+12242844949">+1 (224) 284-4949</a>
                <a href="tel:+13127214561">+1 (312) 721-4561</a>
              </div>
              <div>
                <p>Email</p>
                <a href="mailto:info@unitedacehealthcare.com">info@unitedacehealthcare.com</a>
              </div>
              <div>
                <p>Office</p>
                <span>2315 Woodside Drive, Carpentersville, IL</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      </div>
    </>
  )
}

export default Careers
