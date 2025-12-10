import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, RotateCcw, Check, X, ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface FaceVerificationProps {
  onVerified: (imageData: string, verified: boolean) => void;
  referencePhoto?: string;
  visitorName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const FaceVerification = ({ 
  onVerified, 
  referencePhoto, 
  visitorName,
  isOpen,
  onClose 
}: FaceVerificationProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean;
    confidence: number;
  } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    setIsLoading(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
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
        
        // If we have a reference photo, perform verification
        if (referencePhoto) {
          performVerification(imageData);
        } else {
          // No reference photo - first time capture
          setVerificationResult({ verified: true, confidence: 100 });
        }
      }
    }
  }, [referencePhoto]);

  const performVerification = async (capturedPhoto: string) => {
    setIsVerifying(true);
    
    // Simulate face verification process
    // In production, this would use an actual face recognition API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate verification result with high confidence for demo
    // Random confidence between 75-98% for realistic simulation
    const confidence = Math.floor(Math.random() * 23) + 75;
    const verified = confidence >= 80;
    
    setVerificationResult({ verified, confidence });
    setIsVerifying(false);
    
    if (verified) {
      toast.success(`Face verified with ${confidence}% confidence`);
    } else {
      toast.warning(`Face verification confidence low: ${confidence}%`);
    }
  };

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    setVerificationResult(null);
  }, []);

  const confirmCapture = useCallback(() => {
    if (capturedImage && verificationResult) {
      onVerified(capturedImage, verificationResult.verified);
      stopCamera();
      setCapturedImage(null);
      setVerificationResult(null);
      onClose();
    }
  }, [capturedImage, verificationResult, onVerified, stopCamera, onClose]);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      startCamera();
    } else {
      stopCamera();
      setCapturedImage(null);
      setVerificationResult(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Face Verification - {visitorName}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {referencePhoto && (
            <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
              <img
                src={referencePhoto}
                alt="Reference"
                className="w-16 h-16 object-cover rounded-lg border"
              />
              <div>
                <p className="text-sm font-medium">Reference Photo</p>
                <p className="text-xs text-muted-foreground">
                  Captured during registration
                </p>
              </div>
            </div>
          )}
          
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
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
            
            {isVerifying && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p>Verifying face...</p>
                </div>
              </div>
            )}
          </div>
          
          <canvas ref={canvasRef} className="hidden" />
          
          {verificationResult && (
            <div className={`p-4 rounded-lg border ${
              verificationResult.verified 
                ? "bg-green-500/10 border-green-500/20" 
                : "bg-yellow-500/10 border-yellow-500/20"
            }`}>
              <div className="flex items-center gap-3">
                {verificationResult.verified ? (
                  <ShieldCheck className="h-8 w-8 text-green-500" />
                ) : (
                  <ShieldAlert className="h-8 w-8 text-yellow-500" />
                )}
                <div>
                  <p className="font-medium">
                    {verificationResult.verified ? "Face Verified" : "Low Confidence Match"}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground">Confidence:</span>
                    <Badge variant={verificationResult.verified ? "default" : "secondary"}>
                      {verificationResult.confidence}%
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex gap-2 justify-center">
            {capturedImage ? (
              <>
                <Button variant="outline" onClick={retakePhoto}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake
                </Button>
                <Button 
                  onClick={confirmCapture} 
                  disabled={isVerifying}
                  variant={verificationResult?.verified ? "default" : "secondary"}
                >
                  <Check className="h-4 w-4 mr-2" />
                  {verificationResult?.verified ? "Confirm & Proceed" : "Proceed Anyway"}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={onClose}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={capturePhoto} disabled={!stream || isLoading}>
                  <Camera className="h-4 w-4 mr-2" />
                  Capture Face
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
