export class ImageManager {
  cachedImages: Record<string, HTMLImageElement> = {};

  constructor() {}

  async loadImages(
    urls: string[],
    onComplete: (loadedImages: Record<string, HTMLImageElement>) => void
  ) {
    const loadedImages: Record<string, HTMLImageElement> = {};

    for (const url of urls) {
      const response = await fetch(url);
      const svgText = await response.text();
      const svgBlob = new Blob([svgText], {
        type: "image/svg+xml;charset=utf-8",
      });
      const blobUrl = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.src = blobUrl;

      await new Promise<void>((resolve) => {
        img.onload = () => {
          loadedImages[url] = img;
          URL.revokeObjectURL(blobUrl); // Clean up the URL
          resolve();
        };
      });
    }
    this.cachedImages = loadedImages;

    onComplete(loadedImages);
  }
}
