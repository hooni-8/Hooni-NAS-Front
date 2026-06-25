/* 이름 변경 Action */
import * as gateway from "@components/common/gateway/Gateway";

export const reNameFileAction = async ( file, changeName, callback, openAlert ) => {

    if (!changeName?.trim()) {
        openAlert({
            type: "warning",
            title: "입력 오류",
            message: "변경할 이름을 입력해주세요."
        });
        return;
    }

    const showErrorAlert = () => {
        openAlert({
            type: "error",
            title: "변경 실패",
            message: "변경 중 오류가 발생하였습니다."
        });
    };

    try {
        let response;

        if (file.itemType === "FOLDER") {
            response = await gateway.post("/nas/api/v1/folder/rename", {
                changeName,
                folderId: file.itemId,
                parentFolderId: file.parentId
            });
        } else {
            response = await gateway.post("/nas/api/v1/file/rename", {
                changeName,
                fileId: file.itemId,
                folderId: file.parentId
            });
        }

        if (response.status === 200 && response.code === "0000") {
            callback?.(file.itemId, changeName);
        } else {
            showErrorAlert();
        }
    } catch (e) {
        console.error(e);
        showErrorAlert();
    }
};