import { useState } from 'react'
import RepoCard from '../components/RepoCard.jsx'
import { ErrorMessage, Loading } from '../components/Status.jsx'
import { useFetch } from '../hooks/useFetch.js'
import { GITHUB_PROFILE_URL, getLanguages, prepareRepos, reposUrl } from '../services/github.js'

export default function Portfolio() {
  const { data, error, loading } = useFetch(reposUrl())
  const [language, setLanguage] = useState('Todos')

  // Valores derivados: se calculan en cada render (React Compiler los memoriza por nosotros).
  const repos = data ? prepareRepos(data) : []
  const languages = ['Todos', ...getLanguages(repos)]
  const visible = language === 'Todos' ? repos : repos.filter((r) => r.language === language)

  return (
    <section>
      <header className="page-header">
        <h1>Portafolio</h1>
        <p className="lead">
          Repositorios públicos de{' '}
          <a href={GITHUB_PROFILE_URL} target="_blank" rel="noreferrer">github.com/donkiwicl</a>,
          obtenidos en vivo desde la API de GitHub.
        </p>
      </header>

      {loading && <Loading text="Cargando repositorios…" />}
      {error && <ErrorMessage error={error} />}

      {data && (
        <>
          <div className="filters" role="group" aria-label="Filtrar por lenguaje">
            {languages.map((lang) => (
              <button
                key={lang}
                type="button"
                className={lang === language ? 'chip chip--active' : 'chip'}
                aria-pressed={lang === language}
                onClick={() => setLanguage(lang)}
              >
                {lang}
              </button>
            ))}
          </div>
          <p className="muted">{visible.length} proyectos</p>
          <div className="grid grid--repos">
            {visible.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
