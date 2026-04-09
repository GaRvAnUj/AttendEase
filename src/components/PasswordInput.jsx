import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({
  className = "form-input",
  disabled = false,
  id,
  ...props
}) {
  const generatedId = useId();
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || generatedId;

  return (
    <div className="password-input-wrap">
      <input
        {...props}
        id={inputId}
        disabled={disabled}
        type={showPassword ? "text" : "password"}
        className={`${className} password-input`}
      />
      <button
        type="button"
        className="password-toggle"
        aria-label={showPassword ? "Hide password" : "Show password"}
        aria-controls={inputId}
        aria-pressed={showPassword}
        disabled={disabled}
        onClick={() => setShowPassword((current) => !current)}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
