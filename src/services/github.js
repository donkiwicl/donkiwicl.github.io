// Datos y URLs relacionados con la cuenta de GitHub de DonKiwi.
export const GITHUB_USER = 'donkiwicl'
export const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USER}`
export const GITHUB_AVATAR_URL = `https://avatars.githubusercontent.com/${GITHUB_USER}`

const API = 'https://api.github.com'

export const userUrl = () => `${API}/users/${GITHUB_USER}`
export const reposUrl = () => `${API}/users/${GITHUB_USER}/repos?sort=updated&per_page=100`

/** Quita forks y ordena por estrellas (desc) y luego por fecha de actualización. */
export function prepareRepos(repos) {
  return repos
    .filter((repo) => !repo.fork)
    .toSorted(
      (a, b) =>
        b.stargazers_count - a.stargazers_count ||
        new Date(b.updated_at) - new Date(a.updated_at),
    )
}

/** Lista de lenguajes únicos presentes en los repositorios, en orden alfabético. */
export function getLanguages(repos) {
  return [...new Set(repos.map((repo) => repo.language).filter(Boolean))].sort()
}
