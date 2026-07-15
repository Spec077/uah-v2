import { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import BlurEffect from 'react-progressive-blur'
import HomeHero from './components/home/HomeHero'
import SiteFooter from './components/home/SiteFooter'
import SiteHeader from './components/home/SiteHeader'
import StartModal from './components/home/StartModal'
import { formatUSPhoneNumber } from './utils/formatUSPhoneNumber'
import './Home.css'

const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#about', label: 'About' },
  { href: '/careers', label: 'Careers' },
  { href: '#process', label: 'Process' },
  { href: '#contact', label: 'Contact' },
]

const ArrowRightIcon = () => (
  <svg className="arrow-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
)

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m6 6 12 12" />
    <path d="M18 6 6 18" />
  </svg>
)

const MedicalCrossIcon = () => (
  <svg viewBox="-5 -10 110 135" aria-hidden="true">
    <path d="m90.461 27.059c-0.070313-0.19141-0.26172-0.30859-0.46094-0.30859-4.5195 0-8.5898-1.3008-12.078-3.8711-0.30859-0.23047-0.60938-0.46094-0.92188-0.69141-1.5781-1.1992-3.2188-2.4414-5.2305-2.8086-2.6094-0.48828-5.0898 0.60156-7.4883 1.6484-0.35938 0.14844-0.71875 0.30859-1.0703 0.46094-1.5586 0.64844-3.1602 0.78906-4.6211 0.44141-0.011719 0.019531-0.011719 0.050781-0.019532 0.070312-0.039062 0.14062-0.089843 0.28125-0.14844 0.41016-0.050781 0.16016-0.10938 0.30859-0.17969 0.46094-1.1484 2.6406-3.4805 4.5391-6.25 5.1484-0.16016 0.050781-0.32031 0.078125-0.48828 0.10156-0.011718 0.011718-0.019531 0.011718-0.03125 0.011718-0.17188 0.03125-0.35938 0.050782-0.53906 0.070313-0.30859 0.03125-0.62109 0.050781-0.92969 0.050781-0.21094 0-0.42188-0.011718-0.62891-0.03125-0.17969 0-0.35938-0.019531-0.53906-0.050781-0.10938-0.011719-0.21875-0.03125-0.32813-0.050781-0.070312-0.011719-0.14062-0.019532-0.21094-0.039063-2.8789-0.55078-5.3203-2.4688-6.5195-5.1719-0.058594-0.14844-0.12891-0.30078-0.17969-0.46094-0.050781-0.12109-0.089844-0.23828-0.12891-0.35938-0.011719-0.039063-0.03125-0.089844-0.039062-0.12891-1.4609 0.33984-3.0586 0.19141-4.6289-0.46875-0.35156-0.14844-0.71094-0.30859-1.0703-0.46094-2.3984-1.0508-4.8789-2.1406-7.4883-1.6484-2.0117 0.37109-3.6484 1.6094-5.2305 2.8086-0.30859 0.23047-0.60938 0.46094-0.92188 0.69141-3.4883 2.5703-7.5586 3.8711-12.078 3.8711-0.19922 0-0.39062 0.12109-0.46094 0.30859-0.078125 0.19141-0.03125 0.41016 0.12109 0.55078 0.42188 0.39844 0.85156 0.82812 1.3008 1.2617 1.3516 1.3203 2.7812 2.7188 4.3008 3.9219 1.25 0.89062 2.5312 1.6016 3.8281 1.9297 0.21875 0.058594 0.44141 0.10156 0.66016 0.14844h0.019531c1.0312 0.19141 2.0586 0.23828 3.0508 0.14844 2.4883-0.23828 4.7188-1.3203 6.0195-3.0586 0.48828-0.66016 1.4297-0.80078 2.1016-0.30859 0.66016 0.5 0.80078 1.4414 0.30859 2.1016-0.80078 1.0781-1.7695 1.9297-2.8398 2.5781-0.17188 0.10937-0.35156 0.21094-0.53125 0.30078-0.19141 0.10156-0.37891 0.19922-0.57812 0.28906 2.0898 1.0117 4.3984 1.5391 6.6211 1.5391 1.0781 0 2.1484-0.12891 3.1602-0.39062 2.8594-0.71875 8.3203-3.8086 11.422-8.4219l-0.015625 26.047c-0.80078-0.19141-1.5781-0.37109-2.3398-0.55078-1.75-0.39844-3.3984-0.78125-4.6602-1.1602-3.9609-1.1992-6.1602-3.2891-5.8789-5.6016 0.23047-1.9414 2.1484-3.5117 4.4688-3.6406 0.82812-0.050782 1.4609-0.75 1.4102-1.5781s-0.76953-1.4609-1.5781-1.4102c-3.75 0.21094-6.8789 2.9102-7.2812 6.2812-0.17188 1.4492-0.10938 6.3789 7.9883 8.8281 1.0586 0.32031 2.3398 0.62891 3.6992 0.94922-4.3516 1.6719-7.8281 4.1016-7.8281 8.0508 0 4.5 4.8086 6.7109 9.5508 8.5117-1.7383 0.92969-3.0703 2.0195-3.6211 3.4805-1.4102 3.7891 1.6914 5.9297 2.7109 6.6406 0.26172 0.17969 0.55859 0.26953 0.85156 0.26953 0.48047 0 0.94141-0.23047 1.2305-0.64844 0.46875-0.67969 0.30078-1.6211-0.37891-2.0898-1.8398-1.2695-1.9805-2.1094-1.6016-3.1211 0.32031-0.85156 1.6094-1.6484 3.25-2.3906v8.75c0 0.82812 0.67187 1.5 1.5 1.5 0.82812 0 1.5-0.67188 1.5-1.5l-0.003907-8.7695c1.6406 0.73828 2.9297 1.5391 3.25 2.3906 0.37891 1.0116 0.23828 1.8516-1.6016 3.1211-0.67969 0.46875-0.85156 1.4102-0.37891 2.0898 0.28906 0.42188 0.76172 0.64844 1.2305 0.64844 0.28906 0 0.58984-0.089844 0.85156-0.26953 1.0195-0.71094 4.1211-2.8516 2.7109-6.6406-0.53906-1.4609-1.8789-2.5508-3.6211-3.4805 4.7383-1.8086 9.5508-4.0117 9.5508-8.5117 0-3.9492-3.4805-6.3789-7.8281-8.0508 1.3711-0.32031 2.6406-0.62891 3.6992-0.94922 8.1016-2.4492 8.1719-7.3789 7.9883-8.8281-0.39844-3.3711-3.5312-6.0703-7.2812-6.2812-0.80859-0.039062-1.5312 0.58984-1.5781 1.4102-0.050781 0.82031 0.58984 1.5391 1.4102 1.5781 2.3086 0.12891 4.2305 1.6914 4.4688 3.6406 0.28125 2.3086-1.9219 4.3984-5.8789 5.6016-1.2617 0.37891-2.9102 0.76172-4.6602 1.1602-0.76172 0.17188-1.5391 0.35938-2.3398 0.55078v-26.578c3.4297 5.2695 8.4297 8.2188 11.422 8.9688 1 0.26172 2.0781 0.39063 3.1719 0.39063 1.6602 0 3.3789-0.28906 5-0.85156-0.19922-0.10156-0.39062-0.21094-0.57812-0.32812-0.17969-0.10938-0.35938-0.23047-0.53125-0.35938-0.82812-0.57812-1.5781-1.3008-2.2305-2.1719-0.48828-0.66016-0.35156-1.6016 0.30859-2.1016 0.67188-0.48828 1.6094-0.35156 2.1016 0.30859 0.80859 1.0898 1.9883 1.9219 3.3711 2.4492 0.19922 0.070312 0.39844 0.14062 0.60156 0.21094 0.78906 0.23828 1.6406 0.37891 2.5117 0.42969 0.92969-0.03125 1.8594-0.14844 2.7617-0.37891 3.6211-0.92188 6.8203-4.0391 9.6406-6.8008 0.44922-0.42969 0.87891-0.85938 1.3008-1.2617 0.15625-0.13672 0.20703-0.35547 0.12891-0.54688zm-50.961 38.801c0-3 4.3398-4.9219 9-6.2695v12.5c-4.2305-1.5781-9-3.3711-9-6.2305zm21 0c0 2.8594-4.7695 4.6484-9 6.2305v-12.5c4.6602 1.3516 9 3.2695 9 6.2695zm-16.34-45.211c-0.10938-0.44922-0.16016-0.91797-0.16016-1.3984 0-3.3086 2.6914-6 6-6s6 2.6914 6 6c0 0.46875-0.050781 0.92188-0.14844 1.3516-0.039062 0.16016-0.078124 0.32031-0.12891 0.48047-0.10156 0.30078-0.21875 0.58984-0.35938 0.87109-0.070312 0.14062-0.14062 0.28125-0.23047 0.41016-0.17187 0.28125-0.35937 0.55078-0.57031 0.80078-0.10156 0.10156-0.19141 0.21094-0.28906 0.30078-0.10938 0.10938-0.21875 0.21875-0.33984 0.32031-0.12109 0.10156-0.23828 0.19922-0.35938 0.28906-0.25 0.19141-0.51172 0.35156-0.78906 0.5-0.14062 0.070312-0.28125 0.14062-0.42969 0.19922-0.14844 0.070312-0.28906 0.12109-0.44141 0.17187-0.14062 0.050782-0.28906 0.089844-0.42969 0.12109-0.011719 0.011719-0.019531 0.011719-0.03125 0.011719-0.16016 0.039063-0.30859 0.070313-0.46875 0.10156s-0.32031 0.050781-0.48047 0.058593c-0.17188 0.011719-0.32812 0.019531-0.5 0.019531s-0.33984-0.011718-0.5-0.019531c-0.33984-0.03125-0.66016-0.078125-0.98047-0.17188-1.9883-0.5-3.5781-2-4.2188-3.9297-0.054688-0.16797-0.10547-0.32812-0.14453-0.48828z" />
  </svg>
)

