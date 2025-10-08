import './App.css'

const menuItems = [
  { label: 'Accueil', icon: '/images/home.png', isActive: true },
  { label: 'Creer', icon: '/images/add.png' },
  { label: 'Sauvegardés', icon: '/images/bookmark.png' },
  { label: 'Profil', icon: '/images/user.png' },
]

const actions = [
  { icon: '/images/video.png', value: '503', valuePlacement: 'top' },
  { icon: '/images/like.png', value: '45', valuePlacement: 'bottom' },
  { icon: '/images/silent.png', label: 'Mute', labelPlacement: 'right' },
  { icon: '/images/arrows.png' },
  { icon: '/images/bookmark.png' },
  { icon: '/images/option.png' },
]

const tags = ['Tag 1', 'Tag 2', 'Un tag plus long', 'Un tag plus long']

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__logo" aria-hidden="true">
          NYXX
        </div>
        <nav aria-label="Navigation principale" className="sidebar__menu">
          <ul>
            {menuItems.map((item) => (
              <li key={item.label}>
                <button
                  type="button"
                  className={`sidebar__menu-item${item.isActive ? ' is-active' : ''}`}
                >
                  <img src={item.icon} alt="" aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <section className="viewer" aria-label="Vidéo en avant">
        <div className="viewer__stage">
          <div className="viewer__canvas" aria-hidden="true" />
          <div className="viewer__details">
            <div className="viewer__header">
              <div className="viewer__identity">
                <span className="viewer__avatar" aria-hidden="true" />
                <div className="viewer__meta">
                  <span className="viewer__date">6 Oct, 2025</span>
                  <span className="viewer__name">
                    Katrine_
                    <img src="/images/check.png" alt="" aria-hidden="true" />
                  </span>
                </div>
              </div>
              <button type="button" className="viewer__cta">
                Acheter la vidéo complète 15€
              </button>
            </div>
            <p className="viewer__description">
              Une nouvelle vidéo pour vous montrer l’intérieur de ma maison...
              <span aria-hidden="true"> Plus</span>
            </p>
            <div className="viewer__tags">
              {tags.map((tag) => (
                <button key={tag} type="button">
                  {tag}
                </button>
              ))}
            </div>
            <span className="viewer__underline" aria-hidden="true" />
          </div>
        </div>
      </section>

      <aside className="action-rail" aria-label="Actions rapides">
        <ul>
          {actions.map((action, index) => (
            <li key={`${action.icon}-${index}`} className="action-rail__item">
              {action.value && action.valuePlacement === 'top' ? (
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
              {action.value && action.valuePlacement === 'bottom' ? (
                <span className="action-rail__value action-rail__value--bottom">{action.value}</span>
              ) : null}
              {action.label && action.labelPlacement !== 'right' ? (
                <span className="action-rail__label">{action.label}</span>
              ) : null}
            </li>
          ))}
        </ul>
      </aside>

      <div className="scroll-rail" aria-hidden="true">
        <button type="button" aria-label="Contenu précédent">
          <img src="/images/arrow-down-sign-to-navigate.png" alt="" />
        </button>
        <button type="button" aria-label="Contenu suivant">
          <img src="/images/arrow-down-sign-to-navigate.png" alt="" />
        </button>
      </div>
    </div>
  )
}

export default App
