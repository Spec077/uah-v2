import { useEffect, useState } from 'react'
import './Home.css'
import './Careers.css'
import { setPageMeta } from './seo.js'

const navLinks = [
  { href: '/#services', label: 'Services' },
  { href: '/#about', label: 'Mission' },
  { href: '/careers', label: 'Careers' },
  { href: '/#contact', label: 'Contact' },
]

const showPausedSections = false

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
  {
    question: 'Can I work PRN?',
    answer:
      'Yes. Full-time, part-time, and PRN availability are welcome for many roles.',
  },
]

function Careers() {
  const [menuState, setMenuState] = useState('closed')
  const isMenuOpen = menuState === 'open'
  const isMenuMounted = menuState !== 'closed'

  useEffect(() => {
    setPageMeta({
      title: 'Careers | United Ace Healthcare',
      description:
        'Apply for nursing, CNA, LPN, and allied healthcare roles with United Ace Healthcare.',
      ogDescription:
        'Join United Ace Healthcare for flexible healthcare roles, responsive support, and trusted care placements.',
    })
  }, [])

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
    const revealNodes = document.querySelectorAll('.careers-page .reveal-on-scroll')

    if (!revealNodes.length) {
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.16 },
    )

    revealNodes.forEach((node) => observer.observe(node))

    return () => observer.disconnect()
  }, [])

  const openMenu = () => setMenuState('open')
  const closeMenu = () => setMenuState('closing')

  return (
    <div id="top" className="home-page careers-page">
      <header className="site-header">
        <div className="site-header__inner">
          <a href="/" className="brand-link">
            <img className="brand-logo" src="/assets/uah-logo.png" alt="United Ace Healthcare" />
            <span>United Ace Healthcare</span>
          </a>

          <nav className="site-nav" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
            <a className="button button--primary button--small" href="tel:+12242844949">
              +1 (224) 284-4949
            </a>
          </nav>

          <button
            className="menu-toggle"
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={openMenu}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {isMenuMounted && (
        <div id="mobile-menu" className={`mobile-menu${isMenuOpen ? ' is-open' : ''}`}>
          <div className="mobile-menu__bar">
            <a href="/" className="brand-link" onClick={closeMenu}>
              <img className="brand-logo" src="/assets/uah-logo.png" alt="United Ace Healthcare" />
              <span>United Ace Healthcare</span>
            </a>
            <button className="menu-close" type="button" aria-label="Close navigation menu" onClick={closeMenu}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m6 6 12 12" />
                <path d="m18 6-12 12" />
              </svg>
            </button>
          </div>

          <nav className="mobile-menu__nav" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <a href={link.href} key={link.href} onClick={closeMenu}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mobile-menu__actions">
            <a className="button button--primary" href="#apply" onClick={closeMenu}>
              Apply now
            </a>
            <a className="button button--dark" href="tel:+12242844949" onClick={closeMenu}>
              +1 (224) 284-4949
            </a>
          </div>
        </div>
      )}

      <main>
        <section className="careers-hero">
          <div className="container careers-hero__grid">
            <div className="careers-hero__content reveal-on-scroll">
              <p className="eyebrow">Careers at United Ace Healthcare</p>
              <h1>Bring your care to the patients who need it most.</h1>
              <p>
                We staff nurses, CNAs, LPNs, and allied professionals with flexible
                schedules, real coordinator support, and placements in trusted care settings.
              </p>
              <div className="hero__actions">
                <a className="button button--primary" href="#apply">
                  <span>Apply now</span>
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
          <section className="section container reveal-on-scroll">
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

        <section className="section section--accent reveal-on-scroll">
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
          <section className="section container reveal-on-scroll">
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

        <section id="apply" className="section section--accent reveal-on-scroll">
          <div className="container careers-form-wrap">
            <p className="eyebrow">Apply</p>
            <h2>Start your application.</h2>
            <p>We will follow up after reviewing your information.🫶</p>

            <form className="contact-form careers-form">
              <div className="form-grid">
                <label>
                  <span>Full name</span>
                  <input name="name" type="text" autoComplete="name" required />
                </label>
                <label>
                  <span>Phone</span>
                  <input name="phone" type="tel" autoComplete="tel" required />
                </label>
                <label>
                  <span>Email address</span>
                  <input name="email" type="email" autoComplete="email" required />
                </label>
                <label>
                  <span>Role interested in</span>
                  <select name="role" defaultValue="RN" required>
                    <option>RN</option>
                    <option>LPN / LVN</option>
                    <option>CNA / HHA</option>
                    <option>PT / OT / SLP</option>
                    <option>Medical Social Worker</option>
                    <option>Office / Admin</option>
                  </select>
                </label>
                <label>
                  <span>Availability</span>
                  <select name="availability" defaultValue="Full-time" required>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>PRN / As needed</option>
                    <option>Weekends</option>
                    <option>Evenings / Overnights</option>
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
              </div>

              <label className="resume-upload">
                <span>Resume upload (PDF, DOC, DOCX)</span>
                <input name="resume" type="file" accept=".pdf,.doc,.docx" />
              </label>

              <label>
                <span>Additional notes</span>
                <textarea
                  name="message"
                  rows="4"
                  maxLength="1500"
                  placeholder="Certifications, referrals, preferred shifts, etc."
                />
              </label>

              <button className="button button--dark" type="submit">
                Submit application
              </button>
            </form>
          </div>
        </section>

        <section className="section container faq-section reveal-on-scroll">
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

        <section id="recruiting" className="recruiting-section reveal-on-scroll">
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

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <a href="/" className="brand-link">
            <img className="brand-logo" src="/assets/uah-logo.png" alt="" />
            <span>United Ace Healthcare</span>
          </a>
          <nav className="footer-nav" aria-label="Footer navigation">
            {navLinks.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <p>© 2026 United Ace Healthcare.</p>
        </div>
      </footer>
    </div>
  )
}

export default Careers
