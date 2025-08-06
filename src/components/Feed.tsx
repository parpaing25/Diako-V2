import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Camera, MapPin, Users, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SponsoredPost from "./SponsoredPost";
import { useUser } from "../contexts/UserContext";
import { useCredits } from "../contexts/CreditContext";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

const Feed = () => {
  // Access user context to award credits on interactions.  We also access
  // the CreditContext to persist credit gains to the backend.  The
  // functions are renamed locally to avoid confusion.
  const { user, addCredits: addLocalCredits } = useUser();
  const { addCredits: addServerCredits } = useCredits();
  const [newPost, setNewPost] = useState("");

  // Posts state fetched from Firestore.  We define a minimal shape for
  // post data to avoid using `any` in state declarations.  Each post
  // must at least have an `id` (string) and can include arbitrary
  // additional fields returned from Firestore.
  interface PostData {
    id: string;
    [key: string]: unknown;
  }
  const [posts, setPosts] = useState<PostData[]>([]);

  useEffect(() => {
    // Listen for post updates in Firestore
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(fetched);
    });
    return () => unsubscribe();
  }, []);

  // Sponsored post data
  const sponsoredHotel = {
    hotel: {
      name: "Hôtel Sakamanga",
      avatar: "/placeholder-sakamanga.jpg",
      verified: true,
      location: "Antananarivo, Madagascar",
    },
    content: "Découvrez notre offre spéciale pour les fêtes ! Séjour de rêve au cœur de Tana avec petit-déjeuner inclus et spa gratuit 🏨✨",
    image: "/placeholder-sakamanga-room.jpg",
    offer: {
      price: "120 000 Ar",
      originalPrice: "180 000 Ar",
      type: "nuit",
    },
    rating: 4.8,
    reviews: 245,
    time: "Sponsorisé",
    likes: 45,
    comments: 12,
    shares: 8,
    liked: false,
    saved: false,
  };

  const handleLike = async (postId: string | number) => {
    // Logic to handle like action
    console.log(`Liked post ${postId}`);
    // Award 1 credit to the user when they like a post.  Update both
    // local state and backend.  We pass a reason string to the
    // backend for audit purposes.
    addLocalCredits(1);
    try {
      await addServerCredits(user.id, 1, "like");
    } catch (err) {
      console.error("Failed to persist credit gain", err);
    }
  };

  const handleSave = (postId: string | number) => {
    // Logic to handle save action
    console.log(`Saved post ${postId}`);
  };

  // Handle share action; award 2 credits
  const handleShare = async (postId: string | number) => {
    console.log(`Shared post ${postId}`);
    // Award 2 credits on share
    addLocalCredits(2);
    try {
      await addServerCredits(user.id, 2, "share");
    } catch (err) {
      console.error("Failed to persist credit gain", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Create Post */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Partagez votre expérience à Madagascar avec la communauté..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="border-none resize-none p-0 text-lg placeholder:text-muted-foreground focus-visible:ring-0"
                rows={3}
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-travel-blue">
                    <Camera className="w-4 h-4 mr-2" />
                    Photo
                  </Button>
                  <Button variant="ghost" size="sm" className="text-travel-green">
                    <MapPin className="w-4 h-4 mr-2" />
                    Lieu
                  </Button>
                  <Button variant="ghost" size="sm" className="text-travel-orange">
                    <Users className="w-4 h-4 mr-2" />
                    Amis
                  </Button>
                  <Button variant="ghost" size="sm" className="text-travel-purple">
                    <Smile className="w-4 h-4 mr-2" />
                    Humeur
                  </Button>
                </div>
                <Button 
                  disabled={!newPost.trim()} 
                  className="bg-primary hover:bg-primary-hover"
                >
                  Publier
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sponsored Hotel Post */}
      <SponsoredPost {...sponsoredHotel} />

      {/* Regular Posts */}
      {posts.map((rawPost) => {
        // Normalize fields between different schemas
        const content = (rawPost.content ?? rawPost.text ?? "") as string;
        const image = rawPost.image ?? rawPost.imageUrl ?? null;
        // Normalise les tags en tableau de chaînes.  Certains schémas
        // stockent les tags en tant que tableau d'inconnus ou de chaînes.
        const tags: string[] = Array.isArray(rawPost.tags)
          ? rawPost.tags.map((t: unknown) => String(t))
          : [];
        const location = rawPost.location as string | undefined;
        const mood = rawPost.mood as string | undefined;
        const likes = rawPost.likes ?? 0;
        const comments = rawPost.comments ?? 0;
        const shares = rawPost.shares ?? 0;
        const liked = rawPost.liked ?? false;
        const saved = rawPost.saved ?? false;
        const authorId = rawPost.userId ?? rawPost.authorId;
        const createdAt = rawPost.createdAt;
        const postKey: string | number = rawPost.id;
        return (
          <Card key={postKey} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarImage src={"/placeholder-user.jpg"} />
                    <AvatarFallback>{String(authorId ?? "U")[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="font-semibold">Utilisateur {authorId}</h4>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span>
                        {createdAt?.toDate
                          ? createdAt.toDate().toLocaleString()
                          : createdAt?.seconds
                          ? new Date(createdAt.seconds * 1000).toLocaleString()
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Signaler</DropdownMenuItem>
                    <DropdownMenuItem>Masquer</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="px-4 pb-3 space-y-2">
                {location && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {location}
                  </p>
                )}
                {mood && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Smile className="w-3 h-3" /> {mood}
                  </p>
                )}
                <p className="text-foreground whitespace-pre-line">{content}</p>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {image && (
                <div className="w-full">
                  <img
                    src={image}
                    alt="Post image"
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{likes} mentions j'aime</span>
                  <div className="flex gap-4">
                    <span>{comments} commentaires</span>
                    <span>{shares} partages</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(rawPost.id)}
                    className={`flex-1 gap-2 ${liked ? 'text-destructive' : ''}`}
                  >
                    <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} /> J'aime
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 gap-2">
                    <MessageCircle className="w-4 h-4" /> Commenter
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => handleShare(rawPost.id)}
                  >
                    <Share2 className="w-4 h-4" /> Partager
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSave(rawPost.id)}
                    className={saved ? 'text-primary' : ''}
                  >
                    <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default Feed;