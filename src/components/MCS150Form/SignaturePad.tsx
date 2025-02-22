
import { useEffect, useRef, useState } from "react";
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
  const drawingRef = useRef(false);
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

    // Initialize the brush with smoother settings
    const pencilBrush = new PencilBrush(canvas);
    pencilBrush.width = 2;
    pencilBrush.color = "#000000";
    pencilBrush.strokeLineCap = 'round';
    pencilBrush.strokeLineJoin = 'round';
    canvas.freeDrawingBrush = pencilBrush;

    // Track drawing state and update signature
    canvas.on('mouse:down', () => {
      drawingRef.current = true;
    });

    canvas.on('mouse:up', () => {
      drawingRef.current = false;
      // Only update signature if canvas has content
      if (!canvas.isEmpty()) {
        const dataUrl = canvas.toDataURL({
          format: 'png',
          quality: 1,
          multiplier: 1
        });
        onChange(dataUrl);
      }
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

  return (
    <div className="space-y-2">
      <div className="border rounded-md p-2 bg-white">
        <canvas ref={canvasRef} className="touch-none" />
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
