function SiteHeader({
  ArrowRightIcon,
  brandHref = '#top',
  isMenuMounted,
  isMenuOpen,
  isScrolled,
  mobileCta,
  navLinks,
  onCloseMenu,
  onOpenMenu,
  onRequestStaffing,
}) {
  return (
    <>
      <header className={`site-header${isScrolled ? ' is-scrolled' : ''}`}>
        <div className="site-header__inner">
          <a href={brandHref} className="brand-link" aria-label="United Ace Healthcare home">
            <img className="brand-logo" src="/assets/uah-logo.png" alt="" />
            <span>United Ace Healthcare</span>
          </a>

          <nav className="site-nav" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <a className="nav-phone" href="tel:+12242844949">
            +1 (224) 284-4949
          </a>

          <button
            className={`menu-toggle${isMenuOpen ? ' is-open' : ''}`}
            type="button"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={isMenuOpen ? onCloseMenu : onOpenMenu}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {isMenuMounted && (
        <div id="mobile-menu" className={`mobile-menu${isMenuOpen ? ' is-open' : ''}`}>
          <div className="mobile-menu__panel">
            <nav className="mobile-menu__nav" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <a href={link.href} key={link.href} onClick={onCloseMenu}>
                  {link.label}
                </a>
              ))}
            </nav>

            {mobileCta ? (
              <a className="button button--primary" href={mobileCta.href} onClick={mobileCta.onClick}>
                <span>{mobileCta.label}</span>
                <ArrowRightIcon />
              </a>
            ) : (
              <a className="button button--primary" href="#contact" onClick={onRequestStaffing}>
                <span>Request staffing support</span>
                <ArrowRightIcon />
              </a>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default SiteHeader
