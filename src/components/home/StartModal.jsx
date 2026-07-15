function StartModal({
  ArrowRightIcon,
  CloseIcon,
  HeartIcon,
  MedicalCrossIcon,
  onClose,
  onRequestStaffing,
}) {
  return (
    <div
      className="start-modal"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className="start-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="start-modal-title"
      >
        <button
          className="start-modal__close"
          type="button"
          aria-label="Close get started dialog"
          onClick={onClose}
        >
          <CloseIcon />
        </button>

        <div className="start-modal__intro">
          <h2 id="start-modal-title">
            Get <em>Started</em>
          </h2>
          <p>Tell us who you are so we can point you the right way.</p>
        </div>

        <div className="start-modal__options">
          <a className="start-option start-option--facility" href="#contact" onClick={onRequestStaffing}>
            <span className="start-option__icon" aria-hidden="true">
              <MedicalCrossIcon />
            </span>
            <h3>I'm a Healthcare Organization</h3>
            <p>Hospitals, care homes, and related facilities looking for dependable staffing support.</p>
            <span className="start-option__link">
              <span>Request staffing</span>
              <ArrowRightIcon />
            </span>
          </a>

          <a className="start-option start-option--professional" href="/careers">
            <span className="start-option__icon" aria-hidden="true">
              <HeartIcon />
            </span>
            <h3>I'm a Nursing Professional</h3>
            <p>RNs, LPNs, and CNAs who want to join United Ace Healthcare.</p>
            <span className="start-option__link">
              <span>Apply to join</span>
              <ArrowRightIcon />
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default StartModal
