function SiteFooter({ navLinks }) {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div>
          <a href="#top" className="brand-link">
            <img className="brand-logo" src="/assets/uah-logo.png" alt="" />
            <span>United Ace Healthcare</span>
          </a>
          <p>Your Health, Our Priority.</p>
        </div>
        <nav aria-label="Footer navigation">
          {navLinks.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <p>© 2026 United Ace Healthcare. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default SiteFooter
