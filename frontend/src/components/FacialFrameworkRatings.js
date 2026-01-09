import './RatingBox.css';

function FacialFrameworkRatings({ data }) {
  const ratings = {
    facial_symmetry_rating: data.facial_symmetry_rating,
    facial_thirds_rating: data.facial_thirds_rating,
    facial_growth_rating: data.facial_growth_rating,
    fWHR_rating: data.fWHR_rating
  };

  return (
    <div className="rating-box">
      <h3 className="rating-box-title">Facial Framework Ratings</h3>
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

export default FacialFrameworkRatings;
