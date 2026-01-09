import './RatingBox.css';

function CheekboneRatings({ data }) {
  const ratings = {
    cheekbone_height_rating: data.cheekbone_height_rating,
    cheekbone_width_rating: data.cheekbone_width_rating,
    hollow_cheek_rating: data.hollow_cheek_rating
  };

  return (
    <div className="rating-box">
      <h3 className="rating-box-title">Cheekbone Ratings</h3>
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

export default CheekboneRatings;
