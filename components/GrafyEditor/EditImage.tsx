import React, { useEffect, useRef } from 'react';
import { Image, Transformer } from 'react-konva';
import useImage from 'use-image';
import Konva from 'konva';

interface EditImageProps {
  shapeProps: any;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newProps: any) => void;
}

const EditImage: React.FC<EditImageProps> = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef<Konva.Image>(null);

  const [image] = useImage(shapeProps.src, 'anonymous');



  // Adjust aspect ratio if image is loaded and props don't specify it
  useEffect(() => {
    if (image && !shapeProps.width) {
      const aspectRatio = image.width / image.height;
      const initialWidth = 150;
      const initialHeight = initialWidth / aspectRatio;
      onChange({
        ...shapeProps,
        width: initialWidth,
        height: initialHeight,
        offsetX: initialWidth / 2,
        offsetY: initialHeight / 2,
      });
    }
  }, [image]);

  return (
    <React.Fragment>
      <Image
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        image={image}
        draggable={isSelected}
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

          // Preserve flip sign and update width/height
          const absScaleX = Math.abs(scaleX);
          const absScaleY = Math.abs(scaleY);
          const flipX = scaleX < 0 ? -1 : 1;
          const flipY = scaleY < 0 ? -1 : 1;

          node.scaleX(flipX);
          node.scaleY(flipY);

          const newWidth = Math.max(5, node.width() * absScaleX);
          const newHeight = Math.max(5, node.height() * absScaleY);

          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: newWidth,
            height: newHeight,
            offsetX: newWidth / 2,
            offsetY: newHeight / 2,
            scaleX: flipX,
            scaleY: flipY,
            rotation: node.rotation(),
          });
        }}
      />

    </React.Fragment>
  );
};

export default EditImage;
