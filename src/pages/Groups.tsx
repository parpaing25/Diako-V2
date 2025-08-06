import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGroups } from "../contexts/GroupContext";
import { useUser } from "../contexts/UserContext";

/**
 * Page des groupes. Permet à un utilisateur de créer de nouveaux groupes et d'afficher la liste
 * des groupes auxquels il appartient. Lors du montage du composant, les groupes sont récupérés
 * via le context `GroupContext`. La création déclenche un appel au backend pour enregistrer
 * le groupe et rafraîchir l'état local.
 */
const Groups = () => {
  const { groups, refreshGroups, createGroup } = useGroups();
  const { user } = useUser();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    refreshGroups(user.id);
  }, [refreshGroups, user.id]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Veuillez saisir un nom de groupe.");
      return;
    }
    const created = await createGroup(name, description, user.id);
    if (!created) {
      alert("Une erreur est survenue lors de la création du groupe.");
    }
    setName("");
    setDescription("");
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Card>
          <CardHeader>
            <CardTitle>Créer un groupe</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="group-name">Nom</Label>
                <Input
                  id="group-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nom du groupe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="group-description">Description</Label>
                <Input
                  id="group-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Une brève description"
                />
              </div>
              <Button type="submit">Créer</Button>
            </form>
          </CardContent>
      </Card>
      {groups.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mes groupes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {groups.map((group) => (
              <div key={group.id} className="border rounded-md p-3">
                <h4 className="font-semibold">{group.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {group.description || "Aucune description"}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Groups;