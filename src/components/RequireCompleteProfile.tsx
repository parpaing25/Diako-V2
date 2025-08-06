import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

/**
 * RequireCompleteProfile ensures that the current user has
 * complété sa photo de profil et sa photo de couverture avant
 * d'accéder aux routes protégées. Si ce n'est pas le cas,
 * il redirige vers la page des paramètres pour forcer le
 * téléversement. Ce composant est utilisé comme wrapper
 * autour des pages nécessitant un profil complet.
 */
const RequireCompleteProfile = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  // Si l'utilisateur n'a pas changé sa photo de profil ou de couverture,
  // redirige vers la page des paramètres.
  if (!user.firstProfilePhotoChanged || !user.firstCoverPhotoChanged) {
    return <Navigate to="/settings" replace />;
  }
  return <>{children}</>;
};

export default RequireCompleteProfile;