import { Composition } from "remotion";
import { Promo } from "./Promo";

export const FPS = 30;

export const Root = () => (
  <>
    {/* Format vertical : TikTok, Reels, Shorts, stories */}
    <Composition id="Promo" component={Promo} durationInFrames={20 * FPS} fps={FPS} width={1080} height={1920} />
  </>
);
