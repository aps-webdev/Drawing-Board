import { configureStore } from "@reduxjs/toolkit";
import MenuReducer from "@/store/slice/menuSlice";
import ToolboxReducer from "@/store/slice/toolboxSlice";

const rootReducer = {
  menu: MenuReducer,
  toolbox: ToolboxReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
