import "./index.css";
import { Composition } from "remotion";
import { TokyoCollage } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TokyoCollage"
        component={TokyoCollage}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
