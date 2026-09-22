/* 파일 삭제 Action */
import * as gateway from "@components/common/gateway/Gateway";

const DELETE_MESSAGE = {
    title: "삭제하시겠습니까?",
    folder: "폴더 내의 모든 하위 폴더 및 파일도 함께 삭제되며, 삭제된 데이터는 복구할 수 없습니다.",
    file: "이 파일을 영구적으로 삭제하시겠습니까?",
    confirmBtn: "삭제"
};

export const deleteFileAction = ( file, callback, openConfirm, openAlert ) => {

    const showSuccessAlert = () => {
        openAlert({
            type: "success",
            title: "삭제 성공",
            message: "삭제가 완료되었습니다.",
            onClose: () => callback?.()
        });
    };

    const showErrorAlert = () => {
        openAlert({
            type: "error",
            title: "삭제 실패",
            message: "삭제 중 오류가 발생하였습니다."
        });
    };

    const executeDelete = async (url, payload) => {
        try {
            const response = await gateway.post(url, payload);

            if (response.status === 200 && response.code === "0000") {
                showSuccessAlert();
            } else {
                showErrorAlert();
            }
        } catch (e) {
            console.error(e);
            showErrorAlert();
        }
    };

    const deleteFileAfter = () =>
        executeDelete("/nas/api/v1/file/delete",{
                fileId: file.itemId,
                folderId: file.parentId
            }
        );

    const deleteFolderAfter = () =>
        executeDelete("/nas/api/v1/folder/delete",{
                folderId: file.itemId,
                parentFolderId: file.parentId
            }
        );

    openConfirm({
        type: "error",
        title: DELETE_MESSAGE.title,
        message: file.itemType === "FOLDER" ? DELETE_MESSAGE.folder : DELETE_MESSAGE.file,
        confirmBtn: DELETE_MESSAGE.confirmBtn,
        onConfirm: file.itemType === "FOLDER" ? deleteFolderAfter : deleteFileAfter
    });
};