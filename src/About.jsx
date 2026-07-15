import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import SiteFooter from './components/home/SiteFooter'
import SiteHeader from './components/home/SiteHeader'
import './Home.css'
import './About.css'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/#services', label: 'Services' },
  { href: '/#contact', label: 'Contact' },
]

const whoWeServe = [
  { label: 'Hospitals', icon: 'hospital' },
  { label: 'Skilled Nursing Facilities', icon: 'bed' },
  { label: 'Rehabilitation Centers', icon: 'activity' },
  { label: 'Assisted Living Communities', icon: 'homeHeart' },
  { label: 'Long-Term Care Facilities', icon: 'shield' },
  { label: 'Outpatient Clinics', icon: 'clipboard' },
  { label: 'Home Healthcare Providers', icon: 'homeCare' },
]

const values = [
  {
    title: 'Clinical Excellence',
    description: 'Professionals with strong clinical knowledge, readiness, and hands-on care experience.',
  },
  {
    title: 'Compassionate Care',
    description: 'Every caregiver is selected for technical capability and genuine bedside compassion.',
  },
  {
    title: 'Quality Standards',
    description: 'Credentialing and screening processes help every placement meet care-setting expectations.',
  },
  {
    title: 'Trusted Partnerships',
    description: 'We build long-term facility relationships through consistency, responsiveness, and service.',
  },
]

const SparkIcon = () => (
  <svg viewBox="-16 -16 32 32" aria-hidden="true">
    <path d="M0 -16C2.2-4.8 4.8-2.2 16 0C4.8 2.2 2.2 4.8 0 16C-2.2 4.8-4.8 2.2-16 0C-4.8-2.2-2.2-4.8 0-16Z" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg className="arrow-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
)

const serveIconPaths = {
  hospital: (
    <>
      <path d="M4.5 20.5V5.5A2 2 0 0 1 6.5 3.5h11a2 2 0 0 1 2 2v15" />
      <path d="M2.5 20.5h19" />
      <path d="M9 20.5v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4" />
      <path d="M12 7.5v5" />
      <path d="M9.5 10h5" />
    </>
  ),
  bed: (
    <>
      <path d="M4 7.5v13" />
      <path d="M20 12.5v8" />
      <path d="M4 13h16a2 2 0 0 1 2 2v5.5" />
      <path d="M4 11.5h6.5a2 2 0 0 1 2 2v.5" />
      <path d="M6.5 9.5h3" />
    </>
  ),
  activity: (
    <>
      <path d="M20.5 12h-3.2l-2 5.5-5.1-11-2.1 5.5H3.5" />
      <path d="M12 21a8.8 8.8 0 0 1-6.7-3" />
      <path d="M5.3 6A8.8 8.8 0 0 1 12 3a8.9 8.9 0 0 1 7.1 3.6" />
    </>
  ),
  homeHeart: (
    <>
      <path d="M3.5 11.5 12 4l8.5 7.5" />
      <path d="M5.5 10.5v9h13v-9" />
      <path d="M12 16.8s-3-1.7-3-3.8a1.8 1.8 0 0 1 3-1.3 1.8 1.8 0 0 1 3 1.3c0 2.1-3 3.8-3 3.8Z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 21s7-3.4 7-9.5V5.7L12 3 5 5.7v5.8C5 17.6 12 21 12 21Z" />
      <path d="M9.4 12.2 11.1 14l3.8-4" />
    </>
  ),
  clipboard: (
    <>
      <path d="M9 4.5h6" />
      <path d="M9.5 3.5h5a1.5 1.5 0 0 1 0 3h-5a1.5 1.5 0 0 1 0-3Z" />
      <path d="M7 5.5H5.8A1.8 1.8 0 0 0 4 7.3v11.4a1.8 1.8 0 0 0 1.8 1.8h12.4a1.8 1.8 0 0 0 1.8-1.8V7.3a1.8 1.8 0 0 0-1.8-1.8H17" />
      <path d="M12 10v5" />
      <path d="M9.5 12.5h5" />
    </>
  ),
  homeCare: (
    <>
      <path d="M3.5 11.5 12 4l8.5 7.5" />
      <path d="M5.5 10.5v9h13v-9" />
      <path d="M12 13v4" />
      <path d="M10 15h4" />
    </>
  ),
}

