function PasswordSuggestions({ password }) {

    if (!password) {
        return null;
    }

    const suggestions = [];

    if (password.length < 12) {
        suggestions.push(
            "Use at least 12 characters."
        );
    }

    if (!/[A-Z]/.test(password)) {
        suggestions.push(
            "Add at least one uppercase letter."
        );
    }

    if (!/[a-z]/.test(password)) {
        suggestions.push(
            "Add at least one lowercase letter."
        );
    }

    if (!/[0-9]/.test(password)) {
        suggestions.push(
            "Add at least one number."
        );
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
        suggestions.push(
            "Add at least one special character."
        );
    }

    if (suggestions.length === 0) {

        return (

            <div className="password-suggestions success">

                <p>
                    ✓ Your password meets the recommended
                    security requirements.
                </p>

            </div>

        );
    }

    return (

        <div className="password-suggestions">

            <h4>Password Suggestions</h4>

            <ul>

                {suggestions.map((suggestion, index) => (

                    <li key={index}>
                        {suggestion}
                    </li>

                ))}

            </ul>

        </div>

    );
}

export default PasswordSuggestions;