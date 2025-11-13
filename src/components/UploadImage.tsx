import { useState, useRef } from "react";
import { Upload, X, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { recognizeFaces, FaceDetectionResult } from "@/services/api";
import FaceBoxOverlay from "./FaceBoxOverlay";
import { toast } from "sonner";

interface UploadImageProps {
  onRecognitionComplete?: (results: FaceDetectionResult[]) => void;
}

export default function UploadImage({ onRecognitionComplete }: UploadImageProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [results, setResults] = useState<FaceDetectionResult[]>([]);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResults([]);

      // Get image dimensions
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
      img.src = url;
    }
  };

  const handleRecognize = async () => {
    if (!selectedFile) return;

    setIsRecognizing(true);
    try {
      const response = await recognizeFaces(selectedFile);
      setResults(response.results);
      onRecognitionComplete?.(response.results);
      toast.success(`Recognized ${response.results.length} face(s)`);
    } catch (error) {
      console.error('Recognition error:', error);
      toast.error('Failed to recognize faces. Please try again.');
    } finally {
      setIsRecognizing(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResults([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Upload Classroom Image</h2>

      {!previewUrl ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">
            PNG, JPG up to 10MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden bg-muted">
            <img
              ref={imageRef}
              src={previewUrl}
              alt="Preview"
              className="w-full h-auto"
            />
            {results.length > 0 && imageRef.current && (
              <FaceBoxOverlay
                results={results}
                imageElement={imageRef.current}
              />
            )}
          </div>

          {results.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foreground">Recognized Faces:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-success" />
                      <span className="text-sm font-medium text-foreground">
                        {result.name}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Confidence: {(1.5 - result.score).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {results.length === 0 && (
              <Button
                onClick={handleRecognize}
                disabled={isRecognizing}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {isRecognizing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Recognizing...
                  </>
                ) : (
                  'Recognize Faces'
                )}
              </Button>
            )}
            <Button
              onClick={handleClear}
              variant="outline"
              className={results.length === 0 ? '' : 'flex-1'}
            >
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