const ServeIcon = ({ type }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    {serveIconPaths[type]}
  </svg>
)

function About() {
  const [menuState, setMenuState] = useState('closed')
  const [isScrolled, setIsScrolled] = useState(false)
  const isMenuOpen = menuState === 'open'
  const isMenuMounted = menuState !== 'closed'

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
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

  const closeMenu = () => setMenuState('closing')

  return (
    <>
      <Helmet>
        <title>About Us | United Ace Healthcare</title>
        <meta
          name="description"
          content="United Ace Healthcare is a premier nursing and healthcare staffing agency serving healthcare providers across Illinois with trusted, credentialed professionals."
        />
        <link rel="canonical" href="https://unitedacehealthcare.com/about" />
        <meta property="og:title" content="About Us | United Ace Healthcare" />
        <meta
          property="og:description"
          content="Learn about United Ace Healthcare, our care standards, and the values behind every staffing placement."
        />
        <meta property="og:url" content="https://unitedacehealthcare.com/about" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div id="top" className="about-page">
        <SiteHeader
          ArrowRightIcon={ArrowRightIcon}
          brandHref="/"
          isMenuMounted={isMenuMounted}
          isMenuOpen={isMenuOpen}
          isScrolled={isScrolled}
          mobileCta={{ href: '/#contact', label: 'Get started' }}
          navLinks={navLinks}
          onCloseMenu={closeMenu}
          onOpenMenu={() => setMenuState('open')}
        />

        <main>
          <section className="about-hero">
            <img className="about-hero__image" src="/assets/home-healthcare-hero.png" alt="" />
            <span className="about-hero__plus about-hero__plus--one" aria-hidden="true" />
            <span className="about-hero__plus about-hero__plus--two" aria-hidden="true" />
            <div className="container about-hero__content">
              <h1>About United Ace Healthcare.</h1>
              <p>
                Founded on the belief that every patient deserves safe, compassionate, and
                competent care.
              </p>
            </div>
          </section>

          <section className="about-story">
            <div className="container about-story__grid">
              <div className="about-story__media">
                <img src="/assets/nursemaam.webp" alt="Healthcare professional consulting with a patient" />
              </div>
              <div className="about-copy">
                <p className="about-kicker">(who we are)</p>
                <h2>
                  A premier nursing and <em>healthcare staffing agency</em>
                </h2>
                <p>
                  United Ace Healthcare is committed to elevating care delivery through trusted
                  professionals, practical quality standards, and deep respect for clinical
                  environments.
                </p>
                <p>
                  We partner with healthcare organizations to provide dependable staffing
                  support that helps maintain continuity of care. Every professional we place is
                  selected for competence, professionalism, and dedication to compassionate care.
                </p>
              </div>
            </div>
          </section>

          <section className="about-values">
            <div className="container">
              <div className="about-section-heading">
                <p className="about-kicker">(what guides us)</p>
                <h2>
                  The values behind <em>every placement</em>
                </h2>
              </div>
              <div className="about-values__grid">
                {values.map((value) => (
                  <article className="about-value-card" key={value.title}>
                    <SparkIcon />
                    <h3>{value.title}</h3>
                    <p>{value.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="about-serve">
            <div className="container about-serve__grid">
              <div>
                <p className="about-kicker">(who we serve)</p>
                <h2>
                  Trusted across <em>Illinois</em>
                </h2>
                <p>
                  We proudly provide healthcare staffing solutions for organizations of every
                  size and setting.
                </p>
              </div>
              <div className="about-serve__list">
                {whoWeServe.map((item) => (
                  <span key={item.label}>
                    <ServeIcon type={item.icon} />
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="about-cta">
            <div className="about-cta__inner">
              <h2>
                Great healthcare begins with <em>great people.</em>
              </h2>
              <p>
                Our commitment extends beyond filling schedules. We build lasting partnerships
                with healthcare facilities by providing dependable professionals who uphold
                patient care, integrity, and clinical excellence.
              </p>
              <a className="button button--light" href="/#contact">
                <span>Get started</span>
                <ArrowRightIcon />
              </a>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </>
  )
}

export default About
