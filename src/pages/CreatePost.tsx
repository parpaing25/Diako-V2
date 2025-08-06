import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../firebase";


const CreatePost = () => {
  const { user } = useUser();
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [location, setLocation] = useState("");
  const [mood, setMood] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setUploading(true);

    let imageUrl = "";
    if (file) {
      // Upload image via backend upload script
      const formData = new FormData();
      formData.append("image", file);
      formData.append("user_id", user.id);
      const res = await fetch(`/backend/upload.php`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        imageUrl = `/backend/uploads/${data.filename}`;
      } else {
        alert(data.error || "Échec de l'envoi de l'image.");
      }
    }
    // Save post in Firestore
    await addDoc(collection(db, "posts"), {
      text,
      image: imageUrl || null,
      userId: user.id,
      createdAt: Timestamp.now(),
      location: location || null,
      mood: mood || null,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
    });
    setText("");
    setFile(null);
    setLocation("");
    setMood(undefined);
    setTags("");
    setUploading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-xl mx-auto">
      <textarea
        placeholder="Partager quelque chose..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full border rounded-md p-2"
        rows={4}
      />
      <div>
        <label className="block text-sm mb-1">Ajouter une photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Lieu</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border rounded-md p-2"
          placeholder="Ex: Antananarivo"
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Humeur</label>
        <select
          value={mood ?? ""}
          onChange={(e) => setMood(e.target.value || undefined)}
          className="w-full border rounded-md p-2"
        >
          <option value="">-- Sélectionner --</option>
          <option value="heureux">Heureux</option>
          <option value="excité">Excité</option>
          <option value="curieux">Curieux</option>
          <option value="détendu">Détendu</option>
        </select>
      </div>
      <div>
        <label className="block text-sm mb-1">Taguer des amis (séparés par des virgules)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full border rounded-md p-2"
          placeholder="Ex: ami1, ami2"
        />
      </div>
      <button
        type="submit"
        disabled={uploading}
        className="bg-travel-blue text-white px-4 py-2 rounded"
      >
        {uploading ? "Publication..." : "Publier"}
      </button>
    </form>
  );
};

export default CreatePost;
