
import { useEffect, useRef } from "react";
import { Canvas } from "fabric"; // Import Canvas directly
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface SignaturePadProps {
  onChange: (signature: string) => void;
}

const SignaturePad = ({ onChange }: SignaturePadProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      isDrawingMode: true,
      width: isMobile ? 200 : 250, // Reduced width, even smaller on mobile
      height: 120, // Slightly reduced height for better proportions
      backgroundColor: 'white',
    });

    // Initialize canvas first
    canvas.renderAll();

    // Then set the brush properties
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = 2;
      canvas.freeDrawingBrush.color = "#000000";
    }

    fabricRef.current = canvas;

    canvas.on('path:created', () => {
      if (canvas) {
        onChange(canvas.toDataURL());
      }
    });

    return () => {
      canvas.dispose();
    };
  }, [onChange, isMobile]);

  const handleClear = () => {
    if (fabricRef.current) {
      fabricRef.current.clear();
      fabricRef.current.backgroundColor = 'white';
      fabricRef.current.renderAll();
      onChange('');
    }
  };

  return (
    <div className="space-y-2">
      <div className="border rounded-md p-2 bg-white flex justify-center">
        <canvas ref={canvasRef} className="max-w-full" />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Draw with mouse or finger</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClear}
        >
          Clear
        </Button>
      </div>
    </div>
  );
};

export default SignaturePad;
