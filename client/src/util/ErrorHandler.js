export const ErrorHandler = (err) => {
	if (err.response.status === 500) {
		alert("서버 오류입니다. 다시 시도해주세요.");
		return;
	}
	if (err.response.status === 400) {
		alert(
			err.response.data.violationErrors
				? err.response.data.violationErrors[0].reason
				: err.response.data.fieldErrors[0].reason
		);
		return;
	}
	if (err.response.status !== 0) {
		alert(err.response.data.korMessage);
		return;
	}
	if (err) {
		alert("잘못된 접근 방법입니다. 다시 시도해주세요.");
		return;
	}
};

export const ReloadErrorHandler = (err) => {
	if (err.response.status === 500) {
		alert("서버 오류입니다. 다시 시도해주세요.");
		window.location.reload();
		return;
	}
	if (err.response.status !== 0) {
		alert(err.response.data.korMessage);
		window.location.reload();
		return;
	}
	if (err) {
		alert("잘못된 접근 방법입니다. 다시 시도해주세요.");
		window.location.reload();
		return;
	}
};
