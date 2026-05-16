import "./Button.css";

export default function Button({
  children,
  type = "button",
  onClick,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  bgColor,
  hoverBgColor,
  textColor,
  className = "",
  style,
  ...rest
}) {
  const customStyle = {
    ...(bgColor && { "--btn-bg": bgColor }),
    ...(hoverBgColor && { "--btn-bg-hover": hoverBgColor }),
    ...(textColor && { "--btn-color": textColor }),
    ...style,
  };

  const classes = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? "btn--fullWidth" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      style={customStyle}
      {...rest}
    >
      {children}
    </button>
  );
}