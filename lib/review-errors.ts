// Only these user-facing messages may leave the reviews API or reach the UI.
// Never display a database, network, JSON parser or browser exception verbatim.
export const REVIEW_UNAVAILABLE = 'Impossible d’envoyer votre avis pour le moment. Vérifiez votre connexion puis réessayez.';

const messages = new Set([
  REVIEW_UNAVAILABLE,
  'Origine refusée',
  'Envoi trop volumineux.',
  'Formulaire manquant',
  'Envoi refusé.',
  'Consentement requis.',
  'Prénom, note et commentaire valides requis.',
  '5 photos maximum.',
  'Veuillez patienter avant un nouvel avis.',
  'Photo non valide (JPEG, PNG ou WebP, 650 Ko maximum après préparation).',
  'Format photo invalide',
  'Photo trop volumineuse',
  'Envoi photo impossible. Réessayez.',
  'Format photo non accepté.',
  'Cette photo est vide. Sélectionnez son original dans Photos.',
  'Cette photo dépasse 15 Mo. Exportez une version plus petite depuis Photos.',
  'La préparation de cette photo prend trop de temps. Réessayez ou exportez-la en JPEG depuis Photos.',
  'Impossible de préparer cette photo. Réessayez ou exportez-la en JPEG depuis Photos.',
  'Impossible de réduire suffisamment cette photo. Exportez une version plus petite depuis Photos.',
  'Impossible de réduire cette photo. Réessayez ou exportez-la en JPEG depuis Photos.',
  'Ce navigateur ne peut pas préparer la photo. Mettez Safari à jour puis réessayez.',
  'Photo illisible ou format non pris en charge. Choisissez un JPEG, PNG ou HEIC/HEIF original, ou exportez-la en JPEG depuis Photos.',
]);

export function reviewErrorMessage(error: unknown): string {
  return error instanceof Error && messages.has(error.message)
    ? error.message
    : REVIEW_UNAVAILABLE;
}
