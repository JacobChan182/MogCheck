import './RatingBox.css';

function MidfaceRatings({ data }) {
  const ratings = {
    midface_length_rating: data.midface_length_rating,
    maxillary_projection_rating: data.maxillary_projection_rating,
    under_eye_support_rating: data.under_eye_support_rating
  };

  return (
    <div className="rating-box">
      <h3 className="rating-box-title">Midface Ratings</h3>
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

export default MidfaceRatings;
