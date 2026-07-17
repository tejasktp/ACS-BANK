export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="backdrop visible" onClick={onClose}>
      <div className="content-card" onClick={(event) => event.stopPropagation()}>
        {title && <h2>{title}</h2>}
        {children}
      </div>
    </div>
  );
}
