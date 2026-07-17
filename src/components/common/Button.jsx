export default function Button({ children, className = "", type = "button", onClick }) {
  return (
    <button type={type} className={className} onClick={onClick}>
      {children}
    </button>
  );
}
