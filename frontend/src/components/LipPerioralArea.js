import './RatingBox.css';

function LipPerioralArea({ data }) {
  const ratings = {
    lip_to_chin_rating: data.lip_to_chin_rating,
    cupid_bow_rating: data.cupid_bow_rating,
    maxilla_support_rating: data.maxilla_support_rating
  };

  return (
    <div className="rating-box">
      <h3 className="rating-box-title">Lip/Perioral Area</h3>
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

export default LipPerioralArea;
