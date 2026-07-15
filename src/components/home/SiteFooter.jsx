const whoWeServeLinks = [
  'Hospitals',
  'Skilled Nursing Facilities',
  'Rehabilitation Centers',
  'Assisted Living Communities',
  'Long-Term Care Facilities',
  'Outpatient Clinics',
  'Home Healthcare Providers',
]

const footerNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/#services', label: 'Services' },
  { href: '/#process', label: 'Process' },
  { href: '/#contact', label: 'Contact' },
]

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__top">
          <div className="site-footer__brand-column">
            <a href="/" className="footer-brand" aria-label="United Ace Healthcare home">
              <img className="footer-brand__logo" src="/assets/uah-logo.png" alt="" />
              <span>United Ace Healthcare</span>
            </a>
            <p>
              United Ace Healthcare is a premier nursing and healthcare staffing agency
              dedicated to connecting healthcare facilities with qualified professionals who
              deliver safe, compassionate, and competent patient care. We proudly serve
              healthcare providers across Illinois with reliable staffing solutions built on
              trust, quality, and excellence.
            </p>
            {/* <a className="footer-cta" href="/#contact">
              Get Started
            </a> */}
          </div>

          <div className="site-footer__link-column">
            <h2>Who We Serve</h2>
            <ul>
              {whoWeServeLinks.map((link) => (
                <li key={link}>{link}</li>
              ))}
            </ul>
          </div>

          <div className="site-footer__link-column site-footer__link-column--compact">
            <h2>Navigate</h2>
            <nav aria-label="Footer navigation">
              {footerNavLinks.map((link) => (
                <a href={link.href} key={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>

            <h2>Contact</h2>
            <address>
              <span>Illinois, United States</span>
              <a href="mailto:info@unitedacehealthcare.com">info@unitedacehealthcare.com</a>
              <a href="mailto:unitedacehc@gmail.com">unitedacehc@gmail.com</a>
            </address>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>&copy; 2026 United Ace Healthcare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
