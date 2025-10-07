import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const baseVideos = [
  {
    id: 'mindful-motion',
    title: 'Routine bien-être : ralentir pour mieux créer',
    creator: 'Adeline',
    handle: '@adeline_creative',
    category: 'Coach bien-être',
    summary:
      'Une nouvelle façon de nourrir votre moteur intérieur en quatre étapes guidées et accessibles.',
    tags: ['Test', 'Tag 2', 'Un très long tag'],
    price: '18,00 €',
    duration: '12:30',
    accent: '#f7d6c8',
    videoUrl: 'https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4',
  },
  {
    id: 'urban-morphosis',
    title: 'Réinventer son intérieur avec la lumière',
    creator: 'Mathias',
    handle: '@studio_mathias',
    category: 'Déco intérieure',
    summary:
      'Explorez comment la lumière sculpte les volumes de votre salon grâce à trois scénarios simples.',
    tags: ['Décoration', 'Maison', 'Ambiance cocooning'],
    price: '12,50 €',
    duration: '08:16',
    accent: '#d9e7ff',
    videoUrl: 'https://storage.googleapis.com/coverr-main/mp4/Night-Mountains.mp4',
  },
  {
    id: 'fitness-pulse',
    title: '20 minutes de renfo fonctionnel',
    creator: 'Lina',
    handle: '@linapulse',
    category: 'Featness',
    summary:
      'Un entraînement complet corps entier avec échauffement, bloc cardio et récupération guidée.',
    tags: ['Cardio', 'Accessoires', 'Routine rapide'],
    price: '9,90 €',
    duration: '20:02',
    accent: '#ffe0f1',
    videoUrl: 'https://storage.googleapis.com/coverr-main/mp4/coverr-downtown-skyline-1586369015454.mp4',
  },
  {
    id: 'deep-focus',
    title: 'Respiration pour créateurs débordés',
    creator: 'Noah',
    handle: '@noahfocus',
    category: 'Coach mindset',
    summary:
      'Un protocole de respiration guidée pour rester concentré entre deux sessions de montage.',
    tags: ['Respiration', 'Focus', 'Créativité'],
    price: '6,80 €',
    duration: '05:44',
    accent: '#dfeee2',
    videoUrl: 'https://storage.googleapis.com/coverr-main/mp4/coverr-snowy-forest-1581089810438.mp4',
  },
]

const createVideoBatch = (batchIndex) =>
  baseVideos.map((video, index) => ({
    ...video,
    id: `${video.id}-${batchIndex}-${index}`,
    order: batchIndex * baseVideos.length + index + 1,
  }))

const mainMenu = [
  { label: 'Accueil', icon: '/images/home.png', isActive: true },
  { label: 'Créer', icon: '/images/add.png' },
  { label: 'Mode silencieux', icon: '/images/silent.png' },
  { label: 'Sauvegardés', icon: '/images/bookmark.png' },
]

const quickReactions = [
  { label: 'Like', icon: '/images/like.png' },
  { label: 'Sauver', icon: '/images/bookmark-white.png' },
  { label: 'Partager', icon: '/images/arrows.png' },
]

