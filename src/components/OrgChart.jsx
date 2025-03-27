import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiChevronRight, FiZoomIn, FiZoomOut } from 'react-icons/fi';

const colorPalette = [
  'bg-blue-500', 'bg-yellow-500', 'bg-purple-500', 'bg-green-500', 'bg-red-500',
  'bg-pink-500', 'bg-teal-500', 'bg-orange-500', 'bg-indigo-500', 'bg-cyan-500'
];

const OrgChart = ({ employees }) => {
  const [expandedNodes, setExpandedNodes] = useState({});
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDetailedView, setIsDetailedView] = useState(false);
  const chartRef = useRef(null);

  // Toggle node expansion
  const toggleNode = (id) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Zoom functionality
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 1.5));
    if (zoomLevel >= 0.8) setIsDetailedView(true);
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.7));
    if (zoomLevel <= 0.9) setIsDetailedView(false);
  };

  // Build hierarchy
  const buildHierarchy = () => {
    const hierarchy = {};
    const rootNodes = [];

    employees.forEach((emp) => {
      hierarchy[emp.id] = { ...emp, children: [] };
    });

    employees.forEach((emp) => {
      if (emp.reportsTo) {
        hierarchy[emp.reportsTo]?.children.push(hierarchy[emp.id]);
      } else {
        rootNodes.push(hierarchy[emp.id]);
      }
    });

    return rootNodes;
  };

  // Draw connecting lines
  useEffect(() => {
    if (!chartRef.current) return;

    const drawLines = () => {
      const canvas = document.getElementById('org-chart-lines');
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;

      const nodes = chartRef.current.querySelectorAll('.org-node');
      nodes.forEach(node => {
        const parentRect = node.getBoundingClientRect();
        const parentX = parentRect.left + parentRect.width / 2;
        const parentY = parentRect.top + parentRect.height;

        const childrenContainer = node.nextElementSibling;
        if (childrenContainer && childrenContainer.classList.contains('children-container')) {
          const children = childrenContainer.querySelectorAll('.org-node');
          children.forEach(child => {
            const childRect = child.getBoundingClientRect();
            const childX = childRect.left + childRect.width / 2;
            const childY = childRect.top;

            // Calculate canvas coordinates
            const offsetLeft = chartRef.current.getBoundingClientRect().left;
            const offsetTop = chartRef.current.getBoundingClientRect().top;

            ctx.beginPath();
            ctx.moveTo(parentX - offsetLeft, parentY - offsetTop);
            ctx.lineTo(childX - offsetLeft, childY - offsetTop);
            ctx.stroke();
          });
        }
      });
    };

    // Wait for DOM to update before drawing lines
    const timer = setTimeout(drawLines, 100);
    return () => clearTimeout(timer);
  }, [expandedNodes, zoomLevel]);

  // Render tree nodes
  const renderTree = (nodes) => {
    return nodes.map((node, index) => (
      <div key={node.id} className="org-node flex flex-col items-center my-4 mx-4 relative">
        {/* Employee card */}
        <div
          className={`flex items-center w-64 p-4 rounded-xl text-white cursor-pointer shadow-lg border-2 border-gray-300 hover:shadow-2xl transition-all relative z-10
            ${colorPalette[index % colorPalette.length]}`}
          onClick={() => toggleNode(node.id)}
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center mr-3 font-bold text-lg">
            {node.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold">{node.name}</h3>
            <p className="text-sm">{node.position}</p>
            {isDetailedView && (
              <>
                <p className="text-xs opacity-90">{node.department} • {node.branch}</p>
                <p className="text-xs">{node.email}</p>
                <p className="text-xs">{node.phone}</p>
                <p className="text-xs">📅 {node.joinDate} • {node.status}</p>
              </>
            )}
          </div>
          {node.children.length > 0 && (
            <div className="ml-2">
              {expandedNodes[node.id] ? (
                <FiChevronDown size={18} />
              ) : (
                <FiChevronRight size={18} />
              )}
            </div>
          )}
        </div>

        {/* Children container */}
        {expandedNodes[node.id] && node.children.length > 0 && (
          <div className="children-container flex gap-8 mt-6 relative">
            {renderTree(node.children)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md border border-gray-300 overflow-auto relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Organizational Chart</h2>
        <div className="flex gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 bg-white rounded-md shadow hover:bg-gray-100"
            title="Zoom Out"
          >
            <FiZoomOut size={18} />
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 bg-white rounded-md shadow hover:bg-gray-100"
            title="Zoom In"
          >
            <FiZoomIn size={18} />
          </button>
        </div>
      </div>

      <div 
        ref={chartRef} 
        className="relative min-h-[500px] py-10"
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
      >
        {/* Canvas for drawing connecting lines */}
        <canvas 
          id="org-chart-lines" 
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
        />
        
        {/* Org chart content */}
        <div className="flex flex-col items-start gap-y-8 ml-10 relative" style={{ zIndex: 2 }}>
          {renderTree(buildHierarchy())}
        </div>
      </div>
    </div>
  );
};

export default OrgChart;