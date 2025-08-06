import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, MapPin, Star, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SponsoredPostProps {
  hotel: {
    name: string;
    avatar: string;
    verified: boolean;
    location: string;
  };
  content: string;
  image: string;
  offer: {
    price: string;
    originalPrice?: string;
    type: string;
  };
  rating: number;
  reviews: number;
  time: string;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
  saved: boolean;
}

const SponsoredPost: React.FC<SponsoredPostProps> = ({
  hotel,
  content,
  image,
  offer,
  rating,
  reviews,
  time,
  likes,
  comments,
  shares,
  liked,
  saved,
}) => {
  return (
    <Card className="overflow-hidden border-l-4 border-l-travel-orange">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage src={hotel.avatar} />
              <AvatarFallback>{hotel.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{hotel.name}</h4>
                {hotel.verified && (
                  <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground text-xs">✓</span>
                  </div>
                )}
                <Badge variant="outline" className="text-xs bg-travel-orange/10 text-travel-orange border-travel-orange">
                  <Building2 className="w-3 h-3 mr-1" />
                  Sponsorisé
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>{time}</span>
                <span>•</span>
                <MapPin className="w-3 h-3" />
                <span>{hotel.location}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span>{rating}</span>
                  <span>({reviews} avis)</span>
                </div>
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
              <DropdownMenuItem>Masquer cette publicité</DropdownMenuItem>
              <DropdownMenuItem>Signaler</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="px-4 pb-3">
          <p className="text-foreground">{content}</p>
        </div>

        {/* Hotel Image */}
        <div className="relative">
          <div className="aspect-video bg-gradient-to-br from-travel-blue to-travel-green"></div>
          <div className="absolute inset-0 bg-black/10"></div>
          {/* Offer Badge */}
          <div className="absolute top-4 left-4">
            <div className="bg-destructive text-destructive-foreground px-3 py-1 rounded-lg font-semibold">
              {offer.originalPrice && (
                <span className="line-through text-sm mr-2">{offer.originalPrice}</span>
              )}
              {offer.price} / {offer.type}
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {/* Call to Action */}
          <div className="flex gap-2">
            <Button className="flex-1 bg-primary hover:bg-primary-hover">
              Réserver maintenant
            </Button>
            <Button variant="outline" className="flex-1">
              Plus d'infos
            </Button>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3">
            <span>{likes} mentions j'aime</span>
            <div className="flex gap-4">
              <span>{comments} commentaires</span>
              <span>{shares} partages</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className={`flex-1 gap-2 ${liked ? 'text-destructive' : ''}`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              J'aime
            </Button>
            <Button variant="ghost" size="sm" className="flex-1 gap-2">
              <MessageCircle className="w-4 h-4" />
              Commenter
            </Button>
            <Button variant="ghost" size="sm" className="flex-1 gap-2">
              <Share2 className="w-4 h-4" />
              Partager
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={saved ? 'text-primary' : ''}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SponsoredPost;