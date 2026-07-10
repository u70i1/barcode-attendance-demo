import "./StudentCard.css";

function StudentCard({ name, nisn, time }) {
  return (
    <div className="student-card">
      <img className="card-img" src={`http://localhost:8000/photos/${nisn}.webp`} alt={nisn} />
      <div className="id-container">
        <h2 className="student-name">{name}</h2>
        <h3 className="student-nisn">{nisn}</h3>
      </div>
      <div className="time">{time}</div>
    </div>
  )
}

export default StudentCard;

