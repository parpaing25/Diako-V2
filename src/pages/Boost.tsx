import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useCredits } from "../contexts/CreditContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

/**
 * Boost page allows users to spend credits to increase the visibility
 * of a post or a page. Packages are predefined with a number of
 * impressions and a cost in credits. Reaction credits while boosted
 * are reduced to 0.5 credit per like.
 */
const Boost = () => {
  const { user } = useUser();
  const { subtractCredits, refreshCredits } = useCredits();
  const [targetType, setTargetType] = useState("post");
  const [packageIndex, setPackageIndex] = useState(0);

  // Define boost packages; adjust pricing based on demand as needed
  const packages = [
    { name: "1 000 vues", cost: 100 },
    { name: "5 000 vues", cost: 450 },
    { name: "10 000 vues", cost: 850 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selected = packages[packageIndex];
    await subtractCredits(user.id, selected.cost, `boost:${targetType}`);
    await refreshCredits(user.id);
    alert(
      `Votre ${targetType === "post" ? "publication" : "page"} sera boostée pour ${selected.name}. Votre solde a été mis à jour.`
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Booster une publication ou une page</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">
            Utilisez vos crédits pour accroître la portée de votre
            contenu. Les réactions obtenues grâce au boost rapportent
            0,5 crédit par mention j'aime.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Que voulez‑vous booster&nbsp;?</Label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value)}
                className="w-full border rounded-md px-3 py-2 bg-background text-foreground"
              >
                <option value="post">Publication</option>
                <option value="page">Page</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Choisissez un forfait</Label>
              <select
                value={packageIndex}
                onChange={(e) => setPackageIndex(parseInt(e.target.value, 10))}
                className="w-full border rounded-md px-3 py-2 bg-background text-foreground"
              >
                {packages.map((pkg, idx) => (
                  <option key={idx} value={idx}>
                    {pkg.name} – {pkg.cost} crédits
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit">Booster</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Boost;