import './RatingBox.css';

function MandibleRatings({ data }) {
  const ratings = {
    mandible_width_rating: data.mandible_width_rating,
    ramus_height_rating: data.ramus_height_rating
  };

  return (
    <div className="rating-box">
      <h3 className="rating-box-title">Mandible Ratings</h3>
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

export default MandibleRatings;
