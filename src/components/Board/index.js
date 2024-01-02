import { useEffect, useLayoutEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import { actionItemClick } from "@/store/slice/menuSlice";
import styles from "./index.module.css";
import { MENU_ITEMS } from "@/utils/constant";

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
    console.log("inside use effect");
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
    };
    const handleMouseMove = (e) => {
      if (!shouldDraw.current) return;
      drawLine(context, e.clientX, e.clientY);
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
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("onMouseDown", handleMouseDown);
      canvas.removeEventListener("onMouseMove", handleMouseMove);
      canvas.removeEventListener("onMouseUp", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");

    const changeConfig = () => {
      context.strokeStyle = color;
      context.lineWidth = brushSize;
    };
    changeConfig();
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
  return <canvas ref={canvasRef}></canvas>;
};

export default Board;
