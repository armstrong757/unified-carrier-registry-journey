
import { useEffect, useRef } from "react";
import * as fabric from "fabric"; // Changed import syntax
import { Button } from "@/components/ui/button";

interface SignaturePadProps {
  onChange: (signature: string) => void;
}

const SignaturePad = ({ onChange }: SignaturePadProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.fabric.Canvas(canvasRef.current, { // Updated constructor call
      isDrawingMode: true,
      width: 400,
      height: 150,
      backgroundColor: 'white',
    });

    canvas.freeDrawingBrush.width = 2;
    canvas.freeDrawingBrush.color = "#000000";

    fabricRef.current = canvas;

    canvas.on('path:created', () => {
      if (canvas) {
        onChange(canvas.toDataURL());
      }
    });

    return () => {
      canvas.dispose();
    };
  }, [onChange]);

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
