import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const menuItems = [
  { label: 'Accueil', icon: '/images/home.png', isActive: true },
  { label: 'Créer', icon: '/images/add.png' },
  { label: 'Sauvegardés', icon: '/images/bookmark.png' },
  { label: 'Profil', icon: '/images/user.png' },
]

const legalLinks = [
  { label: 'FAQ', href: '#' },
  { label: "Conditions d'utilisation", href: '#' },
  { label: 'Conditions de vente', href: '#' },
]

const socialLinks = [
  { label: 'X', icon: '/images/twitter-x.svg', href: '#' },
  { label: 'Instagram', icon: '/images/instagram.svg', href: '#' },
  { label: 'Reddit', icon: '/images/reddit.svg', href: '#' },
]

const baseFeed = [
  {
    id: 'katrine-home-tour',
    creator: 'Katrine_',
    verified: true,
    avatarColor: '#f1ede7',
    date: '6 Oct, 2025',
    title: 'Visite guidée de ma maison',
    summary:
      "Une nouvelle vidéo pour vous montrer l’intérieur de ma maison. L'IA met en lumière les astuces rangement et les matières naturelles que j’utilise au quotidien.",
    tags: ['Maison', 'Deco', 'Lifestyle', 'Slow living'],
    price: 15,
    metrics: {
      views: 503,
      likes: 45,
      saves: 32,
    },
    poster: '/images/NYXX - Feed.png',
    accent: '#cc785c',
  },
  {
    id: 'coach-express',
    creator: 'MoveWithAri',
    verified: false,
    avatarColor: '#d9e5f9',
    date: '2 Oct, 2025',
    title: 'HIIT Express à la maison',
    summary:
      "Séance HIIT de 18 minutes sans matériel. Le résumé vous détaille les blocs d’intensité et les temps de récupération pour gagner du temps.",
    tags: ['Sport', 'HIIT', 'Express'],
    price: 12,
    metrics: {
      views: 1842,
      likes: 318,
      saves: 102,
    },
    gradient: 'linear-gradient(135deg, #0f6de2 0%, #73d0ff 100%)',
    accent: '#0f6de2',
  },
  {
    id: 'coach-nutrition',
    creator: 'ChefLina',
    verified: true,
    avatarColor: '#ffe9c2',
    date: '28 Sep, 2025',
    title: 'Batch cooking d’automne',
    summary:
      "Je prépare 5 repas équilibrés pour la semaine avec des produits de saison. L’IA fournit la liste de courses et le déroulé des recettes.",
    tags: ['Cuisine', 'Batch cooking', 'Meal prep'],
    price: 18,
    metrics: {
      views: 954,
      likes: 211,
      saves: 167,
    },
    gradient: 'linear-gradient(120deg, #f9a34d 0%, #ffecd8 100%)',
    accent: '#f68a1f',
  },
]

const numberFormatter = new Intl.NumberFormat('fr-FR')
const currencyFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

function PaymentModal({ item, onClose }) {
  return (
    <div
      className="payment-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Paiement"
      onClick={onClose}
    >
      <div className="payment-modal__card" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="payment-modal__close" onClick={onClose} aria-label="Fermer le module de paiement">
          <img src="/images/close.svg" alt="" aria-hidden="true" />
        </button>
        <div className="payment-modal__header">
          <span className="payment-modal__badge">Paiement sécurisé</span>
          <h2>Confirmer votre achat</h2>
          <p>
            Vous êtes sur le point de débloquer <strong>{item.title}</strong>. Le résumé généré par l’IA est inclus et vous pouvez télécharger la vidéo complète une fois le paiement effectué.
          </p>
        </div>
        <div className="payment-modal__summary">
          <div>
            <span className="payment-modal__label">Créatrice</span>
            <strong>{item.creator}</strong>
          </div>
          <div>
            <span className="payment-modal__label">Montant</span>
            <strong>{currencyFormatter.format(item.price)}</strong>
          </div>
        </div>
        <button type="button" className="payment-modal__checkout">
          Payer {currencyFormatter.format(item.price)}
        </button>
        <p className="payment-modal__legal">
          En poursuivant, vous acceptez nos <a href="#">conditions de vente</a> et la <a href="#">politique de remboursement</a>.
        </p>
      </div>
    </div>
  )
}

