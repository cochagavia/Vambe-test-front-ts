import React, { useState, FormEvent, ChangeEvent } from "react";
import { signInWithEmailPassword, signUpWithEmailPassword } from "../firebase/auth";
import calendarIllustration from "../assets/images2.png";
import { useNavigate } from "react-router-dom";
import "../styles/Login.styles.css";

interface AuthResult {
  operationType: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validatePassword = (pass: string): string[] => {
    const errors = [];
    if (pass.length < 8) {
      errors.push("La contraseña debe tener al menos 8 caracteres");
    }
    if (!/\d/.test(pass)) {
      errors.push("Debe incluir al menos un número");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) {
      errors.push("Debe incluir al menos un carácter especial");
    }
    if (!/[A-Z]/.test(pass)) {
      errors.push("Debe incluir al menos una letra mayúscula");
    }
    return errors;
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (isSignUp) {
      const errors = validatePassword(newPassword);
      setPasswordError(errors.join(". "));
    }
  };

  const handleEmailAuth = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (isSignUp) {
      const passwordErrors = validatePassword(password);
      if (passwordErrors.length > 0) {
        setPasswordError(passwordErrors.join(". "));
        return;
      }

      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
      }

      try {
        const result = await signUpWithEmailPassword(email, password);
        console.log("result", result);
        if (result.operationType === "signIn") {
          navigate("/google-auth");
        }
      } catch (err: any) {
        setError(err.message);
      }
    } else {
      try {
        const result = await signInWithEmailPassword(email, password);
        if (result.operationType === "signIn") {
          navigate("/google-auth");
        }
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-left">
          <div className="login-image">
            <img src={calendarIllustration} alt="Calendar Illustration" className="login-image" />
          </div>
          <h1>Organiza tu tiempo</h1>
          <p>Gestiona tus eventos de manera eficiente y profesional</p>
        </div>

        <div className="login-right">
          <div className="login-card">
            <div className="login-header">
              <h2>{isSignUp ? "Crear cuenta" : "Iniciar sesión"}</h2>
              <p className="subtitle">Gestiona tu calendario de manera eficiente</p>
            </div>

            <form onSubmit={handleEmailAuth} className="login-form">
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                {isSignUp && passwordError && <div className="password-requirements">{passwordError}</div>}
              </div>

              {isSignUp && (
                <div className="form-group">
                  <input
                    type="password"
                    placeholder="Confirmar contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              )}

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="submit-button" disabled={isSignUp && passwordError.length > 0}>
                {isSignUp ? "Crear cuenta" : "Iniciar sesión"}
              </button>
            </form>

            <div className="login-footer">
              <p>
                {isSignUp ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}
                <button className="toggle-button" onClick={() => setIsSignUp(!isSignUp)}>
                  {isSignUp ? "Iniciar sesión" : "Crear cuenta"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
