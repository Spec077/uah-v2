import { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import './Home.css'

const heroSlides = [
  {
    src: 'https://img1.wsimg.com/isteam/stock/DEjq89Q/:/rs=w:2046,m',
    alt: 'Healthcare professional supporting a patient',
  },
  {
    src: 'https://img1.wsimg.com/isteam/stock/14293/:/rs=w:2046,m',
    alt: 'Nursing professional providing patient-centered care',
  },
  {
    src: 'https://img1.wsimg.com/isteam/stock/33909/:/rs=w:3840,m',
    alt: 'Credentialed clinician assisting a patient',
  },
  {
    src: 'https://img1.wsimg.com/isteam/stock/4811/:/rs=w:2046,m',
    alt: 'Healthcare staffing professional supporting patient care',
  },
]

const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#about', label: 'Mission' },
  { href: '/careers', label: 'Careers' },
  { href: '#service-area', label: 'Staffing' },
  { href: '#contact', label: 'Contact' },
]

const services = [
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 3v6a4 4 0 0 0 8 0V3" />
        <path d="M4 3h4" />
        <path d="M12 3h4" />
        <path d="M10 13v2a5 5 0 0 0 10 0v-3" />
        <circle cx="20" cy="9" r="2" />
      </svg>
    ),
    title: 'RN Staffing',
    description:
      'Registered Nurses with advanced clinical skills to support complex patient care in acute, post-acute, and long-term care settings.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.8 8.6a5.1 5.1 0 0 0-8.1-3.9L12 5.4l-.7-.7a5.1 5.1 0 0 0-8.1 3.9c0 4.5 8.8 10.2 8.8 10.2s8.8-5.7 8.8-10.2Z" />
        <path d="M7 12h3l1.5-3 2 6 1.5-3h2" />
      </svg>
    ),
    title: 'LPN/LVN Staffing',
    description:
      'Licensed Practical Nurses who provide dependable care, medication management, and clinical support.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21s-7-3.7-7-10V5l7-3 7 3v6c0 6.3-7 10-7 10Z" />
        <path d="M9 11h6" />
        <path d="M12 8v6" />
      </svg>
    ),
    title: 'CNA Staffing',
    description:
      "Certified Nursing Assistants who provide compassionate daily care and support for patients' well-being.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="5" width="16" height="16" rx="2" />
        <path d="M8 3v4" />
        <path d="M16 3v4" />
        <path d="M4 10h16" />
        <path d="m9 16 2 2 4-5" />
      </svg>
    ),
    title: 'Flexible Staffing Solutions',
    description:
      'From single shifts to long-term placements, we offer flexible staffing options tailored to your facility.',
  },
]

const ArrowRightIcon = () => (
  <svg className="arrow-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
)

const missionPoints = [
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21s-7-3.7-7-10V5l7-3 7 3v6c0 6.3-7 10-7 10Z" />
        <path d="M9 12h6" />
        <path d="M12 9v6" />
      </svg>
    ),
    title: 'Safe, respectful care',
    description:
      'We support healthcare teams with nurses who understand the importance of dignity, compassion, and person-centered care.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h16" />
        <path d="M7 4v6" />
        <path d="M17 4v6" />
        <rect x="4" y="5" width="16" height="16" rx="2" />
        <path d="m8 15 2 2 5-5" />
      </svg>
    ),
    title: 'Reliable staffing support',
    description:
      'Our staffing process is built around timely communication, credentialed professionals, and dependable coverage.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 11v-1a5 5 0 0 1 10 0v1" />
        <path d="M5 11h14v9H5z" />
        <path d="M9 15h6" />
      </svg>
    ),
    title: 'Continuity for providers',
    description:
      'We help facilities reduce staffing gaps so patients, families, and care teams can move forward with confidence.',
  },
]

