function HomeHero({
  ArrowRightIcon,
  activeSlide,
  heroContentRef,
  heroSlides,
  loadedImages,
  markImageLoaded,
  onOpenStartModal,
  setActiveSlide,
}) {
  return (
    <section className="hero" aria-label="United Ace Healthcare nursing and healthcare staffing">
      <div className="hero__media" aria-hidden="true">
        {heroSlides.map((slide, index) => (
          <img
            key={slide.src}
            className={`hero__image${activeSlide === index ? ' is-active' : ''}${
              loadedImages[`hero-${index}`] ? ' is-loaded' : ''
            }`}
            src={slide.src}
            alt=""
            loading={index === 0 ? 'eager' : 'lazy'}
            onLoad={() => markImageLoaded(`hero-${index}`)}
          />
        ))}
      </div>
      <div className="hero__overlay" aria-hidden="true" />
      <div className="hero__grid" aria-hidden="true" />
      <div className="hero__content" ref={heroContentRef}>
        <h1 aria-label="Dependable care teams for moments that matter.">
          <span className="line-reveal"><span>Dependable care</span></span>
          <span className="line-reveal"><span>teams for moments</span></span>
          <span className="line-reveal"><span>that matter.</span></span>
        </h1>
        <p className="hero__copy line-reveal">
          <span>
            United Ace Healthcare supplies credentialed nurses and healthcare professionals
            with the calm, compassion, and reliability care environments deserve.
          </span>
        </p>
        <div className="hero__actions line-reveal">
          <span>
            {/* <a className="button button--primary" href="#contact">
              <span>Request staffing support</span>
              <ArrowRightIcon />
            </a>
            <a className="button button--outline" href="/careers">
              <span>Apply now</span>
              <ArrowRightIcon />
            </a> */}
            <button
              className="button button--outline hero__start-button"
              type="button"
              onClick={onOpenStartModal}
            >
              <span>Get started</span>
              <ArrowRightIcon />
            </button>
          </span>
        </div>
      </div>
      <div className="hero__controls" aria-label="Hero slideshow controls">
        {heroSlides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Show slide ${index + 1}${slide.alt ? `: ${slide.alt}` : ''}`}
            aria-current={activeSlide === index}
            className={activeSlide === index ? 'is-active' : undefined}
            onClick={() => setActiveSlide(index)}
          />
        ))}
      </div>
    </section>
  )
}

export default HomeHero
