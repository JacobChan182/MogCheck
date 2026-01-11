import '../RatingBox.css';

function Chin({ data }) {
  const ratings = {
    chin_projection_rating: data.chin_projection_rating,
    chin_alignment_rating: data.chin_alignment_rating
  };

  return (
    <div className="rating-box">
      <h3 className="rating-box-title">Chin</h3>
      <div className="rating-box-content">
        {Object.entries(ratings).map(([key, value]) => (
          <div key={key} className="rating-item">
            <span className="rating-variable">{key}:</span>
            <span className="rating-value">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chin;