const HeartIcon = () => (
  <svg viewBox="-5 -10 110 135" aria-hidden="true">
    <path d="M47.73,53.39a1.19,1.19,0,0,1-1.2,1.19H42.92v4.55h3.61a1.19,1.19,0,0,1,1.2,1.19v3.62h4.54V60.32a1.19,1.19,0,0,1,1.2-1.19h3.62V54.58H53.47a1.19,1.19,0,0,1-1.2-1.19V49.77H47.73v3.62ZM5.11,45.22A1.19,1.19,0,0,1,5.65,44a31.28,31.28,0,0,1,9.41-4V18.26a1.2,1.2,0,0,1,1.08-1.19,144.58,144.58,0,0,1,15.12-1.8,282.43,282.43,0,0,1,37.37,0A149.51,149.51,0,0,1,83.9,17a1.2,1.2,0,0,1,1,1.18V40a31.28,31.28,0,0,1,9.41,4,1.19,1.19,0,0,1,.54,1.26l-8.4,39.12a1.21,1.21,0,0,1-1.19,1H14.7a1.21,1.21,0,0,1-1.19-1L5.11,45.22Zm9,30.31-6.45-30c3.89-2.46,10.52-4,15.54-4.88,15.68-2.72,38-2.72,53.7,0,5,.87,11.65,2.42,15.54,4.88l-6.45,30Zm71.36,2.39H14.58l1.08,5H84.34l1.08-5ZM82.54,39.35V19.2c-17.43-2.88-47.73-2.93-65.08.06V39.35c17.7-4.21,47.38-4.21,65.08,0ZM50,41.55A15.31,15.31,0,1,1,34.69,56.86,15.31,15.31,0,0,1,50,41.55Zm9.13,6.17a12.92,12.92,0,1,1-18.26,0,12.91,12.91,0,0,1,18.26,0ZM45.34,52.19V48.58a1.19,1.19,0,0,1,1.19-1.2h6.94a1.19,1.19,0,0,1,1.19,1.2v3.61h3.62a1.2,1.2,0,0,1,1.2,1.2v6.93a1.2,1.2,0,0,1-1.2,1.2H54.66v3.62a1.19,1.19,0,0,1-1.19,1.19H46.53a1.19,1.19,0,0,1-1.19-1.19V61.52H41.72a1.2,1.2,0,0,1-1.2-1.2V53.39a1.2,1.2,0,0,1,1.2-1.2Z" />
  </svg>
)

