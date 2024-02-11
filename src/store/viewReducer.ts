import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { SortDirection, SortFields } from "../enums";

export interface viewState {
  page: number;
  limit: number;
  sortField: SortFields | null;
  sortDirection: SortDirection;
}

const initialState: viewState = {
  page: 1,
  limit: 5,
  sortField: null,
  sortDirection: SortDirection.desc,
};

export const viewSlice = createSlice({
  name: "view",
  initialState,
  reducers: {
    setView: (state, action: PayloadAction<Partial<viewState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setView } = viewSlice.actions;

export default viewSlice.reducer;
