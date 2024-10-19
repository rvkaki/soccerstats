import { removeBackground } from "@imgly/background-removal";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ImageNoBackground({
  src,
  alt,
  width,
  height,
  ...props
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
} & Parameters<typeof Image>[0]) {
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (src !== "") {
      setIsLoading(true);
      removeBackground(src).then((res) => {
        setUrl(URL.createObjectURL(res));
        setIsLoading(false);
      });
    }
  }, [src]);

  if (isLoading) {
    return (
      <Image src={src} alt={alt} width={width} height={height} {...props} />
    );
  }

  if (url) {
    return (
      <Image src={url} alt={alt} width={width} height={height} {...props} />
    );
  }

  return null;
}