function App() {
  const [videos, setVideos] = useState(() => createVideoBatch(0))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const feedRef = useRef(null)
  const itemRefs = useRef([])
  const wheelLockRef = useRef(false)
  const batchIndexRef = useRef(1)

  const appendVideos = useCallback(() => {
    setVideos((previous) => {
      const nextBatchIndex = batchIndexRef.current
      batchIndexRef.current += 1
      const nextBatch = createVideoBatch(nextBatchIndex)
      return [...previous, ...nextBatch]
    })
  }, [])

  const boundedIndex = useMemo(() => Math.max(0, Math.min(currentIndex, videos.length - 1)), [currentIndex, videos.length])

  const handleNavigate = useCallback(
    (direction) => {
      const nextIndex = Math.max(0, Math.min(videos.length - 1, boundedIndex + direction))
      if (nextIndex >= videos.length - 2) {
        appendVideos()
      }
      setCurrentIndex(nextIndex)
    },
    [appendVideos, boundedIndex, videos.length],
  )

  useEffect(() => {
    const node = itemRefs.current[boundedIndex]
    if (node && feedRef.current) {
      node.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [boundedIndex])

  useEffect(() => {
    const feedNode = feedRef.current
    if (!feedNode) return undefined

    const handleWheel = (event) => {
      if (window.innerWidth <= 860) {
        return
      }

      event.preventDefault()
      if (wheelLockRef.current) {
        return
      }
      wheelLockRef.current = true
      handleNavigate(event.deltaY > 0 ? 1 : -1)
      setTimeout(() => {
        wheelLockRef.current = false
      }, 420)
    }

    feedNode.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      feedNode.removeEventListener('wheel', handleWheel)
    }
  }, [handleNavigate])

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault()
        handleNavigate(1)
      }
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault()
        handleNavigate(-1)
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
    }
  }, [handleNavigate])

  useEffect(() => {
    const nodes = itemRefs.current.filter(Boolean)
    if (!nodes.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index)
            setCurrentIndex(index)
            if (index >= videos.length - 2) {
              appendVideos()
            }
          }
        })
      },
      { threshold: 0.6 },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => {
      nodes.forEach((node) => observer.unobserve(node))
      observer.disconnect()
    }
  }, [appendVideos, videos])

  useEffect(() => {
    if (window.innerWidth <= 860) {
      document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const toggleMobileMenu = () => setIsMenuOpen((value) => !value)
  const closeMobileMenu = () => setIsMenuOpen(false)

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark">nyxx</div>
        <nav className="sidebar__menu">
          {mainMenu.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`sidebar__menu-item${item.isActive ? ' is-active' : ''}`}
            >
              <img src={item.icon} alt="" aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar__footer">
          <button type="button" className="sidebar__profile">
            <img src="/images/user.png" alt="" aria-hidden="true" />
            <span>Mon profil</span>
          </button>
          <button type="button" className="sidebar__menu-item">
            <img src="/images/option.png" alt="" aria-hidden="true" />
            <span>Paramètres</span>
          </button>
        </div>
      </aside>

      <main className="feed-area">
        <div className="mobile-top-bar">
          <div className="brand-mark">nyxx</div>
          <button type="button" className="mobile-hamburger" onClick={toggleMobileMenu} aria-label="Ouvrir le menu">
            <span />
          </button>
        </div>

        {isMenuOpen && <div className="panel-backdrop" onClick={closeMobileMenu} role="presentation" />}
        <aside className={`mobile-panel${isMenuOpen ? ' is-open' : ''}`}>
          <h3>Menu</h3>
          <nav>
            <a href="#faq" onClick={closeMobileMenu}>
              FAQ
            </a>
            <a href="#terms" onClick={closeMobileMenu}>
              Conditions d'utilisation
            </a>
            <a href="#sale" onClick={closeMobileMenu}>
              Conditions de vente
            </a>
          </nav>
          <div className="social-strip">
            <span className="social-pill x">X</span>
            <span className="social-pill ig">IG</span>
            <span className="social-pill reddit">R</span>
          </div>
        </aside>

        <div className="feed-scroll" ref={feedRef}>
          {videos.map((video, index) => (
            <article
              key={video.id}
              className="video-card"
              ref={(node) => {
                itemRefs.current[index] = node
              }}
              data-index={index}
            >
              <div className="video-wrapper">
                <div className="video-media">
                  <video
                    src={video.videoUrl}
                    muted
                    controls
                    preload="metadata"
                    poster="/images/NYXX - Feed.png"
                  />
                  <div className="video-overlay video-overlay--top">
                    <div className="category-chip">
                      <img src="/images/video.png" alt="" aria-hidden="true" />
                      <span>{video.category}</span>
                    </div>
                    <div className="price-tag">{video.price}</div>
                  </div>
                  <div className="video-overlay video-overlay--bottom">
                    <div className="creator-badge">
                      <div className="creator-avatar" style={{ background: video.accent }}>
                        {video.creator[0]}
                      </div>
                      <div className="creator-meta">
                        <strong>{video.creator}</strong>
                        <span>{video.handle}</span>
                      </div>
                    </div>
                    <div className="summary-card">
                      <p>{video.summary}</p>
                      <button type="button" className="buy-button">
                        <img src="/images/check.png" alt="" aria-hidden="true" />
                        Acheter la vidéo complète
                      </button>
                    </div>
                  </div>
                  <div className="video-floating-actions">
                    {quickReactions.map((reaction) => (
                      <div key={reaction.label} className="reaction-group">
                        <button type="button" className="reaction-button">
                          <img src={reaction.icon} alt="" aria-hidden="true" />
                        </button>
                        <span className="reaction-label">{reaction.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="tag-row">
                  {video.tags.map((tag) => (
                    <span key={`${video.id}-${tag}`} className="tag-pill">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <nav className="mobile-bottom-nav">
          {mainMenu.map((item) => (
            <button key={`mobile-${item.label}`} type="button" className="mobile-nav-item">
              <img src={item.icon} alt="" aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </main>

      <div className="right-rail">
        <button
          type="button"
          className="arrow-control"
          onClick={() => handleNavigate(-1)}
          disabled={currentIndex === 0}
        >
          <img src="/images/arrow-down-sign-to-navigate.png" alt="Vidéo précédente" style={{ transform: 'rotate(180deg)' }} />
        </button>
        <div className="progress-stack">
          {[currentIndex - 1, currentIndex, currentIndex + 1].map((index) => (
            <span key={`dot-${index}`} className={`progress-dot${index === currentIndex ? ' is-active' : ''}`} />
          ))}
        </div>
        <button type="button" className="arrow-control" onClick={() => handleNavigate(1)}>
          <img src="/images/arrow-down-sign-to-navigate.png" alt="Vidéo suivante" />
        </button>
      </div>
    </div>
  )
}

export default App
