import { useEffect, useState } from "react";
import { Image as KonvaImage } from "react-konva";
import Field from "./Soccer_Field.png";
import { FIELD_HEIGHT, FIELD_WIDTH } from "../consts";

export default function FieldImage({
  x = 0,
  y = 0,
}: {
  x?: number;
  y?: number;
}) {
  const [image, setImage] = useState<HTMLImageElement | undefined>();

  useEffect(() => {
    const existingImage = document.querySelector(`#field_background_image`);
    if (existingImage) {
      setImage(existingImage as HTMLImageElement);
    } else {
      const img = new Image();
      img.src = Field.src;
      img.onload = () => {
        setImage(img);
      };
      img.onerror = () => {
        setImage(undefined);
      };

      img.id = `field_background_image`;
      img.style.display = "none";
      document.body.append(img);
    }
  }, []);

  return (
    <KonvaImage
      id={`field_background_image`}
      alt={`field_background_image`}
      image={image}
      x={x + FIELD_WIDTH}
      y={y}
      width={FIELD_HEIGHT}
      height={FIELD_WIDTH}
      rotation={90}
    />
  );
}
