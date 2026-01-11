import '../RatingBox.css';

function RatingBox({ title, ratings }) {
  return (
    <div className="rating-box">
      <h3 className="rating-box-title">{title}</h3>
      <div className="rating-box-content">
        {Object.entries(ratings).map(([key, value]) => (
          <div key={key} className="rating-item">
            <span className="rating-variable">{key}:</span>
            <span className="rating-value">{value === 101 ? 'N/A' : value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RatingBox;
