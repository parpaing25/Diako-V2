import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/RightSidebar";
import { useUser } from "@/contexts/UserContext";
import { db } from "@/firebase";
import { collection, query, where, orderBy, onSnapshot, type Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Profile page displays information about the current user including
 * their name, verification status and credits. It also lists the
 * user's posts fetched from Firestore. Links are provided to
 * verification and credits pages.
 */
// Define the shape of a user's post. Each post has an ID from Firestore,
// optional text and image fields, and a `createdAt` timestamp used for
// ordering. Avoid using `any` to satisfy the ESLint rule.
interface UserPost {
  id: string;
  userId: string;
  text?: string;
  image?: string;
  createdAt: Timestamp;
}

const Profile = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState<UserPost[]>([]);

  useEffect(() => {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("userId", "==", user.id), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => {
          const data = doc.data() as {
            userId: string;
            text?: string;
            image?: string;
            createdAt: Timestamp;
          };
          return { id: doc.id, ...data } as UserPost;
        })
      );
    });
    return () => unsub();
  }, [user.id]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-[var(--sidebar-width)] xl:mr-80 pt-[var(--header-height)]">
          <div className="p-6 space-y-6 max-w-3xl mx-auto">
            {/* User info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border p-4 rounded-lg">
              <img
                src="/placeholder-avatar.jpg"
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-1 flex items-center gap-2">
                  {user.name}
                  {user.verified && <Badge>Vérifié</Badge>}
                </h2>
                <p className="text-muted-foreground">{user.credits} crédits</p>
                <div className="mt-3 flex gap-3">
                  {!user.verified && (
                    <Link to="/verify" className="text-sm text-travel-blue underline">
                      Demander vérification
                    </Link>
                  )}
                  <Link to="/credits" className="text-sm text-travel-blue underline">
                    Acheter des crédits
                  </Link>
                </div>
              </div>
            </div>

            {/* User posts */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Mes publications</h3>
              {posts.length === 0 ? (
                <p>Aucune publication pour le moment.</p>
              ) : (
                posts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader>
                      <CardTitle className="text-base">
                        {new Date(post.createdAt.seconds * 1000).toLocaleDateString()}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {post.text && <p>{post.text}</p>}
                      {post.image && (
                        <img
                          src={post.image}
                          alt="Post image"
                          className="w-full h-64 object-cover rounded"
                        />
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>
        <RightSidebar />
      </div>
    </div>
  );
};

export default Profile;