import { useRef, useState, useEffect, useCallback } from "react";
import { CiUndo } from "react-icons/ci";
import Tools from "../Tools/Tools";
import {
  useGetSingleDrawingsQuery,
  useUpdateDrawingMutation,
} from "../../services/appApi";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const Canvas = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [elements, setElements] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentElement, setCurrentElement] = useState(null);
  const [selectedShape, setSelectedShape] = useState("");
  const [selectedElementIndex, setSelectedElementIndex] = useState(null);
  const [initialMousePosition, setInitialMousePosition] = useState(null);

  //   --- update data send to server ---
  const { id } = useParams();

  // --- Get single drawing query ---
  const { data, refetch } = useGetSingleDrawingsQuery(id);

  // --- Update drawing query ---
  const [updateDrawing, { isLoading, isSuccess, isError }] =
    useUpdateDrawingMutation();

  // --- Single drawing value set functionality---
  useEffect(() => {
    const getElementsFromDB = data?.data?.elements;

    if (getElementsFromDB) {
      const normalizedElements = getElementsFromDB.map((element) => {
        if (
          element.elementType === "text" &&
          Array.isArray(element.coordinates[0])
        ) {
          return {
            ...element,
            coordinates: element.coordinates[0],
          };
        }
        return element;
      });

      setElements(normalizedElements);
    }
  }, [data]);

  // --- Mouse click down functionality ---
  const handleMouseDown = (e) => {
    const ctx = ctxRef.current;

    if (!ctx) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!selectedShape) {
      return;
    }

    if (selectedShape === "select") {
      const elementIndex = elements.findIndex((element) => {
        if (element.elementType === "line") {
          for (let i = 1; i < element.coordinates.length; i++) {
            const [x1, y1] = element.coordinates[i - 1];
            const [x2, y2] = element.coordinates[i];
            const dist = pointToLineDistance(x, y, x1, y1, x2, y2);
            if (dist < 5) return true;
          }
        } else if (element.elementType === "rectangle") {
          return (
            x > element.startX &&
            x < element.startX + element.width &&
            y > element.startY &&
            y < element.startY + element.height
          );
        } else if (element.elementType === "circle") {
          // circle selection logic
          const dist = Math.sqrt(
            (x - element.startX) ** 2 + (y - element.startY) ** 2
          );
          return dist < element.radius;
        } else if (element.elementType === "triangle") {
          // triangle selection logic
          return isPointInTriangle(x, y, element);
        } else if (element.elementType === "text") {
          // text selection logic
          const textMetrics = ctx.measureText(element.text);
          return (
            x > element.coordinates[0] &&
            x < element.coordinates[0] + textMetrics.width &&
            y > element.coordinates[1] - element.fontSize &&
            y < element.coordinates[1]
          );
        }
        return false;
      });

      if (elementIndex !== -1) {
        setSelectedElementIndex(elementIndex);
        setInitialMousePosition({ x, y });
      } else {
        setSelectedElementIndex(null);
      }

      return;
    }

    // set drawing based on shape
    if (selectedShape === "line") {
      setCurrentElement({
        elementType: "line",
        coordinates: [[x, y]],
        color: "#000",
        thickness: 1,
      });
    } else if (selectedShape === "rectangle") {
      setCurrentElement({
        elementType: "rectangle",
        startX: x,
        startY: y,
        width: 0,
        height: 0,
        color: "#000",
      });
    } else if (selectedShape === "circle") {
      setCurrentElement({
        elementType: "circle",
        startX: x,
        startY: y,
        radius: 0,
        color: "#000",
      });
    } else if (selectedShape === "triangle") {
      setCurrentElement({
        elementType: "triangle",
        startX: x,
        startY: y,
        color: "#000",
      });
    }

    setIsDrawing(true);
  };

  // --- Mouse move functionality ---
  const handleMouseMove = (e) => {
    if (selectedElementIndex !== null) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const dx = x - initialMousePosition.x;
      const dy = y - initialMousePosition.y;

      setElements((prevElements) =>
        prevElements.map((element, index) => {
          if (index === selectedElementIndex) {
            if (element.elementType === "line") {
              return {
                ...element,
                coordinates: element.coordinates.map(([cx, cy]) => [
                  cx + dx,
                  cy + dy,
                ]),
              };
            } else if (element.elementType === "rectangle") {
              return {
                ...element,
                startX: element.startX + dx,
                startY: element.startY + dy,
              };
            } else if (element.elementType === "circle") {
              return {
                ...element,
                startX: element.startX + dx,
                startY: element.startY + dy,
              };
            } else if (element.elementType === "triangle") {
              return {
                ...element,
                startX: element.startX + dx,
                startY: element.startY + dy,
                endX: element.endX + dx,
                endY: element.endY + dy,
              };
            } else if (element.elementType === "text") {
              return {
                ...element,
                coordinates: [
                  element.coordinates[0] + dx,
                  element.coordinates[1] + dy,
                ],
              };
            }
          }
          return element;
        })
      );

      setInitialMousePosition({ x, y });
      return;
    }

    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedShape === "line") {
      setCurrentElement((prevElement) => {
        const newElement = {
          ...prevElement,
          coordinates: [...prevElement.coordinates, [x, y]],
        };

        const lastCoord =
          newElement.coordinates[newElement.coordinates.length - 2];
        ctx.beginPath();
        ctx.moveTo(lastCoord[0], lastCoord[1]);
        ctx.lineTo(x, y);
        ctx.strokeStyle = newElement.color;
        ctx.lineWidth = newElement.thickness;
        ctx.stroke();

        return newElement;
      });
    } else if (selectedShape === "rectangle") {
      setCurrentElement((prevElement) => {
        const newElement = {
          ...prevElement,
          width: x - prevElement.startX,
          height: y - prevElement.startY,
        };

        ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas and redraw
        redrawElements(ctx);
        ctx.strokeStyle = newElement.color;
        ctx.strokeRect(
          newElement.startX,
          newElement.startY,
          newElement.width,
          newElement.height
        );

        return newElement;
      });
    } else if (selectedShape === "circle") {
      setCurrentElement((prevElement) => {
        const newElement = {
          ...prevElement,
          radius: Math.sqrt(
            (x - prevElement.startX) ** 2 + (y - prevElement.startY) ** 2
          ),
        };

        ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas and redraw
        redrawElements(ctx);
        ctx.beginPath();
        ctx.arc(
          newElement.startX,
          newElement.startY,
          newElement.radius,
          0,
          2 * Math.PI
        );
        ctx.strokeStyle = newElement.color;
        ctx.stroke();

        return newElement;
      });
    } else if (selectedShape === "triangle") {
      setCurrentElement((prevElement) => {
        const newElement = {
          ...prevElement,
          endX: x,
          endY: y,
        };

        ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas and redraw
        redrawElements(ctx);

        const { startX, startY, endX, endY } = newElement;
        const midX = (startX + endX) / 2;
        ctx.beginPath();
        ctx.moveTo(midX, startY); // top vertex
        ctx.lineTo(startX, endY); // bottom left vertex
        ctx.lineTo(endX, endY); // bottom right vertex
        ctx.closePath();
        ctx.strokeStyle = newElement.color;
        ctx.stroke();

        return newElement;
      });
    }
  };

  // --- Mouse release functionality ---
  const handleMouseUp = () => {
    if (selectedElementIndex !== null) {
      // Finalize move of selected element
      setSelectedElementIndex(null);
      setInitialMousePosition(null);
      return;
    }

    if (!isDrawing) return;
    setElements((prevElements) => [...prevElements, currentElement]);
    setCurrentElement(null);
    setIsDrawing(false);
  };

  // --- Add Text handler ---
  const handleAddText = () => {
    const text = prompt("Enter text:");
    if (!text) return;
    const newText = {
      elementType: "text",
      coordinates: [100, 100],
      text: text,
      fontSize: 16,
    };

    setElements((prevElements) => [...prevElements, newText]);
  };

  // --- Handle Reset ---
  const handleReset = () => {
    setElements([]);
  };

  // --- handle Undo ---
  const handleUndo = () => {
    setElements((prevElements) => {
      if (prevElements.length === 0) return prevElements;

      const updateElements = [...prevElements];
      updateElements.pop();
      return updateElements;
    });
  };

  const redrawElements = useCallback(
    (ctx) => {
      elements.forEach((element) => {
        if (element.elementType === "line") {
          ctx.beginPath();
          ctx.moveTo(element.coordinates[0][0], element.coordinates[0][1]);

          element.coordinates.forEach(([x, y]) => {
            ctx.lineTo(x, y);
          });

          ctx.strokeStyle = element.color;
          ctx.lineWidth = element.thickness;
          ctx.stroke();
        } else if (element.elementType === "rectangle") {
          ctx.strokeStyle = element.color;
          ctx.strokeRect(
            element.startX,
            element.startY,
            element.width,
            element.height
          );
        } else if (element.elementType === "circle") {
          ctx.beginPath();
          ctx.arc(
            element.startX,
            element.startY,
            element.radius,
            0,
            2 * Math.PI
          );
          ctx.strokeStyle = element.color;
          ctx.stroke();
        } else if (element.elementType === "triangle") {
          const { startX, startY, endX, endY } = element;
          const midX = (startX + endX) / 2;
          ctx.beginPath();
          ctx.moveTo(midX, startY);
          ctx.lineTo(startX, endY);
          ctx.lineTo(endX, endY);
          ctx.closePath();
          ctx.strokeStyle = element.color;
          ctx.stroke();
        } else if (element.elementType === "text") {
          ctx.font = `${element.fontSize}px Arial`;
          ctx.fillText(
            element.text,
            element.coordinates[0],
            element.coordinates[1]
          );
        }
      });
    },
    [elements]
  );

  const pointToLineDistance = (px, py, x1, y1, x2, y2) => {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    if (len_sq !== 0) param = dot / len_sq;
    let xx, yy;
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const isPointInTriangle = (px, py, triangle) => {
    const { startX, startY, endX, endY } = triangle;

    // --- Calculate the vertices of the triangle ---
    const x0 = (startX + endX) / 2; // the top point (mid-point of the base)
    const y0 = startY;
    const x1 = startX; // bottom-left corner
    const y1 = endY;
    const x2 = endX; // bottom-right corner
    const y2 = endY;

    const sign = (x1, y1, x2, y2, px, py) => {
      return (px - x2) * (y1 - y2) - (x1 - x2) * (py - y2);
    };

    const d1 = sign(px, py, x0, y0, x1, y1);
    const d2 = sign(px, py, x1, y1, x2, y2);
    const d3 = sign(px, py, x2, y2, x0, y0);

    const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
    const hasPos = d1 > 0 || d2 > 0 || d3 > 0;

    return !(hasNeg && hasPos);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    redrawElements(ctx);
  }, [elements, redrawElements]);

  // --- handle save drawing ---
  const handleSaveDrawings = () => {
    updateDrawing({ id, elements })
      .unwrap()
      .then(() => {
        refetch();
      })
      .catch((error) => {
        console.error("Failed to update drawing:", error);
      });
  };

  // --- handle toast ---
  useEffect(() => {
    if (isLoading) {
      toast.loading("Loading ...", { id: "updateDrawing" });
    }
    if (!isLoading && !isSuccess && isError) {
      toast.error("Not update..", { id: "updateDrawing" });
    }
    if (isSuccess) {
      toast.success("Updated... ", { id: "updateDrawing" });
    }
  }, [isLoading, isSuccess, isError]);

  return (
    <>
      <div className="flex items-center justify-center gap-5 my-4">
        <Tools
          selectedShape={selectedShape}
          setSelectedShape={setSelectedShape}
          handleAddText={handleAddText}
          handleReset={handleReset}
        />

        <div>
          <div className="flex justify-end">
            <div className="bg-[#F0F0F0] flex justify-center py-2 w-52 gap-5 rounded-md">
              <button
                onClick={() => handleUndo()}
                className="flex items-center justify-center relative group"
              >
                <CiUndo className="text-[28px] text-[#a29898] hover:text-black" />
                <div className="absolute bottom-full mb-2 hidden group-hover:flex justify-center items-center px-2 py-1 bg-gray-700 text-white text-sm rounded">
                  Undo
                </div>
              </button>
              <button
                onClick={handleSaveDrawings}
                className="bg-blue-500 text-[12px] px-5 rounded-sm text-white hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>

          <canvas
            className="border-[2px] border-[#F0F0F0] rounded-md mt-1"
            ref={canvasRef}
            width={1000}
            height={500}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
        </div>
      </div>
    </>
  );
};

export default Canvas;
