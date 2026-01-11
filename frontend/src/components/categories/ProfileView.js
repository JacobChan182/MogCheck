import '../RatingBox.css';

function ProfileView({ data }) {
  const ratings = {
    facial_convexity_rating: data.facial_convexity_rating,
    nose_lip_chin_harmony_rating: data.nose_lip_chin_harmony_rating,
    jaw_recession_rating: data.jaw_recession_rating,
    cervicomental_angle_rating: data.cervicomental_angle_rating
  };

  return (
    <div className="rating-box">
      <h3 className="rating-box-title">Profile View</h3>
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

export default ProfileView;
