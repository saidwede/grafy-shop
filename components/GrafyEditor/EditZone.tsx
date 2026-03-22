import React, { useRef, useEffect, useState } from 'react';
import { Group, Rect, Transformer, Line } from 'react-konva';
import Konva from 'konva';

interface EditZoneProps {
    zoneProps: {
        id: string;
        x: number;
        y: number;
        width: number;
        height: number;
    };
    isSelected: boolean;
    selectedId: string | null;
    onSelect: () => void;
    onChange: (newProps: any) => void;
    children: React.ReactNode;
}

const EditZone: React.FC<EditZoneProps> = ({ zoneProps, isSelected, selectedId, onSelect, onChange, children }) => {
    const shapeRef = useRef<Konva.Group>(null);
    const trRef = useRef<Konva.Transformer>(null);
    const elementTrRef = useRef<Konva.Transformer>(null);
    const [isDraggingNode, setIsDraggingNode] = useState(false);
    const [guides, setGuides] = useState<{ type: 'v' | 'h', pos: number }[]>([]);

    useEffect(() => {
        if (isSelected && trRef.current && shapeRef.current) {
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer()?.batchDraw();
        }
    }, [isSelected, zoneProps.width, zoneProps.height, zoneProps.x, zoneProps.y]);

    useEffect(() => {
        if (selectedId && selectedId !== zoneProps.id && elementTrRef.current && shapeRef.current) {
            const node = shapeRef.current.getStage()?.findOne('#' + selectedId);
            if (node) {
                elementTrRef.current.nodes([node]);
                elementTrRef.current.getLayer()?.batchDraw();
            }
        }
    }, [selectedId, children, zoneProps.id]);

    return (
        <React.Fragment>
            <Group
                id={zoneProps.id}
                ref={shapeRef}
                x={zoneProps.x}
                y={zoneProps.y}
                draggable={isSelected}
                clipX={0}
                clipY={0}
                clipWidth={zoneProps.width}
                clipHeight={zoneProps.height}
                onClick={(e) => {
                    if (e.target === shapeRef.current || e.target.className === 'Rect') {
                        onSelect();
                    }
                }}
                onTap={(e) => {
                    if (e.target === shapeRef.current || e.target.className === 'Rect') {
                        onSelect();
                    }
                }}
                onDragStart={() => {
                    setIsDraggingNode(true);
                }}
                onDragMove={(e) => {
                    const node = e.target;
                    const snapThreshold = 5;
                    const newGuides: { type: 'v' | 'h', pos: number }[] = [];

                    if (node === shapeRef.current) {
                        const stage = node.getStage();
                        if (!stage) return;

                        const centerX = node.x() + zoneProps.width / 2;
                        const centerY = node.y() + zoneProps.height / 2;

                        const stageCenterX = stage.width() / 2;
                        const stageCenterY = stage.height() / 2;

                        let newX = node.x();
                        let newY = node.y();

                        // Snap X
                        if (Math.abs(centerX - stageCenterX) < snapThreshold) {
                            newX = stageCenterX - zoneProps.width / 2;
                            newGuides.push({ type: 'v', pos: stageCenterX });
                        }

                        // Snap Y
                        if (Math.abs(centerY - stageCenterY) < snapThreshold) {
                            newY = stageCenterY - zoneProps.height / 2;
                            newGuides.push({ type: 'h', pos: stageCenterY });
                        }

                        node.x(newX);
                        node.y(newY);
                    } else if (node.parent === shapeRef.current) {
                        // Dragging a child element inside EditZone
                        const zoneCenterX = zoneProps.width / 2;
                        const zoneCenterY = zoneProps.height / 2;

                        let newX = node.x();
                        let newY = node.y();

                        // Snap X
                        if (Math.abs(node.x() - zoneCenterX) < snapThreshold) {
                            newX = zoneCenterX;
                            newGuides.push({ type: 'v', pos: zoneProps.x + zoneCenterX });
                        }

                        // Snap Y
                        if (Math.abs(node.y() - zoneCenterY) < snapThreshold) {
                            newY = zoneCenterY;
                            newGuides.push({ type: 'h', pos: zoneProps.y + zoneCenterY });
                        }

                        node.x(newX);
                        node.y(newY);
                    }

                    setGuides(newGuides);
                }}
                onDragEnd={(e) => {
                    setGuides([]);
                    setIsDraggingNode(false);
                    if (e.target !== shapeRef.current) return;
                    onChange({
                        ...zoneProps,
                        x: e.target.x(),
                        y: e.target.y(),
                    });
                }}
            >
                {/* Visual border of the zone */}
                <Rect
                    width={zoneProps.width}
                    height={zoneProps.height}
                    stroke="#D1D5DB"
                    strokeWidth={1}
                    dash={[5, 5]}
                    fill="transparent"
                    listening={true}
                />

                {/* Elements inside the zone */}
                {children}
            </Group>

            {isSelected && (
                <Transformer
                    ref={trRef}
                    visible={!isDraggingNode}
                    rotateEnabled={false}
                    anchorFill="#FFFFFF"
                    anchorStroke="#0096ff"
                    anchorStrokeWidth={2}
                    anchorSize={13}
                    anchorCornerRadius={7}
                    borderStroke="#0096ff"
                    borderStrokeWidth={1.5}
                    borderDash={[5, 5]}
                    enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center', 'middle-left', 'middle-right']}
                    boundBoxFunc={(oldBox, newBox) => {
                        if (Math.abs(newBox.width) < 50 || Math.abs(newBox.height) < 50) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                    onTransformEnd={() => {
                        const node = shapeRef.current;
                        if (!node) return;
                        const scaleX = node.scaleX();
                        const scaleY = node.scaleY();
                        node.scaleX(1);
                        node.scaleY(1);
                        onChange({
                            ...zoneProps,
                            x: node.x(),
                            y: node.y(),
                            width: Math.max(5, zoneProps.width * scaleX),
                            height: Math.max(5, zoneProps.height * scaleY),
                        });
                    }}
                />
            )}

            {selectedId && selectedId !== zoneProps.id && (
                <Transformer
                    ref={elementTrRef}
                    visible={!isDraggingNode}
                    anchorFill="#FFFFFF"
                    anchorStroke="#935af5"
                    anchorStrokeWidth={2}
                    anchorSize={14}
                    anchorCornerRadius={7}
                    borderStroke="#935af5"
                    borderStrokeWidth={1.5}
                    rotateAnchorOffset={25}
                    keepRatio={true}
                    enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                    boundBoxFunc={(oldBox, newBox) => {
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}

            {/* Render Guidelines */}
            {guides.map((g, i) => (
                <Line
                    key={i}
                    points={
                        g.type === 'v'
                            ? [g.pos, -5000, g.pos, 5000]
                            : [-5000, g.pos, 5000, g.pos]
                    }
                    stroke="#FF00FF"
                    strokeWidth={1}
                    dash={[4, 4]}
                    listening={false}
                />
            ))}
        </React.Fragment>
    );
};

export default EditZone;
