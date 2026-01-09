import './RatingBox.css';

function EyeRatings({ data }) {
  const ratings = {
    canthal_tilt_rating: data.canthal_tilt_rating,
    eye_setness_rating: data.eye_setness_rating,
    eye_spacing_rating: data.eye_spacing_rating
  };

  return (
    <div className="rating-box">
      <h3 className="rating-box-title">Eye Ratings</h3>
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

export default EyeRatings;
