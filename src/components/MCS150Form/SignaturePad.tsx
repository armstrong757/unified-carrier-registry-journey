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
    const canvas = new Canvas(canvasRef.current, {
      isDrawingMode: true,
      width: isMobile ? 300 : 400,
      height: 150,
      backgroundColor: 'white'
    });

    // Initialize the brush
    const pencilBrush = new PencilBrush(canvas);
    pencilBrush.width = 2;
    pencilBrush.color = "#000000";
    canvas.freeDrawingBrush = pencilBrush;

    // Add mouse events
    canvas.on('mouse:move', function (event) {
      const mouseEvent = event.e as MouseEvent;
      if (canvas.isDrawingMode && mouseEvent.buttons === 1) {
        canvas.renderAll();
      }
    });

    // Update signature data whenever the mouse is released
    canvas.on('mouse:up', () => {
      onChange(canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 1
      }));
    });
    fabricRef.current = canvas;

    // Clean up
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
  return <div className="space-y-2">
      <div className="border rounded-md p-2 bg-white">
        <canvas ref={canvasRef} className="touch-none" />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Draw your signature (mouse or finger)</span>
        <Button type="button" variant="outline" size="sm" onClick={handleClear}>
          Clear
        </Button>
      </div>
    </div>;
};
export default SignaturePad;