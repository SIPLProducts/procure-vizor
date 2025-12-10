import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Camera, RotateCcw, Check, X } from "lucide-react";
import { toast } from "sonner";

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  label: string;
  currentImage?: string;
}

export const CameraCapture = ({ onCapture, label, currentImage }: CameraCaptureProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    setIsLoading(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 640, height: 480 },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Could not access camera. Please check permissions.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCapturedImage(null);
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg", 0.8);
        setCapturedImage(imageData);
      }
    }
  }, []);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
  }, []);

  const confirmCapture = useCallback(() => {
    if (capturedImage) {
      onCapture(capturedImage);
      stopCamera();
      setIsOpen(false);
      toast.success(`${label} captured successfully`);
    }
  }, [capturedImage, onCapture, stopCamera, label]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      startCamera();
    } else {
      stopCamera();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div className="flex flex-col items-center gap-2">
          {currentImage ? (
            <div className="relative">
              <img
                src={currentImage}
                alt={label}
                className="w-24 h-24 object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="absolute -bottom-2 -right-2 h-7 w-7 p-0"
              >
                <Camera className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button type="button" variant="outline" className="h-24 w-24 flex-col gap-1">
              <Camera className="h-6 w-6" />
              <span className="text-xs">{label}</span>
            </Button>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Capture {label}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                Loading camera...
              </div>
            )}
            {capturedImage ? (
              <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex gap-2 justify-center">
            {capturedImage ? (
              <>
                <Button variant="outline" onClick={retakePhoto}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake
                </Button>
                <Button onClick={confirmCapture}>
                  <Check className="h-4 w-4 mr-2" />
                  Use Photo
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={capturePhoto} disabled={!stream}>
                  <Camera className="h-4 w-4 mr-2" />
                  Capture
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
