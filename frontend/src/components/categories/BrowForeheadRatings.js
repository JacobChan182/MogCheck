import '../RatingBox.css';

function BrowForeheadRatings({ data }) {
  const ratings = {
    brow_position_rating: data.brow_position_rating,
    brow_arch_rating: data.brow_arch_rating,
    forehead_smoothness_rating: data.forehead_smoothness_rating,
    forehead_height_rating: data.forehead_height_rating,
    brow_symmetry_rating: data.brow_symmetry_rating
  };

  return (
    <div className="rating-box">
      <h3 className="rating-box-title">Brow/Forehead Ratings</h3>
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

export default BrowForeheadRatings;
