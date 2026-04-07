import TypeBadge from './TypeBadge';

export default function ShowRow({ show, index, total, onClick }) {
  return (
    <div className={`show-row ${index < total - 1 ? 'showRowBordered' : ''}`} onClick={onClick}>
      <div className="showRowIndex">{String(index + 1).padStart(2, '0')}</div>
      <div className="showRowPosterWrap">
        {show.posterUrl && <img src={show.posterUrl} alt={show.title} className="showRowPosterImage" />}
      </div>
      <div className="showRowMain">
        <div className="showRowTitleRow">
          <span className="show-title showRowTitle">{show.title}</span>
          <TypeBadge type={show.type} />
          <span className="showRowYear">{show.releaseYear}</span>
        </div>
        <p className="showRowDescription">{show.description}</p>
        <div className="showRowGenreWrap">
          {show.genre.map(g => <span key={g} className="showRowGenreTag">{g}</span>)}
        </div>
      </div>
      {show.rating && (
        <div className="rating-box">
          <div className="val">{show.rating}</div>
          <div className="denom">/ 10</div>
          <div className="ratingBoxStar">⭐</div>
        </div>
      )}
    </div>
  );
}