const heroSlides = [
  // {
  //   src: '/assets/home-healthcare-hero.png',
  //   alt: 'Healthcare professional providing calm support',
  // },
  // {
  //   src: 'https://img1.wsimg.com/isteam/stock/DEjq89Q/:/rs=w:2046,m',
  //   alt: 'Clinician supporting a patient with attentive care',
  // },
    {
      src: './assets/mercury.webp',
      alt: '',
  },
  {     
      src: './assets/godwinedu.jpg',
      alt: '',
  },
  {
      src: './assets/cdnprod.webp',
      alt: '',
  },
  // {
  //     src: 'https://cnaclassesnearyou.com/wp-content/uploads/2014/07/bigstock-Portrait-Of-Male-Nurse-Working-55983770.jpg',
  //     alt: '',
  // },
  //   {
  //   src: 'https://img1.wsimg.com/isteam/stock/14293/:/rs=w:2046,m',
  //   alt: 'Nursing professional providing patient-centered care',
  // },
  {
     src: './assets/nursemaam.webp',
     alt: '',
  },
  {
    src:'./assets/nursedude.jpg',
    alt: 'Nursing professional providing patient-centered care',
  },
]

const services = [
  {
    image: 'https://img1.wsimg.com/isteam/stock/33909/:/rs=w:1600,m',
    title: 'RN Staffing',
    description:
      'Registered Nurses with the clinical judgment, experience, and professionalism required across acute, post-acute, long-term care, and community healthcare environments.',
    cta: 'Request RN staffing',
  },
  {
    image: 'https://img1.wsimg.com/isteam/stock/4811/:/rs=w:1600,m',
    title: 'LPN Staffing',
    description:
      'Licensed Practical Nurses prepared to support medication administration, treatment plans, documentation, and everyday clinical care.',
    cta: 'Request LPN staffing',
  },
  {
    image: 'https://img1.wsimg.com/isteam/stock/14293/:/rs=w:1600,m',
    title: 'CNA Staffing',
    description:
      'Certified Nursing Assistants who provide attentive daily support while protecting patient comfort, safety, independence, and dignity.',
    cta: 'Request CNA staffing',
  },
  {
    image: 'https://img1.wsimg.com/isteam/stock/DEjq89Q/:/rs=w:1600,m',
    title: 'Flexible Staffing',
    description:
      'Short-term, long-term, per-diem, and ongoing coverage tailored to your census, acuity, schedule demands, and staffing priorities.',
    cta: 'Discuss your staffing needs',
  },
]

