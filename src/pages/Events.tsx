import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "../contexts/UserContext";
import { useEvents } from "../contexts/EventContext";

/**
 * Page des événements. Permet aux utilisateurs de créer de nouveaux événements en précisant
 * le nom, la date, le lieu et une description optionnelle. À l'initialisation, la liste
 * des événements est chargée via le context `EventContext`. Chaque création appelle
 * l'API backend pour enregistrer l'événement puis rafraîchir la liste.
 */
const Events = () => {
  const { events, refreshEvents, createEvent } = useEvents();
  const { user } = useUser();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    refreshEvents();
  }, [refreshEvents]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date || !location.trim()) {
      alert("Veuillez renseigner le nom, la date et le lieu de l'événement.");
      return;
    }
    const startTime = new Date(date).toISOString();
    const created = await createEvent({
      name,
      description,
      location,
      start_time: startTime,
      creator_id: user.id,
    });
    if (!created) {
      alert("Une erreur est survenue lors de la création de l'événement.");
    }
    setName("");
    setDate("");
    setLocation("");
    setDescription("");
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Créer un événement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="event-name">Nom</Label>
              <Input
                id="event-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom de l'événement"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-date">Date</Label>
              <Input
                id="event-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-location">Lieu</Label>
              <Input
                id="event-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ville ou adresse"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-description">Description (facultatif)</Label>
              <Input
                id="event-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez brièvement l'événement"
              />
            </div>
            <Button type="submit">Créer l'événement</Button>
          </form>
        </CardContent>
      </Card>
      {events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Événements à venir</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {events.map((ev) => (
              <div key={ev.id} className="border rounded-md p-3">
                <h4 className="font-semibold">{ev.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(ev.start_time).toLocaleDateString()} – {ev.location}
                </p>
                {ev.description && (
                  <p className="text-sm mt-1">{ev.description}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Events;