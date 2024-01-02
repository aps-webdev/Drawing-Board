import { useEffect, useLayoutEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import { actionItemClick } from "@/store/slice/menuSlice";
import { MENU_ITEMS } from "@/utils/constant";
import { socket } from "@/socket";

const Board = () => {
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  const shouldDraw = useRef(false);
  const drawHistory = useRef([]);
  const drawHistoryPointer = useRef(-1);
  const { activeMenuItem, actionMenuItem } = useSelector((state) => state.menu);
  const { color, brushSize } = useSelector(
    (state) => state.toolbox[activeMenuItem]
  );

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    const handleMouseDown = (e) => {
      shouldDraw.current = true;
      beginPath(context, e.clientX, e.clientY);
      socket.emit("beginPath", { x: e.clientX, y: e.clientY });
    };
    const handleMouseMove = (e) => {
      if (!shouldDraw.current) return;
      drawLine(context, e.clientX, e.clientY);
      socket.emit("drawLine", { x: e.clientX, y: e.clientY });
    };
    const handleMouseUp = (e) => {
      shouldDraw.current = false;
      const canvasData = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );
      drawHistory.current.push(canvasData);
      drawHistoryPointer.current = drawHistory.current.length - 1;
    };
    const handleSocketBeginPath = (path) => {
      beginPath(context, path.x, path.y);
    };
    const handleSocketDrawLine = (path) => {
      drawLine(context, path.x, path.y);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    socket.on("beginPath", handleSocketBeginPath);
    socket.on("drawLine", handleSocketDrawLine);

    return () => {
      canvas.removeEventListener("onMouseDown", handleMouseDown);
      canvas.removeEventListener("onMouseMove", handleMouseMove);
      canvas.removeEventListener("onMouseUp", handleMouseUp);
      socket.off("beginPath", handleSocketBeginPath);
      socket.off("drawLine", handleSocketDrawLine);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");

    const changeConfig = (newColor, newBrushSize) => {
      context.strokeStyle = newColor;
      context.lineWidth = newBrushSize;
    };
    const handleSocketChangeConfig = (config) => {
      console.log("config", config);
      changeConfig(config.color, config.brushSize);
    };
    changeConfig(color, brushSize);
    socket.on("configChange", handleSocketChangeConfig);

    return () => {
      socket.off("configChange", handleSocketChangeConfig);
    };
  }, [color, brushSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");

    if (actionMenuItem === MENU_ITEMS.DOWNLOAD) {
      const URL = canvas.toDataURL();
      // for png image download
      // const URL = canvas.toDataURL('image/png');

      const anchor = document.createElement("a");
      anchor.href = URL;
      const locale = new Date().getTime();
      anchor.download = `paint${locale}.jpg`;
      // for png type image download
      // anchor.download = `paint${locale}.png`;
      anchor.click();
    } else if (
      actionMenuItem === MENU_ITEMS.UNDO ||
      actionMenuItem === MENU_ITEMS.REDO
    ) {
      if (drawHistoryPointer.current > 0 && actionMenuItem === MENU_ITEMS.UNDO)
        drawHistoryPointer.current -= 1;
      if (
        drawHistoryPointer.current < drawHistory.current.length - 1 &&
        actionMenuItem === MENU_ITEMS.REDO
      )
        drawHistoryPointer.current += 1;

      const canvasData = drawHistory.current[drawHistoryPointer.current];
      context.putImageData(canvasData, 0, 0);
    }
    dispatch(actionItemClick(null));
  }, [actionMenuItem, dispatch]);

  const beginPath = (context, x, y) => {
    context.beginPath();
    context.moveTo(x, y);
  };
  const drawLine = (context, x, y) => {
    context.lineTo(x, y);
    context.stroke();
  };

  socket.on("connect", () => {
    console.log("Socket Client Connected");
  });
  return <canvas ref={canvasRef}></canvas>;
};

export default Board;