const values = [
  {
    title: 'Qualified Healthcare Professionals',
    description:
      'We provide experienced Registered Nurses, Licensed Practical Nurses, Certified Nursing Assistants, and other professionals who meet role-specific licensing and credentialing requirements.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21s-7-3.7-7-10V5l7-3 7 3v6c0 6.3-7 10-7 10Z" />
        <path d="M9 12h6" />
        <path d="M12 9v6" />
      </svg>
    ),
  },
  {
    title: 'Dependable Staffing Support',
    description:
      'Whether you need urgent shift coverage, temporary support, or ongoing placements, our team works to provide qualified professionals when they are needed most.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="5" width="16" height="16" rx="2" />
        <path d="M8 3v4" />
        <path d="M16 3v4" />
        <path d="m8 14 2.3 2.3L16 11" />
      </svg>
    ),
  },
  {
    title: 'Patient-Centered Standards',
    description:
      'Every placement is made with patient safety, compassionate care, professionalism, and continuity in mind.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.8 8.6a5.1 5.1 0 0 0-8.1-3.9L12 5.4l-.7-.7a5.1 5.1 0 0 0-8.1 3.9c0 4.5 8.8 10.2 8.8 10.2s8.8-5.7 8.8-10.2Z" />
        <path d="M8 12h2.5l1-2 2 5 1-3H17" />
      </svg>
    ),
  },
  {
    title: 'Illinois Based and Licensed',
    description:
      'We proudly support healthcare providers across Illinois with local knowledge, responsive communication, and qualified healthcare professionals.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 4h12v16H6z" />
        <path d="M9 8h6" />
        <path d="M9 12h6" />
        <path d="M9 16h3" />
        <path d="m14 17 1 1 2-2" />
      </svg>
    ),
  },
]

