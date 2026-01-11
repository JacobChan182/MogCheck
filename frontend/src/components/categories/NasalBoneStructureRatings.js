import '../RatingBox.css';

function NasalBoneStructureRatings({ data }) {
  const ratings = {
    nasal_bridge_straightness_rating: data.nasal_bridge_straightness_rating,
    radix_height_rating: data.radix_height_rating,
    nasal_projection_rating: data.nasal_projection_rating,
    dorsal_hump_rating: data.dorsal_hump_rating
  };

  return (
    <div className="rating-box">
      <h3 className="rating-box-title">Nasal Bone Structure Ratings</h3>
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

export default NasalBoneStructureRatings;
