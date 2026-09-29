export default function RepoCard({ repo }) {
  return (
    <article className="card repo-card">
      <h3>
        <a href={repo.html_url} target="_blank" rel="noreferrer">
          {repo.name}
        </a>
      </h3>
      <p className="repo-card__desc">{repo.description ?? 'Sin descripción.'}</p>
      <footer className="repo-card__meta">
        {repo.language && <span className="tag">{repo.language}</span>}
        <span title="Estrellas">★ {repo.stargazers_count}</span>
        <span>
          Actualizado {new Date(repo.updated_at).toLocaleDateString('es-CL')}
        </span>
      </footer>
    </article>
  )
}
