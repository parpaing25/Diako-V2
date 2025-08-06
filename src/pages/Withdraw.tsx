import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useCredits } from "../contexts/CreditContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Withdraw page allows a verified user to request a payout of
 * accumulated credits to a mobile money account. The request is
 * simulated locally; an admin would process the payment in a real
 * application. The user must be verified and have enough credits.
 */
const Withdraw = () => {
  const { user } = useUser();
  const { subtractCredits, refreshCredits } = useCredits();
  const [amount, setAmount] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [method, setMethod] = useState("mvola");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseInt(amount, 10);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert("Veuillez saisir un montant valide en crédits.");
      return;
    }
    if (!mobileNumber.trim()) {
      alert("Veuillez saisir votre numéro de mobile money.");
      return;
    }
    if (!user.verified) {
      alert("Vous devez être vérifié pour retirer des crédits.");
      return;
    }
    // Vérifie que l'utilisateur dispose d'un solde suffisant avant la requête
    if (numericAmount > user.credits) {
      alert("Solde insuffisant pour cette demande de retrait.");
      return;
    }
    // Deduct credits via backend
    await subtractCredits(user.id, numericAmount, `withdraw:${method}:${mobileNumber}`);
    await refreshCredits(user.id);
    setAmount("");
    setMobileNumber("");
    alert(
      `Votre demande de retrait de ${numericAmount} crédits a été soumise. Un administrateur traitera le paiement vers ${mobileNumber} via ${method}.`
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Retirer mes crédits</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">
            Vous pouvez convertir vos crédits en Ariary et les
            recevoir via mobile money. 1 crédit = 5 Ar. Assurez-vous que
            votre compte est vérifié.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Montant en crédits</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">Méthode de paiement</Label>
              <select
                id="method"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full border rounded-md px-3 py-2 bg-background text-foreground"
              >
                <option value="mvola">Mvola</option>
                <option value="airtel">Airtel Money</option>
                <option value="orange">Orange Money</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Numéro</Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="Ex : 034 12 345 67"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </div>
            <Button type="submit">Demander un retrait</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Withdraw;