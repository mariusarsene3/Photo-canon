import { Composition } from "remotion";
import { Promo } from "./Promo";
import { PUB_DURATION, Pub } from "./Pub";
import { DEMO_DURATION, Demo } from "./Demo";

export const FPS = 30;

export const Root = () => (
  <>
    {/* Format vertical : TikTok, Reels, Shorts, stories */}
    <Composition id="Promo" component={Promo} durationInFrames={20 * FPS} fps={FPS} width={1080} height={1920} defaultProps={{ layout: "vertical" as const }} />
    {/* Format horizontal : site web, YouTube */}
    <Composition id="PromoWide" component={Promo} durationInFrames={20 * FPS} fps={FPS} width={1920} height={1080} defaultProps={{ layout: "wide" as const }} />
    {/* Publicité verticale pour les réseaux sociaux (TikTok, Reels, Stories) */}
    <Composition id="Pub" component={Pub} durationInFrames={PUB_DURATION} fps={FPS} width={1080} height={1920} />
    {/* Démo de la page d'accueil, dans la DA blanche du site */}
    <Composition id="Demo" component={Demo} durationInFrames={DEMO_DURATION} fps={FPS} width={1920} height={1080} />
  </>
);
