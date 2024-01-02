import { useDispatch, useSelector } from "react-redux";
import cx from "classnames";

import { COLORS, MENU_ITEMS } from "@/utils/constant";
import { changeBrushSize, changeColor } from "@/store/slice/toolboxSlice";
import { socket } from "@/socket";

import styles from "./index.module.css";

const Toolbox = () => {
  const dispatch = useDispatch();
  const activeMenuItem = useSelector((state) => state.menu.activeMenuItem);
  const { brushSize, color } = useSelector(
    (state) => state.toolbox[activeMenuItem]
  );

  const showBrushToolOption =
    activeMenuItem === MENU_ITEMS.PENCIL ||
    activeMenuItem === MENU_ITEMS.ERASER;
  const showStrokeToolOption = activeMenuItem === MENU_ITEMS.PENCIL;

  const handleBrushSize = (e) => {
    dispatch(
      changeBrushSize({ item: activeMenuItem, brushSize: e.target.value })
    );
    socket.emit("configChange", { color: color, brushSize: e.target.value });
  };

  const handleColorUpdate = (color) => {
    dispatch(changeColor({ item: activeMenuItem, color: color }));
    socket.emit("configChange", { color: color, brushSize: brushSize });
  };

  return (
    <div className={styles.toolboxContainer}>
      {showStrokeToolOption && (
        <div className={styles.toolItems}>
          <h4 className={styles.toolText}>Stroke Color</h4>
          <div className={styles.itemContainer}>
            <div
              className={cx(styles.colorBox, {
                [styles.active]: color === COLORS.BLACK,
              })}
              style={{ backgroundColor: COLORS.BLACK }}
              onClick={() => handleColorUpdate(COLORS.BLACK)}
            />
            <div
              className={cx(styles.colorBox, {
                [styles.active]: color === COLORS.RED,
              })}
              style={{ backgroundColor: COLORS.RED }}
              onClick={() => handleColorUpdate(COLORS.RED)}
            />
            <div
              className={cx(styles.colorBox, {
                [styles.active]: color === COLORS.GREEN,
              })}
              style={{ backgroundColor: COLORS.GREEN }}
              onClick={() => handleColorUpdate(COLORS.GREEN)}
            />
            <div
              className={cx(styles.colorBox, {
                [styles.active]: color === COLORS.YELLOW,
              })}
              style={{ backgroundColor: COLORS.YELLOW }}
              onClick={() => handleColorUpdate(COLORS.YELLOW)}
            />
            <div
              className={cx(styles.colorBox, {
                [styles.active]: color === COLORS.BLUE,
              })}
              style={{ backgroundColor: COLORS.BLUE }}
              onClick={() => handleColorUpdate(COLORS.BLUE)}
            />
            <div
              className={cx(styles.colorBox, {
                [styles.active]: color === COLORS.ORANGE,
              })}
              style={{ backgroundColor: COLORS.ORANGE }}
              onClick={() => handleColorUpdate(COLORS.ORANGE)}
            />
          </div>
        </div>
      )}
      {showBrushToolOption && (
        <div className={styles.toolItems}>
          <h4 className={styles.toolText}>Brush Size</h4>
          <div className={styles.itemContainer}>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={brushSize}
              onChange={handleBrushSize}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbox;
