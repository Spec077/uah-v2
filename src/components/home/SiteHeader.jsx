function SiteHeader({
  ArrowRightIcon,
  brandHref = '#top',
  headerCtaLabel = 'Get started',
  isMenuMounted,
  isMenuOpen,
  isScrolled,
  isHeaderCtaVisible = false,
  mobileCta,
  navLinks,
  onCloseMenu,
  onHeaderCtaClick,
  onNavLinkClick,
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
              <a href={link.href} key={link.href} onClick={(event) => onNavLinkClick?.(event, link.href)}>
                {link.label}
              </a>
            ))}
          </nav>

          {isHeaderCtaVisible && (
            <button className="nav-cta" type="button" onClick={onHeaderCtaClick}>
              <span>{headerCtaLabel}</span>
              <ArrowRightIcon />
            </button>
          )}

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
                <a href={link.href} key={link.href} onClick={(event) => onNavLinkClick?.(event, link.href)}>
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
