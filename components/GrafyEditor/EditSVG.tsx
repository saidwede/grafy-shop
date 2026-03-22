import React, { useEffect, useRef } from 'react';
import { Path, Transformer } from 'react-konva';
import Konva from 'konva';

interface EditSVGProps {
  shapeProps: any;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newProps: any) => void;
}

const EditSVG: React.FC<EditSVGProps> = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef<Konva.Path>(null);  // Update offsets based on bounding box
  useEffect(() => {
    if (shapeRef.current) {
      const node = shapeRef.current;
      // For Path, we want to center it, so we use the local bounding box.
      const selfRect = node.getSelfRect();
      if (shapeProps.offsetX !== selfRect.x + selfRect.width / 2 || 
          shapeProps.offsetY !== selfRect.y + selfRect.height / 2) {
        onChange({
          ...shapeProps,
          offsetX: selfRect.x + selfRect.width / 2,
          offsetY: selfRect.y + selfRect.height / 2,
        });
      }
    }
  }, [shapeProps.data]);


  return (
    <React.Fragment>
      <Path
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          if (!node) return;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            scaleX: scaleX,
            scaleY: scaleY,
            rotation: node.rotation(),
          });
        }}
      />

    </React.Fragment>
  );
};

export default EditSVG;
