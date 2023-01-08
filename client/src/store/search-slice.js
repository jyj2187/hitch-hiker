import { createSlice } from "@reduxjs/toolkit";

const initialSearchState = {
	searchText: "",
	startDate: "",
	endDate: "",
};

const checkInput = (input) => {
	const regExp = /.*[\\`[\]{}].*/gi;
	if (input.match(regExp)) {
		return input.replaceAll(regExp, "");
	}
	return input;
};

const searchSlice = createSlice({
	name: "search",
	initialState: initialSearchState,
	reducers: {
		setSearchText(state, action) {
			console.log(action.payload);
			const value = action.payload;
			state.searchText = value;
		},
		setStartDate(state, action) {
			const value = action.payload;
			state.startDate = value;
		},
		setEndDate(state, action) {
			const value = action.payload;
			state.endDate = value;
		},
	},
});

export const searchActions = searchSlice.actions;
export default searchSlice.reducer;
