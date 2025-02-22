
import { useEffect, useRef } from "react";
import { Canvas, PencilBrush } from "fabric";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface SignaturePadProps {
  onChange: (signature: string) => void;
}

const SignaturePad = ({
  onChange
}: SignaturePadProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!canvasRef.current) return;

    // Clear any existing canvas
    if (fabricRef.current) {
      fabricRef.current.dispose();
    }

    // Create new canvas with proper dimensions
    const canvas = new Canvas(canvasRef.current, {
      width: isMobile ? 300 : 400,
      height: 150,
      backgroundColor: 'white',
      isDrawingMode: true
    });

    // Configure the brush for smooth drawing
    const brush = new PencilBrush(canvas);
    brush.color = '#000000';
    brush.width = 2;
    canvas.freeDrawingBrush = brush;

    // Force an initial render
    canvas.renderAll();

    // Update signature whenever the canvas changes
    const updateSignature = () => {
      if (canvas.isEmpty()) {
        onChange('');
        return;
      }
      const dataUrl = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 1,
        enableRetinaScaling: true
      });
      onChange(dataUrl);
    };

    // Listen to all relevant events
    canvas.on('mouse:up', updateSignature);
    canvas.on('mouse:down', () => {
      canvas.renderAll();
    });
    canvas.on('mouse:move', () => {
      if (canvas.isDrawing) {
        canvas.renderAll();
      }
    });
    canvas.on('path:created', updateSignature);

    fabricRef.current = canvas;

    // Initial render
    canvas.renderAll();

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
      <div className="border rounded-md p-2 bg-white">
        <canvas ref={canvasRef} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Draw your signature (mouse or finger)</span>
        <Button type="button" variant="outline" size="sm" onClick={handleClear}>
          Clear
        </Button>
      </div>
    </div>
  );
};

export default SignaturePad;
