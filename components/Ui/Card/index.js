export default function Card({ title, children }) {
  return (
    <div className="card mb-5 border-0 shadow">
      <div className="card-header bg-white py-3 text-center fw-bold">
        {title}
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}
