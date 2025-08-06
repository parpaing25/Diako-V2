import { ChangeEvent, useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { useCredits } from "../contexts/CreditContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Credits page displays the user's current credit balance and
 * provides a form to purchase new credits by uploading a payment
 * screenshot and entering a transaction reference. In this demo
 * version we do not integrate with a backend; purchases must be
 * validated manually by an administrator.
 */
const Credits = () => {
  const { user } = useUser();
  const { credits, refreshCredits } = useCredits();
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [reference, setReference] = useState("");
  const [method, setMethod] = useState("mvola");
  const [amountAr, setAmountAr] = useState("");

  // Refresh credit balance when the component mounts.  We use
  // useEffect rather than useState here because the intention is to
  // perform a side effect (fetching the current credit balance) when
  // the component is first rendered or when the user ID changes.  In
  // the original implementation a useState call was mistakenly used
  // which does not trigger side effects and had no state value to
  // store.  React’s useEffect hook runs the provided function after
  // the component has been committed to the DOM.
  useEffect(() => {
    refreshCredits(user.id);
  }, [refreshCredits, user.id]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setScreenshot(file);
  };

  // Submit payment: call backend payment.php
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(amountAr);
    if (isNaN(amount) || amount <= 0) {
      alert("Veuillez saisir un montant en Ariary.");
      return;
    }
    if (!screenshot || !reference) {
      alert("Veuillez fournir une capture d'écran et une référence.");
      return;
    }
    // Upload screenshot to the backend upload endpoint
    const formData = new FormData();
    formData.append("image", screenshot);
    formData.append("user_id", user.id);
    const uploadRes = await fetch(`/backend/upload.php`, {
      method: "POST",
      body: formData,
    });
    const uploadData = await uploadRes.json();
    if (!uploadData.success) {
      alert(uploadData.error || "Échec de l'envoi de l'image.");
      return;
    }
    // Call payment endpoint
    const res = await fetch(`/backend/payment.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, amount, service: method }),
    });
    const data = await res.json();
    if (data.success) {
      setScreenshot(null);
      setReference("");
      setAmountAr("");
      refreshCredits(user.id);
      alert("Votre paiement a été enregistré et vos crédits ont été mis à jour.");
    } else {
      alert(data.error || "Échec du paiement.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mon solde</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-bold">{credits} crédits</p>
          <p className="text-sm text-muted-foreground mt-2">1 crédit = 5 Ariary</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Acheter des crédits</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">
            Pour acheter des crédits, effectuez un virement via l'un des services mobiles suivants, puis téléversez la capture d'écran du transfert avec la référence et le montant en Ariary :
          </p>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Mvola : <strong>034 55 897 35</strong></li>
            <li>Airtel Money : <strong>033 71 063 34</strong></li>
            <li>Orange Money : <strong>032 47 041 43</strong></li>
          </ul>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="screenshot">Capture d'écran du paiement</Label>
              <Input id="screenshot" type="file" accept="image/*" onChange={handleFileChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Référence de transaction</Label>
              <Input id="reference" type="text" placeholder="N° de transaction" value={reference} onChange={(e) => setReference(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Montant (Ar)</Label>
              <Input id="amount" type="number" min="1" value={amountAr} onChange={(e) => setAmountAr(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">Service</Label>
              <select id="method" value={method} onChange={(e) => setMethod(e.target.value)} className="w-full border rounded-md px-3 py-2 bg-background text-foreground">
                <option value="orange">Orange Money</option>
                <option value="mvola">Mvola</option>
                <option value="airtel">Airtel Money</option>
              </select>
            </div>
            <Button type="submit">Envoyer</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Credits;