import '../RatingBox.css';

function JawlineRatings({ data }) {
  const ratings = {
    sharpness_rating: data.sharpness_rating,
    gonial_angle_rating: data.gonial_angle_rating
  };

  return (
    <div className="rating-box">
      <h3 className="rating-box-title">Jawline Ratings</h3>
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

export default JawlineRatings;
