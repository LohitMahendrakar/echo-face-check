import { useEffect, useRef } from "react";
import { FaceDetectionResult } from "@/services/api";

interface FaceBoxOverlayProps {
  results: FaceDetectionResult[];
  imageElement: HTMLImageElement;
}

export default function FaceBoxOverlay({ results, imageElement }: FaceBoxOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !imageElement) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match displayed image
    const rect = imageElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Calculate scale factors
    const scaleX = rect.width / imageElement.naturalWidth;
    const scaleY = rect.height / imageElement.naturalHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bounding boxes and labels
    results.forEach((result, index) => {
      const [x1, y1, x2, y2] = result.box;
      
      // Scale coordinates
      const scaledX1 = x1 * scaleX;
      const scaledY1 = y1 * scaleY;
      const scaledX2 = x2 * scaleX;
      const scaledY2 = y2 * scaleY;

      const width = scaledX2 - scaledX1;
      const height = scaledY2 - scaledY1;

      // Draw rectangle
      ctx.strokeStyle = '#3b82f6'; // Primary color
      ctx.lineWidth = 3;
      ctx.strokeRect(scaledX1, scaledY1, width, height);

      // Draw label background
      const label = result.name;
      const padding = 8;
      const fontSize = 14;
      ctx.font = `${fontSize}px sans-serif`;
      const textWidth = ctx.measureText(label).width;
      
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(
        scaledX1,
        scaledY1 - fontSize - padding * 2,
        textWidth + padding * 2,
        fontSize + padding * 2
      );

      // Draw label text
      ctx.fillStyle = '#ffffff';
      ctx.fillText(label, scaledX1 + padding, scaledY1 - padding);
    });
  }, [results, imageElement]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
