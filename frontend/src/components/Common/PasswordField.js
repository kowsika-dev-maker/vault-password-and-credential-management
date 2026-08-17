import { useState } from "react";
import "./Common.css";

function PasswordField({
    name,
    value,
    onChange,
    placeholder = "Password",
    required = true
}) {

    const [showPassword, setShowPassword] = useState(false);

    return (

        <div className="password-field">

            <input
                type={showPassword ? "text" : "password"}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
            />

            <button
                type="button"
                className="password-toggle"
                onClick={() =>
                    setShowPassword(!showPassword)
                }
            >
                {showPassword ? "Hide" : "Show"}
            </button>

        </div>

    );
}

export default PasswordField;