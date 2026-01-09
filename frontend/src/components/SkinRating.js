import './RatingBox.css';

function SkinRating({ data }) {
  const ratings = {
    skin_tightness_rating: data.skin_tightness_rating,
    facial_fat_rating: data.facial_fat_rating,
    skin_texture_rating: data.skin_texture_rating,
    eyebag_rating: data.eyebag_rating
  };

  return (
    <div className="rating-box">
      <h3 className="rating-box-title">Skin Rating</h3>
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

export default SkinRating;