const process = [
  ['01', 'Listen first', 'We learn about your facility, patient population, open roles, schedule requirements, and expectations.'],
  ['02', 'Match carefully', 'We identify professionals whose qualifications, availability, experience, and approach align with your care environment.'],
  ['03', 'Verify thoroughly', 'Licensing, credentials, background requirements, and relevant documentation are reviewed before placement.'],
  ['04', 'Support steadily', 'We remain available during onboarding, active coverage, and future staffing needs.'],
]

const trustStatement =
  'Every staffing decision should strengthen the confidence of patients, families, healthcare professionals, and facility leaders.'

function Home() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [loadedImages, setLoadedImages] = useState({})
  const [menuState, setMenuState] = useState('closed')
  const [isScrolled, setIsScrolled] = useState(false)
  const [phoneValue, setPhoneValue] = useState('')
  const [isStartModalOpen, setIsStartModalOpen] = useState(false)
  const [typedTrustText, setTypedTrustText] = useState(() =>
    typeof window !== 'undefined' &&
    (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(max-width: 1080px)').matches)
      ? trustStatement
      : '',
  )
  const isMenuOpen = menuState === 'open'
  const isMenuMounted = menuState !== 'closed'
  const pageRef = useRef(null)
  const heroContentRef = useRef(null)
  const trustRef = useRef(null)
  const contactFormRef = useRef(null)
  const hasTypedTrustRef = useRef(false)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % heroSlides.length)
    }, 5400)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    let frame = 0

    const updateHeroExit = () => {
      frame = 0
      const progress = Math.min(window.scrollY / (window.innerHeight * 0.45), 1)
      heroContentRef.current?.style.setProperty('--hero-exit-progress', progress.toFixed(3))
    }

    const handleScroll = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(updateHeroExit)
      }
    }

    updateHeroExit()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame)
      }
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', isMenuMounted || isStartModalOpen)

    return () => document.body.classList.remove('menu-open')
  }, [isMenuMounted, isStartModalOpen])

  useEffect(() => {
    if (menuState !== 'closing') {
      return undefined
    }

    const timer = window.setTimeout(() => setMenuState('closed'), 260)

    return () => window.clearTimeout(timer)
  }, [menuState])

  useEffect(() => {
    if (!isStartModalOpen) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsStartModalOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isStartModalOpen])

  useEffect(() => {
    const page = pageRef.current

    if (!page) {
      return undefined
    }

    const revealItems = page.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const repeatsReveal = entry.target.hasAttribute('data-reveal-repeat')

          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            if (!repeatsReveal) {
              observer.unobserve(entry.target)
            }
          } else if (repeatsReveal) {
            entry.target.classList.remove('is-visible')
          }
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.16 },
    )

    revealItems.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const trustNode = trustRef.current

    if (!trustNode || hasTypedTrustRef.current) {
      return undefined
    }

    if (
      typeof window !== 'undefined' &&
      (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        window.matchMedia('(max-width: 1080px)').matches)
    ) {
      hasTypedTrustRef.current = true
      return undefined
    }

    let typingTimer = 0
    let observer

    const typeNextCharacter = (index) => {
      setTypedTrustText(trustStatement.slice(0, index))

      if (index >= trustStatement.length) {
        if (observer) {
          observer.disconnect()
        }
        return
      }

      typingTimer = window.setTimeout(() => typeNextCharacter(index + 1), 22)
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasTypedTrustRef.current) {
          return
        }

        hasTypedTrustRef.current = true
        setTypedTrustText('')
        typingTimer = window.setTimeout(() => typeNextCharacter(1), 120)
      },
      { threshold: 0.45 },
    )

    observer.observe(trustNode)

    return () => {
      if (typingTimer) {
        window.clearTimeout(typingTimer)
      }
      observer.disconnect()
    }
  }, [])

  const closeMenu = () => setMenuState('closing')
  const markImageLoaded = (key) => {
    setLoadedImages((currentImages) => ({ ...currentImages, [key]: true }))
  }
  const handlePhoneChange = (event) => {
    setPhoneValue(formatUSPhoneNumber(event.target.value))
  }
  const handleRequestStaffingClick = (event) => {
    event.preventDefault()
    hasTypedTrustRef.current = true
    setTypedTrustText(trustStatement)
    setIsStartModalOpen(false)
    if (isMenuMounted) {
      closeMenu()
    }

    window.setTimeout(() => {
      contactFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      window.history.replaceState(null, '', '#contact')
    }, 40)
  }

  return (
    <>
      <Helmet>
        <title>United Ace Healthcare | Healthcare Staffing With Care Standards</title>
        <meta
          name="description"
          content="United Ace Healthcare connects healthcare facilities across Illinois with credentialed nursing and healthcare professionals ready to deliver reliable, compassionate care."
        />
        <link rel="canonical" href="https://unitedacehealthcare.com/" />
        <meta property="og:title" content="United Ace Healthcare" />
        <meta
          property="og:description"
          content="Dependable healthcare staffing support for facilities and care teams."
        />
        <meta property="og:url" content="https://unitedacehealthcare.com/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div id="top" className="home-page" ref={pageRef}>
        <SiteHeader
          ArrowRightIcon={ArrowRightIcon}
          isMenuMounted={isMenuMounted}
          isMenuOpen={isMenuOpen}
          isScrolled={isScrolled}
          navLinks={navLinks}
          onCloseMenu={closeMenu}
          onOpenMenu={() => setMenuState('open')}
          onRequestStaffing={handleRequestStaffingClick}
        />

        {isStartModalOpen && (
          <StartModal
            ArrowRightIcon={ArrowRightIcon}
            CloseIcon={CloseIcon}
            HeartIcon={HeartIcon}
            MedicalCrossIcon={MedicalCrossIcon}
            onClose={() => setIsStartModalOpen(false)}
            onRequestStaffing={handleRequestStaffingClick}
          />
        )}

        <main>
          <HomeHero
            ArrowRightIcon={ArrowRightIcon}
            activeSlide={activeSlide}
            heroContentRef={heroContentRef}
            heroSlides={heroSlides}
            loadedImages={loadedImages}
            markImageLoaded={markImageLoaded}
            onOpenStartModal={() => setIsStartModalOpen(true)}
            setActiveSlide={setActiveSlide}
          />

          <section className="marquee-band" aria-label="Who we serve">
            <div className="marquee-band__track">
              <span>Hospitals</span>
              <span>Skilled Nursing Facilities</span>
              <span>Rehabilitation Centers</span>
              <span>Assisted Living Communities</span>
              <span>Long-Term Care Facilities</span>
              <span>Home Healthcare Providers</span>
            </div>
          </section>

          <section id="about" className="section about-section">
            <div className="container split-layout">
              <div className={`image-panel${loadedImages.about ? ' is-loaded' : ''}`} data-reveal>
                <img
                  src="https://img1.wsimg.com/isteam/stock/4811/:/rs=w:1800,m"
                  alt="Clinician offering attentive care"
                  onLoad={() => markImageLoaded('about')}
                />
                <span className="spark spark--one" aria-hidden="true" />
              </div>
              <div className="copy-panel" data-reveal style={{ '--delay': '120ms' }}>
                <p className="eyebrow">Our standard</p>
                <h2>
                  Staffing built around reliability, <em>clinical readiness</em>, and respect for patient care.
                </h2>
                <p>
                  United Ace Healthcare helps facilities maintain dependable coverage without compromising
                  the quality of care. We carefully match qualified healthcare professionals with
                  organizations that value professionalism, compassion, and consistency.
                </p>
                <div className="mini-facts">
                  <span>Credential-focused</span>
                  <span>Compassion-led</span>
                  <span>Facility-ready</span>
                  <span>Trust first</span>
                </div>
              </div>
            </div>
          </section>

          <section className="statement-section">
            <div className="container statement-section__inner" data-reveal ref={trustRef}>
              <p className="eyebrow">Trust first</p>
              <h2 className="typewriter-text" aria-label={trustStatement}>
                {typedTrustText}
                <span aria-hidden="true" className="typewriter-cursor" />
              </h2>
            </div>
          </section>

          <section id="services" className="section services-section">
            <div className="container section-heading" data-reveal>
              <p className="eyebrow">What we do</p>
              <h2>Flexible healthcare staffing for facilities that cannot afford gaps in care.</h2>
              <p>
                From individual shift coverage to ongoing workforce support, our staffing solutions
                are designed around your schedule, patient needs, and operational priorities.
              </p>
            </div>

            <div className="container services-grid">
              {services.map((service, index) => (
                <a
                  className="service-card"
                  data-reveal
                  href="#contact"
                  style={{ '--delay': `${index * 100}ms` }}
                  key={service.title}
                >
                  <div className={`service-card__image${loadedImages[`service-${index}`] ? ' is-loaded' : ''}`}>
                    <img
                      src={service.image}
                      alt=""
                      loading="lazy"
                      onLoad={() => markImageLoaded(`service-${index}`)}
                    />
                  </div>
                  <div className="service-card__body">
                    <BlurEffect className="service-card__progressive-blur" position="bottom" intensity={560} />
                    <div className="service-card__details">
                      <h3>{service.title}</h3>
                      <p>{service.description}</p>
                      <span className="learn-more">
                        <span>{service.cta}</span>
                        <ArrowRightIcon />
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>

          <section className="section values-section">
            <div className="container values-layout">
              <div className="section-heading values-heading" data-reveal>
                <p className="eyebrow">Why United Ace</p>
                <h2>Healthcare staffing your team can rely on.</h2>
              </div>
              <div className="values-list">
                {values.map((value, index) => (
                  <article
                    data-reveal
                    data-reveal-repeat
                    style={{
                      '--delay': `${index * 90}ms`,
                      '--reveal-x': index % 2 === 0 ? '-3rem' : '3rem',
                    }}
                    key={value.title}
                  >
                    <span className="icon-mark" aria-hidden="true">
                      {value.icon}
                    </span>
                    <h3>{value.title}</h3>
                    <p>{value.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="process" className="section process-section">
            <div className="container process-layout">
              <div className="section-heading" data-reveal>
                <p className="eyebrow">How we work</p>
                <h2>A clear process from staffing request to dependable coverage.</h2>
              </div>
              <div className="process-list">
                {process.map(([number, title, description], index) => (
                  <article data-reveal style={{ '--delay': `${index * 110}ms` }} key={title}>
                    <span>{number}</span>
                    <div>
                      <h3>{title}</h3>
                      <p>{description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* <section className="section professional-section">
            <div className="container professional-panel" data-reveal>
              <div>
                <p className="eyebrow">For Healthcare Professionals</p>
                <h2>Find meaningful opportunities where your skills are valued.</h2>
                <p>
                  United Ace Healthcare works with Registered Nurses, Licensed Practical Nurses,
                  Certified Nursing Assistants, and other healthcare professionals seeking flexible
                  and rewarding opportunities across Illinois.
                </p>
              </div>
              <ul>
                <li>Flexible scheduling</li>
                <li>Professional support</li>
                <li>Opportunities across multiple healthcare settings</li>
                <li>Straightforward application process</li>
                <li>Responsive communication</li>
              </ul>
              <div className="professional-panel__actions">
                <a className="button button--primary" href="/careers">
                  <span>View career opportunities</span>
                  <ArrowRightIcon />
                </a>
                <a className="button button--outline button--outline-dark" href="/careers">
                  <span>Apply now</span>
                  <ArrowRightIcon />
                </a>
              </div>
            </div>
          </section> */}

          <section className="dark-panel-section">
            <div className="container dark-panel" data-reveal>
              <div>
                {/* <p className="eyebrow eyebrow--light">Commitment</p> */}
                <h2>Staffing support that feels responsive, professional, and human.</h2>
                <p>
                  We understand that staffing affects more than a schedule. It affects patient safety,
                  team morale, continuity of care, and the confidence of every person who depends on
                  your facility.
                </p>
              </div>
              <a className="button button--light" href="tel:+12242844949">
                Call +1 (224) 284-4949
              </a>
            </div>
          </section>

          <section id="contact" className="section contact-section">
            <div className="container contact-grid">
              <div className="contact-copy" data-reveal>
                <p className="eyebrow">Get in touch</p>
                <h2>Start a clear conversation about your staffing needs.</h2>
                <p>
                  Tell us what your facility needs and a member of our team will follow up within
                  one business day. For urgent staffing requests, contact us directly by phone.
                </p>
                <div className="contact-details">
                  <address>
                    2315 Woodside Drive
                    <br />
                    Carpentersville, IL
                  </address>
                  <a href="mailto:info@unitedacehealthcare.com">info@unitedacehealthcare.com</a>
                  <a href="mailto:unitedacehc@gmail.com">unitedacehc@gmail.com</a>
                  <a href="tel:+12246710180">+1 (224) 671-0180</a>
                  <a href="tel:+12242844949">+1 (224) 284-4949</a>
                  <a href="tel:+13127214561">+1 (312) 721-4561</a>
                </div>
              </div>

              <form className="contact-form" data-reveal style={{ '--delay': '120ms' }} ref={contactFormRef}>
                <div className="form-grid">
                  <label>
                    <span>Full name</span>
                    <input name="name" type="text" autoComplete="name" placeholder="Jane Smith" required />
                  </label>
                  <label>
                    <span>Phone</span>
                    <input
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="(224) 284-4949"
                      value={phoneValue}
                      onChange={handlePhoneChange}
                      required
                    />
                  </label>
                </div>
                <label>
                  <span>Email address</span>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="jane@example.com"
                    required
                  />
                </label>
                <label>
                  <span>Inquiry type</span>
                  <select name="inquiry" defaultValue="Facility Staffing Request" required>
                    <option>Facility Staffing Request</option>
                    <option>Healthcare Professional Application</option>
                    <option>General Inquiry</option>
                  </select>
                </label>
                <label>
                  <span>How can we help?</span>
                  <textarea
                    name="message"
                    rows="5"
                    maxLength="1200"
                    placeholder="Provide a brief description of your staffing request or question."
                    required
                  />
                </label>
                <button className="button button--primary" type="submit">
                  Submit inquiry
                </button>
              </form>
            </div>
          </section>
        </main>
        <SiteFooter navLinks={navLinks} />
      </div>
    </>
  )
}

export default Home
