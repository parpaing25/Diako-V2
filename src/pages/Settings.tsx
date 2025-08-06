import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/RightSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useState } from "react";

/**
 * Settings page allows the user to update basic profile information
 * such as their display name as well as upload profile and cover
 * photos. The page demonstrates integration with the UserContext to
 * update local state and awards credits the first time the user
 * changes their photos via `markProfilePhotoChanged` and
 * `markCoverPhotoChanged`.
 */
const Settings = () => {
  const { user, updateName, markProfilePhotoChanged, markCoverPhotoChanged } = useUser();
  const [name, setName] = useState(user.name);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  // Upload a file to the PHP backend. Returns the uploaded filename
  // relative to the uploads directory. In a production environment
  // you'd likely integrate with Firebase Storage instead.
  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await fetch("/backend/upload.php", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    return result.filename as string;
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      updateName(name.trim());
    }
  };

  const handleProfileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileFile) return;
    await uploadFile(profileFile);
    markProfilePhotoChanged();
    setProfileFile(null);
  };

  const handleCoverUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverFile) return;
    await uploadFile(coverFile);
    markCoverPhotoChanged();
    setCoverFile(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-[var(--sidebar-width)] xl:mr-80 pt-[var(--header-height)]">
          <div className="p-6 space-y-6 max-w-xl mx-auto">
            <h2 className="text-xl font-semibold">Paramètres du compte</h2>
            {/* Name update form */}
            <form onSubmit={handleSaveName} className="space-y-3 border p-4 rounded-lg">
              <h3 className="font-medium">Mettre à jour le nom</h3>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom complet" />
              <Button type="submit">Sauvegarder</Button>
            </form>

            {/* Profile photo upload */}
            <form onSubmit={handleProfileUpload} className="space-y-3 border p-4 rounded-lg">
              <h3 className="font-medium">Photo de profil</h3>
              <input type="file" accept="image/*" onChange={(e) => setProfileFile(e.target.files?.[0] || null)} />
              <Button type="submit" disabled={!profileFile}>Téléverser</Button>
            </form>

            {/* Cover photo upload */}
            <form onSubmit={handleCoverUpload} className="space-y-3 border p-4 rounded-lg">
              <h3 className="font-medium">Photo de couverture</h3>
              <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} />
              <Button type="submit" disabled={!coverFile}>Téléverser</Button>
            </form>
          </div>
        </main>
        <RightSidebar />
      </div>
    </div>
  );
};

export default Settings;