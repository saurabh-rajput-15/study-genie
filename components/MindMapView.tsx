import React, { useMemo } from 'react';
import ReactFlow, { MiniMap, Controls, Background, Node, Edge, Position } from 'reactflow';
import { MindMapData, MindMapNode } from '../types';

interface MindMapViewProps {
    mindMapData: MindMapData;
    onBack: () => void;
}

const levelColors = [
    { bg: '#ffffff', text: '#000000', border: '#ffffff' }, // Root - white
    { bg: 'rgba(168, 85, 247, 0.3)', text: '#e9d5ff', border: 'rgba(168, 85, 247, 0.6)' }, // Level 1 - purple
    { bg: 'rgba(59, 130, 246, 0.3)', text: '#bfdbfe', border: 'rgba(59, 130, 246, 0.6)' }, // Level 2 - blue
    { bg: 'rgba(34, 197, 94, 0.3)', text: '#bbf7d0', border: 'rgba(34, 197, 94, 0.6)' }, // Level 3 - green
    { bg: 'rgba(249, 115, 22, 0.3)', text: '#fed7aa', border: 'rgba(249, 115, 22, 0.6)' }, // Level 4 - orange
];

const getNodeStyle = (level: number) => {
    const colorIndex = Math.min(level, levelColors.length - 1);
    const colors = levelColors[colorIndex];
    return {
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style: {
            background: colors.bg,
            color: colors.text,
            border: `2px solid ${colors.border}`,
            borderRadius: '12px',
            padding: level === 0 ? '15px 25px' : '10px 15px',
            fontSize: level === 0 ? '18px' : '14px',
            fontWeight: level === 0 ? 'bold' : 'normal',
            maxWidth: '200px',
            textAlign: 'center' as const,
            boxShadow: level === 0 ? '0 0 20px rgba(255,255,255,0.3)' : '0 4px 12px rgba(0,0,0,0.3)',
        },
    };
};

// Calculate the total height needed for a subtree
const calculateSubtreeHeight = (node: MindMapNode, verticalSpacing: number): number => {
    if (!node.children || node.children.length === 0) {
        return verticalSpacing;
    }
    return node.children.reduce((total, child) => {
        return total + calculateSubtreeHeight(child, verticalSpacing);
    }, 0);
};

const transformDataToFlow = (
    data: MindMapNode, 
    parentId: string | undefined = undefined, 
    level = 0, 
    yStart = 0,
    nodeCounter = { count: 0 }
): { nodes: Node[], edges: Edge[], height: number } => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    const horizontalSpacing = 300;
    const verticalSpacing = 80;
    
    nodeCounter.count++;
    const nodeId = parentId ? `node-${nodeCounter.count}` : 'root';
    
    // Calculate height of this subtree
    const subtreeHeight = calculateSubtreeHeight(data, verticalSpacing);
    
    // Position this node in the middle of its subtree
    const nodeY = yStart + subtreeHeight / 2 - verticalSpacing / 2;
    
    const node: Node = {
        id: nodeId,
        data: { label: data.topic },
        position: { x: level * horizontalSpacing, y: nodeY },
        ...getNodeStyle(level)
    };
    nodes.push(node);

    if (parentId) {
        edges.push({
            id: `e-${parentId}-${nodeId}`,
            source: parentId,
            target: nodeId,
            type: 'smoothstep',
            animated: true,
            style: { 
                stroke: levelColors[Math.min(level, levelColors.length - 1)].border,
                strokeWidth: 2,
            }
        });
    }

    if (data.children && data.children.length > 0) {
        let currentY = yStart;
        data.children.forEach((child) => {
            const childResult = transformDataToFlow(child, nodeId, level + 1, currentY, nodeCounter);
            nodes.push(...childResult.nodes);
            edges.push(...childResult.edges);
            currentY += childResult.height;
        });
    }

    return { nodes, edges, height: subtreeHeight };
};

const MindMapView: React.FC<MindMapViewProps> = ({ mindMapData, onBack }) => {
    const { nodes, edges } = useMemo(() => transformDataToFlow(mindMapData.root), [mindMapData]);

    return (
        <div className="h-[75vh] w-full bg-black/30 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg relative">
             <button onClick={onBack} className="absolute top-4 left-4 z-10 bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                &larr; Back
            </button>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
            >
                <Controls />
                <MiniMap nodeColor={(node) => (node.id === 'root' ? '#fff' : 'rgba(255, 255, 255, 0.1)')} />
                <Background color="#444" gap={16} />
            </ReactFlow>
        </div>
    );
};

export default MindMapView;