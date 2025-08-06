// src/pages/Login.tsx
import { useState } from "react";
import { auth, initRecaptcha } from "../firebase";
import { signInWithEmailAndPassword, signInWithPhoneNumber, type ConfirmationResult } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"form" | "otp">("form");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const navigate = useNavigate();

  const handleLoginEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : String(err);
      alert(message || "Erreur de connexion");
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const recaptcha = initRecaptcha("recaptcha-login");
      const confirm = await signInWithPhoneNumber(auth, phone, recaptcha);
      setConfirmation(confirm);
      setStep("otp");
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : String(err);
      alert(message || "Erreur lors de l'envoi de l'OTP");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmation) return;
    try {
      await confirmation.confirm(otp);
      navigate("/");
    } catch (err: unknown) {
      console.error(err);
      alert("OTP invalide");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {step === "form" ? (
        <>
          <form onSubmit={handleLoginEmail} className="space-y-4">
            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block mb-1">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-md p-2"
              />
            </div>
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded w-full">Se connecter</button>
          </form>
          <hr className="my-4" />
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block mb-1">Téléphone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: +261341234567"
                className="w-full border rounded-md p-2"
              />
            </div>
            <div id="recaptcha-login"></div>
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded w-full">Envoyer OTP</button>
          </form>
          {/* Lien vers la page d'inscription */}
          <p className="mt-4 text-center text-sm">
            Pas encore de compte ?{' '}
            <a href="/register" className="text-travel-blue underline">
              Créer un compte
            </a>
          </p>
        </>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <p className="text-sm">Entrez le code OTP envoyé à {phone}</p>
          <div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded-md p-2"
            />
          </div>
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded w-full">Vérifier</button>
        </form>
      )}
    </div>
  );
}

export default Login;
