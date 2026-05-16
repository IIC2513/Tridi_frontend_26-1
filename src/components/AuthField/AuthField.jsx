import "./AuthField.css";

export default function AuthField({
  label,
  type = "text",
  name,
  value,
  onChange,
  id,
  required = false,
  autoComplete,
  placeholder = "",
}) {
  const fieldId = id || name;

  return (
    <div className="authField">
      <label htmlFor={fieldId} className="authFieldLabel">
        {label}
      </label>
      <input
        id={fieldId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="authFieldInput"
      />
    </div>
  );
}