const CommentsIcon = ({ size = 30, className = "" }) => (
  <svg
    className={`icon-comments ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 110 110"
    width={size}
    height={size}
  >
    <g transform="translate(0,5) scale(0.9)"> 
      <path d="M96.875 50c0 25.844-21.031 46.875-46.875 46.875h-43.75
               c-1.281 0-2.438-.781-2.906-1.969s-.188-2.531.75-3.406l10.875-10.344
               C7.313 72.563 3.125 61.625 3.125 50
               3.125 24.156 24.156 3.125 50 3.125S96.875 24.156 96.875 50z"/>
    </g>
  </svg>
);

export default CommentsIcon;