function Home() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [loadedSlides, setLoadedSlides] = useState([])
  const [menuState, setMenuState] = useState('closed')
  const [servicesInView, setServicesInView] = useState(false)
  const servicesRef = useRef(null)
  const isMenuOpen = menuState === 'open'
  const isMenuMounted = menuState !== 'closed'

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % heroSlides.length)
    }, 4000)

    return () => window.clearInterval(timer)
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
    const servicesNode = servicesRef.current

    if (!servicesNode) {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setServicesInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )

    observer.observe(servicesNode)

    return () => observer.disconnect()
  }, [])

  const handleHeroImageLoad = (index) => {
    setLoadedSlides((currentSlides) =>
      currentSlides.includes(index) ? currentSlides : [...currentSlides, index],
    )
  }

  const openMenu = () => setMenuState('open')
  const closeMenu = () => setMenuState('closing')

  return (
    <>
      <Helmet>
        <title>United Ace Healthcare | Your Health, Our Priority</title>
        <meta
          name="description"
          content="Your Health, Our Priority."
        />
        <link rel="canonical" href="https://unitedacehealthcare.com/" />
        <meta property="og:title" content="United Ace Healthcare" />
        <meta
          property="og:description"
          content="Your Health, Our Priority."
        />
        <meta property="og:url" content="https://unitedacehealthcare.com/" />
        <meta property="og:type" content="website" />
        {/* <meta property="og:image" content="https://unitedacehealthcare.com/og-image.jpg" /> */}
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div id="top" className="home-page">
      <header className="site-header">
        <div className="site-header__inner">
          <a href="#top" className="brand-link">
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
            <a href="#top" className="brand-link" onClick={closeMenu}>
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
            <a className="button button--primary" href="#contact" onClick={closeMenu}>
              Request staffing support
            </a>
            <a className="button button--dark" href="tel:+12242844949" onClick={closeMenu}>
              +1 (224) 284-4949
            </a>
          </div>
        </div>
      )}

      <main>
        <section className="hero" aria-label="United Ace Healthcare nursing and healthcare staffing">
          <div
            className={`hero__skeleton${loadedSlides.includes(activeSlide) ? ' is-hidden' : ''}`}
            aria-hidden="true"
          />
          <div className="hero__slideshow" aria-hidden="true">
            {heroSlides.map((slide, index) => (
              <img
                key={`${slide.src}-${index}`}
                src={slide.src}
                alt=""
                className={`hero__image${activeSlide === index ? ' is-active' : ''}${
                  loadedSlides.includes(index) ? ' is-loaded' : ''
                }`}
                loading={index === 0 ? 'eager' : 'lazy'}
                onLoad={() => handleHeroImageLoad(index)}
              />
            ))}
          </div>
          <div className="hero__shade" aria-hidden="true" />
          <div className="hero__content">
            <p className="eyebrow eyebrow--light">Healthcare Staffing</p>
            <h1>Experience world-class medical care with United Ace Healthcare.</h1>
            <p>
              We supply highly skilled, credentialed nurses and healthcare professionals
              dedicated to safe, respectful, person-centered care.
            </p>
            <div className="hero__actions">
              <a className="button button--primary" href="#contact">
                Request staffing support
              </a>
              <a className="button button--ghost" href="/careers">
                Apply Now
              </a>
            </div>
          </div>
          <div className="hero__controls" aria-label="Hero slideshow controls">
            {heroSlides.map((slide, index) => (
              <button
                key={`${slide.alt}-${index}`}
                type="button"
                aria-label={`Show slide ${index + 1} of ${heroSlides.length}: ${slide.alt}`}
                aria-current={activeSlide === index}
                className={activeSlide === index ? 'is-active' : undefined}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </div>
        </section>

        <section className="contact-strip" aria-label="Contact details">
          <div className="container contact-strip__inner">
            <div>
              <strong>Carpentersville, IL</strong>
              <span>2315 Woodside Drive</span>
              <a href="tel:+12242844949">+1 (224) 284-4949</a>
              <a href="tel:+13127214561">+1 (312) 721-4561</a>
            </div>
            <div>
              <span>Mon-Fri, 9:00 AM - 5:00 PM</span>
              <a href="mailto:info@unitedacehealthcare.com">info@unitedacehealthcare.com</a>
            </div>
          </div>
        </section>

        <section id="services" className="section container">
          <div className="section-intro">
            <div>
              <p className="eyebrow">What we do</p>
              <h2>Comprehensive Nursing Staffing Solutions</h2>
            </div>
            <p>
              We provide qualified nurses and caregivers across a wide range of healthcare
              settings. Whether you need one professional or an entire care team, we are
              here to support your needs.
            </p>
          </div>

          <div className="services-grid" ref={servicesRef}>
            {services.map((service, index) => (
              <article
                className={`service-card reveal-up${servicesInView ? ' is-visible' : ''}`}
                key={service.title}
                style={{ '--reveal-delay': `${index * 110}ms` }}
              >
                <div className="service-card__number">
                  {service.icon}
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <a className="learn-more" href="#contact">
                  <span>Learn More</span>
                  <ArrowRightIcon />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="section section--accent">
          <div className="container about-grid">
            <div className="mission-heading">
              <p className="eyebrow">Mission</p>
              <h2>Empowering healthcare teams with skilled people and dependable support.</h2>
              <p>
                United Ace Healthcare exists to make qualified clinical staffing feel
                responsive, professional, and steady when care teams need support most.
              </p>
            </div>
            <div className="mission-content">
              <div className="mission-cards">
                {missionPoints.map((point, index) => (
                  <article
                    className="mission-card"
                    key={point.title}
                    style={{ '--stack-offset': `${index * 0.8}rem`, zIndex: index + 1 }}
                  >
                    <span>{point.icon}</span>
                    <div>
                      <h3>{point.title}</h3>
                      <p>{point.description}</p>
                    </div>
                  </article>
                ))}
              </div>
              <dl className="facts-grid">
                <div>
                  <dt>Clinicians</dt>
                  <dd>RNs, LPNs/LVNs, CNAs, and allied professionals</dd>
                </div>
                <div>
                  <dt>Environments</dt>
                  <dd>Acute care, post-acute, long-term care, and home health</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section id="service-area" className="section container">
          <div className="section-intro">
            <div>
              <p className="eyebrow">Get in touch</p>
              <h2>Start a conversation about your staffing needs.</h2>
            </div>
            <p>
              Whether you need immediate coverage, long-term clinical staffing, or a
              dependable partner for future placements, our team is ready to help you keep
              care delivery steady.
            </p>
          </div>

          <div id="contact" className="contact-grid">
            <form className="contact-form">
              <h3>Request staffing support</h3>
              <p>Share a few details and our staffing team will follow up within one business day.</p>
              <div className="form-grid">
                <label>
                  <span>Full name</span>
                  <input name="name" type="text" autoComplete="name" required />
                </label>
                <label>
                  <span>Phone</span>
                  <input name="phone" type="tel" autoComplete="tel" required />
                </label>
              </div>
              <label>
                <span>Email address</span>
                <input name="email" type="email" autoComplete="email" required />
              </label>
              <label>
                <span>Inquiry type</span>
                <select name="inquiry" defaultValue="General Question" required>
                  <option>General Question</option>
                  <option>RN Staffing</option>
                  <option>LPN/LVN Staffing</option>
                  <option>CNA Staffing</option>
                  <option>Allied Healthcare Staffing</option>
                  <option>Facility Partnership</option>
                  <option>Employment Opportunities</option>
                </select>
              </label>
              <label>
                <span>How can we help?</span>
                <textarea
                  name="message"
                  rows="4"
                  maxLength="1200"
                  placeholder="A brief note about your request."
                  required
                />
              </label>
              <button className="button button--dark" type="submit">
                Submit inquiry
              </button>
            </form>

            <div className="contact-side">
              <iframe
                title="Map to United Ace Healthcare, 2315 Woodside Drive, Carpentersville, IL"
                src="https://www.google.com/maps?q=2315+Woodside+Drive,+Carpentersville,+IL&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="details-card">
                <div>
                  <p>Office</p>
                  <address>
                    2315 Woodside Drive
                    <br />
                    Carpentersville, IL
                  </address>
                </div>
                <div>
                  <p>Hours</p>
                  <span>
                    Monday-Friday
                    <br />
                    9:00 AM - 5:00 PM
                  </span>
                </div>
                <div>
                  <p>Phone</p>
                  <a href="tel:+12242844949">+1 (224) 284-4949</a>
                  <a href="tel:+13127214561">+1 (312) 721-4561</a>
                </div>
                <div>
                  <p>Email</p>
                  <a href="mailto:info@unitedacehealthcare.com">info@unitedacehealthcare.com</a>
                  <a href="mailto:unitedacehc@gmail.com">unitedacehc@gmail.com</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <div className="brand-link">
            <img className="brand-logo" src="/assets/uah-logo.png" alt="" />
            <span>United Ace Healthcare</span>
          </div>
          <p>© 2026 United Ace Healthcare.</p>
          {/* <p>© 2026 United Ace Healthcare. Nursing and healthcare staffing agency.</p> */}
        </div>
      </footer>
      </div>
    </>
  )
}

export default Home
