import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Mic, Square } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { transcribeAudio } from "@/lib/resume-ai.functions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export function VoiceInputButton({ onTranscript, className }: VoiceInputButtonProps) {
  const transcribe = useServerFn(transcribeAudio);
  const { premium } = useEntitlements();
  const [showUpsell, setShowUpsell] = useState(false);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);


  const stop = () => {
    recorderRef.current?.stop();
    setRecording(false);
  };

  const start = async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      toast.error("Spracheingabe wird von diesem Gerät nicht unterstützt.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        if (blob.size === 0) return;
        setLoading(true);
        try {
          const buffer = await blob.arrayBuffer();
          let binary = "";
          const bytes = new Uint8Array(buffer);
          for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]!);
          const base64 = btoa(binary);
          const result = await transcribe({
            data: { audioBase64: base64, mimeType: blob.type || "audio/webm" },
          });
          if (result.text?.trim()) {
            onTranscript(result.text.trim());
            toast.success("Transkription eingefügt");
          } else {
            toast.error("Keine Sprache erkannt. Bitte erneut versuchen.");
          }
        } catch {
          toast.error("Transkription fehlgeschlagen. Bitte tippe den Text ein.");
        } finally {
          setLoading(false);
        }
      };
      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
    } catch {
      toast.error("Mikrofonzugriff verweigert.");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      type="button"
      className={cn("h-8 w-8", className)}
      disabled={loading}
      title={recording ? "Aufnahme beenden" : "Spracheingabe (Darija, Arabisch, Französisch, Deutsch)"}
      onClick={recording ? stop : start}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : recording ? (
        <Square className="h-4 w-4 text-destructive" />
      ) : (
        <Mic className="h-4 w-4 text-muted-foreground" />
      )}
    </Button>
  );
}
