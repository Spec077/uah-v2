const defaultHeaderOffset = 96

function easeOutQuint(progress) {
  return 1 - Math.pow(1 - progress, 5)
}

function getTargetElement(target) {
  if (!target) {
    return null
  }

  if (target instanceof HTMLElement) {
    return target
  }

  const id = String(target).replace(/^#/, '')
  return document.getElementById(decodeURIComponent(id))
}

export function smoothScrollToTarget(target, options = {}) {
  const targetElement = getTargetElement(target)

  if (!targetElement) {
    return false
  }

  const {
    block = 'start',
    duration = 950,
    offset = defaultHeaderOffset,
    updateHash = false,
  } = options

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const targetBounds = targetElement.getBoundingClientRect()
  const startY = window.scrollY
  const documentHeight = document.documentElement.scrollHeight
  const maxY = Math.max(0, documentHeight - window.innerHeight)
  const rawTargetY =
    block === 'center'
      ? startY + targetBounds.top - (window.innerHeight - targetBounds.height) / 2
      : startY + targetBounds.top - offset
  const targetY = Math.min(Math.max(rawTargetY, 0), maxY)

  if (prefersReducedMotion || duration <= 0) {
    window.scrollTo(0, targetY)
    if (updateHash && targetElement.id) {
      window.history.pushState(null, '', `#${targetElement.id}`)
    }
    return true
  }

  const distance = targetY - startY
  const startTime = performance.now()

  const step = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    window.scrollTo(0, startY + distance * easeOutQuint(progress))

    if (progress < 1) {
      window.requestAnimationFrame(step)
      return
    }

    if (updateHash && targetElement.id) {
      window.history.pushState(null, '', `#${targetElement.id}`)
    }
  }

  window.requestAnimationFrame(step)
  return true
}

export function smoothScrollHashClick(event, href, options = {}) {
  if (!href?.startsWith('#')) {
    return false
  }

  const targetElement = getTargetElement(href)

  if (!targetElement) {
    return false
  }

  event?.preventDefault()
  return smoothScrollToTarget(targetElement, { updateHash: true, ...options })
}
