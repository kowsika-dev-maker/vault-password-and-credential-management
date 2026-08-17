import { useState } from "react";
import "./PasswordManagement.css";

function PasswordGenerator({ onGenerate }) {

    const [length, setLength] = useState(16);

    const [useUppercase, setUseUppercase] = useState(true);
    const [useLowercase, setUseLowercase] = useState(true);
    const [useNumbers, setUseNumbers] = useState(true);
    const [useSpecial, setUseSpecial] = useState(true);

    const generatePassword = () => {

        let characters = "";

        if (useUppercase) {
            characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        }

        if (useLowercase) {
            characters += "abcdefghijklmnopqrstuvwxyz";
        }

        if (useNumbers) {
            characters += "0123456789";
        }

        if (useSpecial) {
            characters += "!@#$%^&*()_+-=[]{}|;:,.<>?";
        }

        if (characters.length === 0) {
            alert("Please select at least one character type");
            return;
        }

        let password = "";

        const randomValues = new Uint32Array(length);

        window.crypto.getRandomValues(randomValues);

        for (let i = 0; i < length; i++) {

            password +=
                characters[randomValues[i] % characters.length];

        }

        onGenerate(password);
    };

    return (

        <div className="password-generator">

            <h3>Password Generator</h3>

            <label>
                Password Length: {length}
            </label>

            <input
                type="range"
                min="8"
                max="32"
                value={length}
                onChange={(e) =>
                    setLength(Number(e.target.value))
                }
            />

            <div className="password-options">

                <label>
                    <input
                        type="checkbox"
                        checked={useUppercase}
                        onChange={(e) =>
                            setUseUppercase(e.target.checked)
                        }
                    />
                    Uppercase
                </label>

                <label>
                    <input
                        type="checkbox"
                        checked={useLowercase}
                        onChange={(e) =>
                            setUseLowercase(e.target.checked)
                        }
                    />
                    Lowercase
                </label>

                <label>
                    <input
                        type="checkbox"
                        checked={useNumbers}
                        onChange={(e) =>
                            setUseNumbers(e.target.checked)
                        }
                    />
                    Numbers
                </label>

                <label>
                    <input
                        type="checkbox"
                        checked={useSpecial}
                        onChange={(e) =>
                            setUseSpecial(e.target.checked)
                        }
                    />
                    Special Characters
                </label>

            </div>

            <button
                type="button"
                onClick={generatePassword}
            >
                Generate Password
            </button>

        </div>

    );
}

export default PasswordGenerator;