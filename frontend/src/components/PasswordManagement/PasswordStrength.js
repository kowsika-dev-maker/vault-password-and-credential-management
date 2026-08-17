import { useEffect, useState } from "react";

function PasswordStrength({ password }) {

    const [strength, setStrength] = useState("");
    const [score, setScore] = useState(0);

    useEffect(() => {

        if (!password) {
            setStrength("");
            setScore(0);
            return;
        }

        let currentScore = 0;

        if (password.length >= 8) {
            currentScore++;
        }

        if (password.length >= 12) {
            currentScore++;
        }

        if (/[A-Z]/.test(password)) {
            currentScore++;
        }

        if (/[a-z]/.test(password)) {
            currentScore++;
        }

        if (/[0-9]/.test(password)) {
            currentScore++;
        }

        if (/[^A-Za-z0-9]/.test(password)) {
            currentScore++;
        }

        setScore(currentScore);

        if (currentScore <= 2) {
            setStrength("Weak");
        } else if (currentScore <= 4) {
            setStrength("Medium");
        } else {
            setStrength("Strong");
        }

    }, [password]);

    if (!password) {
        return null;
    }

    return (

        <div className="password-strength">

            <p>
                Password Strength:
                <strong> {strength}</strong>
            </p>

            <div className="strength-bar">

                <div
                    className={`strength-progress strength-${strength.toLowerCase()}`}
                    style={{
                        width: `${(score / 6) * 100}%`
                    }}
                ></div>

            </div>

            <small>
                Use at least 12 characters with uppercase,
                lowercase, numbers and special characters.
            </small>

        </div>

    );
}

export default PasswordStrength;