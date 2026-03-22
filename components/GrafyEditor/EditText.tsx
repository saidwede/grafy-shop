import React, { useEffect, useRef } from 'react';
import { Text, Transformer } from 'react-konva';
import Konva from 'konva';

interface EditTextProps {
  shapeProps: any;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newProps: any) => void;
  isEditingExternally?: boolean;
  onEditEnd?: () => void;
}

const EditText: React.FC<EditTextProps> = ({ shapeProps, isSelected, onSelect, onChange, isEditingExternally, onEditEnd }) => {
  const shapeRef = useRef<Konva.Text>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [isEditing, setIsEditing] = React.useState(false);



  useEffect(() => {
    if (isEditingExternally && !isEditing) {
      setIsEditing(true);
    }
  }, [isEditingExternally]);

  useEffect(() => {
    if (isEditing) {
      const node = shapeRef.current;
      if (!node) return;

      const stage = node.getStage();
      if (!stage) return;

      const textPosition = node.getAbsoluteTransform().point({ x: 0, y: 0 });
      const stageBox = stage.container().getBoundingClientRect();

      // Account for CSS scaling of the stage container
      const cssScaleX = stageBox.width / stage.width();
      const cssScaleY = stageBox.height / stage.height();

      const areaPosition = {
        x: stageBox.left + textPosition.x * cssScaleX + window.scrollX,
        y: stageBox.top + textPosition.y * cssScaleY + window.scrollY,
      };

      const textarea = document.createElement('textarea');
      textareaRef.current = textarea;
      document.body.appendChild(textarea);

      const absScale = node.getAbsoluteScale();

      textarea.value = node.text();
      textarea.style.position = 'absolute';
      textarea.style.top = areaPosition.y + 'px';
      textarea.style.left = areaPosition.x + 'px';
      textarea.style.width = (node.width() * absScale.x * cssScaleX + 20) + 'px';
      textarea.style.height = node.height() * absScale.y * cssScaleY + 'px';
      textarea.style.fontSize = node.fontSize() * absScale.y * cssScaleY + 'px';
      textarea.style.fontFamily = node.fontFamily();
      textarea.style.textAlign = node.align();
      textarea.style.color = node.fill() as string;
      textarea.style.border = 'none';
      textarea.style.padding = (node.padding() * cssScaleX) + 'px';
      textarea.style.margin = '0px';
      textarea.style.overflow = 'hidden';
      textarea.style.background = 'none';
      textarea.style.outline = 'none';
      textarea.style.resize = 'none';
      textarea.style.whiteSpace = 'pre';
      textarea.style.lineHeight = node.lineHeight().toString();
      const kFontStyle = node.fontStyle() || '';
      textarea.style.fontWeight = node.getAttr('fontWeight') || (kFontStyle.includes('bold') ? 'bold' : 'normal');
      textarea.style.fontStyle = kFontStyle.includes('italic') ? 'italic' : 'normal';
      textarea.style.textDecoration = node.textDecoration() || '';
      textarea.style.transformOrigin = 'left top';
      textarea.style.transform = `rotate(${node.rotation()}deg)`;

      textarea.focus();

      const removeTextarea = () => {
        textarea.parentNode?.removeChild(textarea);
        setIsEditing(false);
        if (onEditEnd) onEditEnd();
      };


      textarea.addEventListener('input', () => {
        node.text(textarea.value);
        node.getLayer()?.batchDraw();

        // Auto-resize textarea
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
        textarea.style.width = (node.width() * absScale.x * cssScaleX + 20) + 'px';
      });

      textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          removeTextarea();
        }
      });

      textarea.addEventListener('blur', () => {
        if (isEditing) {
          onChange({ ...shapeProps, text: textarea.value });
          removeTextarea();
        }
      });

      // Adjust initial height
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';

      return () => {
        if (textarea.parentNode) {
          textarea.parentNode.removeChild(textarea);
        }
        textareaRef.current = null;
      };
    }
  }, [isEditing, shapeProps, onChange]);

  // Finish editing if unselected
  useEffect(() => {
    if (!isSelected && isEditing && textareaRef.current) {
      onChange({ ...shapeProps, text: textareaRef.current.value });
      setIsEditing(false);
    }
  }, [isSelected, isEditing]);

  // Keep offsets centered
  useEffect(() => {
    if (shapeRef.current) {
      const node = shapeRef.current;
      const width = node.width();
      const height = node.height();
      if (shapeProps.offsetX !== width / 2 || shapeProps.offsetY !== height / 2) {
        onChange({
          ...shapeProps,
          offsetX: width / 2,
          offsetY: height / 2,
        });
      }
    }
  }, [shapeProps.text, shapeProps.fontSize, shapeProps.fontFamily, shapeProps.fontWeight, shapeProps.fontStyle]);

  return (
    <React.Fragment>
      <Text
        onClick={() => {
          if (isSelected) {
            setIsEditing(true);
          } else {
            onSelect();
          }
        }}
        onTap={() => {
          if (isSelected) {
            setIsEditing(true);
          } else {
            onSelect();
          }
        }}
        ref={shapeRef}
        {...shapeProps}
        fontStyle={`${shapeProps.fontStyle || ''} ${shapeProps.fontWeight || ''}`.trim() || 'normal'}
        opacity={isEditing ? 0 : 1}
        draggable={isSelected && !isEditing}
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

          // Calculate new font size
          const newFontSize = Math.max(5, node.fontSize() * scaleX);

          // Reset scale to 1 and update fontSize
          node.scaleX(1);
          node.scaleY(1);

          // Update offsets for the new size
          const newWidth = node.width();
          const newHeight = node.height();

          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            offsetX: newWidth / 2,
            offsetY: newHeight / 2,
            fontSize: newFontSize,
            rotation: node.rotation(),
          });
        }}
      />

    </React.Fragment>
  );
};

export default EditText;
