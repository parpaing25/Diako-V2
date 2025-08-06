import { TrendingUp, Calendar, Users, MapPin, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const RightSidebar = () => {
  const trendingDestinations = [
    { name: "Nosy Be", posts: "1.2k posts", trend: "+25%" },
    { name: "Andasibe-Mantadia", posts: "892 posts", trend: "+18%" },
    { name: "Avenue des Baobabs", posts: "756 posts", trend: "+32%" },
    { name: "Tsingy de Bemaraha", posts: "645 posts", trend: "+15%" },
    { name: "Île Sainte-Marie", posts: "523 posts", trend: "+28%" },
  ];

  const upcomingEvents = [
    {
      title: "Festival Donia - Nosy Be",
      date: "15 Déc 2024",
      participants: 89,
      type: "Festival"
    },
    {
      title: "Groupe Randonnée - Ankaratra",
      date: "22 Déc 2024",
      participants: 24,
      type: "Groupe"
    },
    {
      title: "Rencontre Voyageurs - Antananarivo",
      date: "28 Déc 2024",
      participants: 156,
      type: "Meetup"
    },
  ];

  const suggestedFriends = [
    {
      name: "Lanto Razafy",
      location: "Fianarantsoa, Madagascar",
      mutualFriends: 8,
      avatar: "/placeholder-lanto.jpg",
      travelStyle: "Culture"
    },
    {
      name: "Naina Rakoto",
      location: "Toamasina, Madagascar",
      mutualFriends: 5,
      avatar: "/placeholder-naina.jpg",
      travelStyle: "Plages"
    },
    {
      name: "Tahiry Andry",
      location: "Mahajanga, Madagascar",
      mutualFriends: 3,
      avatar: "/placeholder-tahiry.jpg",
      travelStyle: "Aventure"
    },
  ];

  const recommendedPlaces = [
    {
      name: "Hôtel Sakamanga",
      location: "Antananarivo, Madagascar",
      rating: 4.8,
      category: "Hôtel",
      reviews: 245
    },
    {
      name: "Ravintsara Wellness Hotel",
      location: "Andasibe, Madagascar",
      rating: 4.6,
      category: "Éco-lodge",
      reviews: 167
    },
    {
      name: "Parc National Andasibe",
      location: "Andasibe, Madagascar",
      rating: 4.9,
      category: "Attraction",
      reviews: 892
    },
  ];

  return (
    <aside className="fixed right-0 top-[var(--header-height)] h-[calc(100vh-var(--header-height))] w-80 bg-card border-l border-border overflow-y-auto hidden xl:block">
      <div className="p-4 space-y-6">
        {/* Trending Destinations */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-travel-orange" />
              Destinations tendance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {trendingDestinations.map((destination, index) => (
              <div key={destination.name} className="flex items-center justify-between hover:bg-muted p-2 rounded cursor-pointer">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">#{index + 1}</span>
                    <span className="text-sm font-medium">{destination.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{destination.posts}</p>
                </div>
                <Badge variant="secondary" className="text-xs text-travel-green">
                  {destination.trend}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-travel-blue" />
              Événements à venir
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.title} className="p-3 border rounded-lg hover:bg-muted cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium line-clamp-2">{event.title}</h4>
                  <Badge variant="outline" className="text-xs ml-2">
                    {event.type}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{event.date}</span>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{event.participants}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Suggested Friends */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-travel-green" />
              Suggestions d'amis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestedFriends.map((friend) => (
              <div key={friend.name} className="flex items-center gap-3 p-2 hover:bg-muted rounded">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={friend.avatar} />
                  <AvatarFallback>{friend.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{friend.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {friend.location}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {friend.mutualFriends} amis en commun • {friend.travelStyle}
                  </p>
                </div>
                <Button size="sm" variant="outline" className="text-xs">
                  Ajouter
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recommended Places */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="w-4 h-4 text-travel-purple" />
              Lieux recommandés
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendedPlaces.map((place) => (
              <div key={place.name} className="p-3 border rounded-lg hover:bg-muted cursor-pointer">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="text-sm font-medium line-clamp-1">{place.name}</h4>
                  <div className="flex items-center gap-1 ml-2">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs">{place.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                  <MapPin className="w-3 h-3" />
                  {place.location}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {place.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{place.reviews} avis</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </aside>
  );
};

export default RightSidebar;