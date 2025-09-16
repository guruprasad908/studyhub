// src/components/Card.jsx
export default function Card({ children, className = '' }) {
  return (
    <div className={`card-surface ${className} rounded-xl p-4 shadow-md`}>
      {children}
    </div>
  )
}