function MobileDrawer({ onClose }) {
  return (
    <div
      className="mobile-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Menu mobile"
      onClick={onClose}
    >
      <div className="mobile-drawer__card" onClick={(event) => event.stopPropagation()}>
        <div className="mobile-drawer__header">
          <span>Menu</span>
          <button type="button" onClick={onClose} aria-label="Fermer le menu">
            <img src="/images/close.svg" alt="" aria-hidden="true" />
          </button>
        </div>
        <nav className="mobile-drawer__nav" aria-label="Navigation principale">
          <ul>
            {menuItems.map((item) => (
              <li key={item.label}>
                <a href="#" className={item.isActive ? 'is-active' : undefined}>
                  <img src={item.icon} alt="" aria-hidden="true" />
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mobile-drawer__links">
          <h3>Informations</h3>
          <ul>
            {legalLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="mobile-drawer__social">
          <h3>Nous suivre</h3>
          <div>
            {socialLinks.map((social) => (
              <a key={social.label} href={social.href} aria-label={social.label}>
                <img src={social.icon} alt="" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [feedItems, setFeedItems] = useState(baseFeed)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const viewerRef = useRef(null)
  const batchRef = useRef(1)

  const activeItem = feedItems[activeIndex]

  const loadMore = useCallback(() => {
    setFeedItems((previous) => {
      const batchId = batchRef.current
      batchRef.current += 1
      const duplicates = baseFeed.map((item, index) => ({
        ...item,
        id: `${item.id}-${batchId}-${index}`,
        metrics: {
          views: item.metrics.views + batchId * 640 + index * 87,
          likes: item.metrics.likes + batchId * 42 + index * 9,
          saves: item.metrics.saves + batchId * 18 + index * 5,
        },
      }))
      return [...previous, ...duplicates]
    })
  }, [])

  useEffect(() => {
    if (activeIndex >= feedItems.length - 2) {
      loadMore()
    }
  }, [activeIndex, feedItems.length, loadMore])

  const handlePrev = useCallback(() => {
    setActiveIndex((index) => Math.max(0, index - 1))
  }, [])

  const handleNext = useCallback(() => {
    setActiveIndex((index) => Math.min(feedItems.length - 1, index + 1))
  }, [feedItems.length])

  useEffect(() => {
    const current = viewerRef.current
    if (!current) {
      return
    }

    const handleWheel = (event) => {
      event.preventDefault()
      if (event.deltaY > 6) {
        handleNext()
      } else if (event.deltaY < -6) {
        handlePrev()
      }
    }

    current.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      current.removeEventListener('wheel', handleWheel)
    }
  }, [handleNext, handlePrev])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        handleNext()
      }
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        handlePrev()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleNext, handlePrev])

  useEffect(() => {
    document.body.classList.toggle('is-locked', isPaymentOpen || isMobileMenuOpen)
    return () => {
      document.body.classList.remove('is-locked')
    }
  }, [isPaymentOpen, isMobileMenuOpen])

  const actions = useMemo(
    () => [
      {
        key: 'views',
        icon: '/images/video.png',
        value: numberFormatter.format(activeItem.metrics.views),
        label: 'Vues',
      },
      {
        key: 'likes',
        icon: '/images/like.png',
        value: numberFormatter.format(activeItem.metrics.likes),
        label: 'Likes',
      },
      {
        key: 'saves',
        icon: '/images/bookmark.png',
        value: numberFormatter.format(activeItem.metrics.saves),
        label: 'Sauvegardés',
      },
      {
        key: 'mute',
        icon: '/images/silent.png',
        label: 'Mute',
        labelPlacement: 'right',
      },
      {
        key: 'share',
        icon: '/images/arrows.png',
      },
      {
        key: 'more',
        icon: '/images/option.png',
      },
    ],
    [activeItem.metrics.likes, activeItem.metrics.saves, activeItem.metrics.views],
  )

  return (
    <div className={`app-shell${isMobileMenuOpen ? ' app-shell--drawer-open' : ''}`} style={{ '--accent-color': activeItem.accent }}>
      <aside className="sidebar">
        <div className="sidebar__logo" aria-hidden="true">
          NYXX
        </div>
        <nav aria-label="Navigation principale" className="sidebar__menu">
          <ul>
            {menuItems.map((item) => (
              <li key={item.label}>
                <button type="button" className={`sidebar__menu-item${item.isActive ? ' is-active' : ''}`}>
                  <img src={item.icon} alt="" aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sidebar__cta">
          <p>
            Uploadez vos vidéos, laissez l’IA générer le résumé et fixez votre prix. Chaque extrait est prêt à être monétisé.
          </p>
          <button type="button">Uploader une vidéo</button>
        </div>
      </aside>

      <main className="feed">
        <header className="feed__mobile-header">
          <span className="feed__mobile-logo">NYXX</span>
          <button type="button" aria-label="Ouvrir le menu" onClick={() => setIsMobileMenuOpen(true)}>
            <img src="/images/hamburger.svg" alt="" aria-hidden="true" />
          </button>
        </header>

        <article className="viewer" ref={viewerRef} aria-label="Flux vidéo">
          <div className="viewer__stage">
            <div
              className="viewer__canvas"
              style={
                activeItem.poster
                  ? { backgroundImage: `url(${activeItem.poster})` }
                  : { background: activeItem.gradient }
              }
              role="img"
              aria-label={activeItem.title}
            >
              <div className="viewer__overlay-badges">
                <span className="viewer__badge">Résumé généré par l’IA</span>
                <span className="viewer__badge viewer__badge--price">
                  Prix actuel : {currencyFormatter.format(activeItem.price)}
                </span>
              </div>
            </div>
            <div className="viewer__details">
              <div className="viewer__header">
                <div className="viewer__identity">
                  <span
                    className="viewer__avatar"
                    style={{ backgroundColor: activeItem.avatarColor }}
                    aria-hidden="true"
                  />
                  <div className="viewer__meta">
                    <span className="viewer__date">{activeItem.date}</span>
                    <span className="viewer__name">
                      {activeItem.creator}
                      {activeItem.verified ? <img src="/images/check.png" alt="" aria-hidden="true" /> : null}
                    </span>
                  </div>
                </div>
                <button type="button" className="viewer__cta" onClick={() => setIsPaymentOpen(true)}>
                  Acheter la vidéo complète {currencyFormatter.format(activeItem.price)}
                </button>
              </div>
              <div className="viewer__summary">
                <h3>{activeItem.title}</h3>
                <p>{activeItem.summary}</p>
              </div>
              <div className="viewer__tags">
                {activeItem.tags.map((tag) => (
                  <button key={tag} type="button">
                    {tag}
                  </button>
                ))}
              </div>
              <div className="viewer__insights">
                <span>Vendu {numberFormatter.format(activeItem.metrics.views)} fois</span>
                <span>Note moyenne 4,9 / 5</span>
              </div>
            </div>
          </div>
        </article>
      </main>

      <aside className="action-rail" aria-label="Actions rapides">
        <ul>
          {actions.map((action) => (
            <li key={action.key} className="action-rail__item">
              {action.value ? (
                <span className="action-rail__value action-rail__value--top">{action.value}</span>
              ) : null}
              <span
                className={`action-rail__icon${
                  action.labelPlacement === 'right' ? ' action-rail__icon--right' : ''
                }`}
              >
                <img src={action.icon} alt="" aria-hidden="true" />
                {action.label && action.labelPlacement === 'right' ? (
                  <span className="action-rail__label action-rail__label--right">{action.label}</span>
                ) : null}
              </span>
              {action.label && action.labelPlacement !== 'right' ? (
                <span className="action-rail__label">{action.label}</span>
              ) : null}
            </li>
          ))}
        </ul>
      </aside>

      <div className="scroll-rail" aria-label="Navigation dans le flux">
        <button type="button" aria-label="Contenu précédent" onClick={handlePrev} disabled={activeIndex === 0}>
          <img src="/images/arrow-down-sign-to-navigate.png" alt="" />
        </button>
        <button type="button" aria-label="Contenu suivant" onClick={handleNext}>
          <img src="/images/arrow-down-sign-to-navigate.png" alt="" />
        </button>
      </div>

      <nav className="mobile-nav" aria-label="Navigation mobile">
        <ul>
          {menuItems.map((item) => (
            <li key={`mobile-${item.label}`}>
              <button type="button" className={item.isActive ? 'is-active' : undefined}>
                <img src={item.icon} alt="" aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {isPaymentOpen ? <PaymentModal item={activeItem} onClose={() => setIsPaymentOpen(false)} /> : null}
      {isMobileMenuOpen ? <MobileDrawer onClose={() => setIsMobileMenuOpen(false)} /> : null}
    </div>
  )
}

export default App
