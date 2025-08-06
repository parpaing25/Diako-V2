// src/pages/Register.tsx
import { useState } from "react";
import { auth, initRecaptcha } from "../firebase";
import { createUserWithEmailAndPassword, signInWithPhoneNumber, PhoneAuthProvider, linkWithCredential } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "verify">("form");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create user with email & password
      await createUserWithEmailAndPassword(auth, email, password);
      // Initiate phone verification
      const recaptcha = initRecaptcha("recaptcha-container");
      const confirmation = await signInWithPhoneNumber(auth, phone, recaptcha);
      setVerificationId(confirmation.verificationId);
      setStep("verify");
    } catch (err: unknown) {
      // Ensure we do not use `any` for error handling. Attempt to extract
      // an error message when possible.
      console.error(err);
      let message = "";
      if (err instanceof Error) {
        message = err.message;
      }
      alert("Erreur lors de l'inscription : " + message);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationId) return;
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      if (auth.currentUser) {
        await linkWithCredential(auth.currentUser, credential);
      }
      // Après la vérification du téléphone, redirige l'utilisateur vers la page des paramètres
      // pour qu'il téléverse immédiatement sa photo de profil et de couverture.
      navigate("/settings");
    } catch (err: unknown) {
      console.error(err);
      alert("Code invalide. Veuillez réessayer.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {step === "form" ? (
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Téléphone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex: +261341234567"
              className="w-full border rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-md p-2"
              required
            />
          </div>
          <div id="recaptcha-container"></div>
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Inscription</button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4">
          <p className="text-sm">Un code OTP a été envoyé à {phone}. Veuillez entrer le code pour vérifier votre numéro.</p>
          <div>
            <label className="block mb-1">Code OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded-md p-2"
              required
            />
          </div>
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Vérifier</button>
        </form>
      )}
    </div>
  );
}

export default Register;
