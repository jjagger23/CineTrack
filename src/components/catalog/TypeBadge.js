export default function TypeBadge({ type }) {
  return <span className={type === 'Movie' ? 'badge-film' : 'badge-series'}>{type === 'Movie' ? 'FILM' : 'SERIES'}</span>;
}
