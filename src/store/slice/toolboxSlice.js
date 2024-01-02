const { MENU_ITEMS, COLORS } = require("@/utils/constant");
const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  [MENU_ITEMS.PENCIL]: {
    color: COLORS.BLACK,
    brushSize: 3,
  },
  [MENU_ITEMS.ERASER]: {
    color: COLORS.WHITE,
    brushSize: 3,
  },
  [MENU_ITEMS.UNDO]: {},
  [MENU_ITEMS.REDO]: {},
  [MENU_ITEMS.DOWNLOAD]: {},
};

const toolboxSlice = createSlice({
  name: "toolbox",
  initialState,
  reducers: {
    changeColor: (state, action) => {
      state[action.payload.item].color = action.payload.color;
    },
    changeBrushSize: (state, action) => {
      state[action.payload.item].brushSize = action.payload.brushSize;
    },
  },
});

export const { changeColor, changeBrushSize } = toolboxSlice.actions;

export default toolboxSlice.reducer;
