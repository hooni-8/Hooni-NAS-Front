/* 파일 삭제 Action */
import * as gateway from "@components/common/gateway/Gateway";

const DELETE_CONCURRENCY = 4;

const deleteRequest = (file) => {
    if (file.itemType === "FOLDER") {
        return gateway.post("/nas/api/v1/folder/delete", {
            folderId: file.itemId,
            parentFolderId: file.parentId,
        });
    }

    return gateway.post("/nas/api/v1/file/delete", {
        fileId: file.itemId,
        folderId: file.parentId,
    });
};

const isSuccess = (response) => response?.status === 200 && response?.code === "0000";

const executeDeleteBatch = async (files) => {
    const outcomes = new Array(files.length).fill(false);
    let nextIndex = 0;

    const worker = async () => {
        while (nextIndex < files.length) {
            const currentIndex = nextIndex++;
            try {
                outcomes[currentIndex] = isSuccess(await deleteRequest(files[currentIndex]));
            } catch (error) {
                console.error(error);
                outcomes[currentIndex] = false;
            }
        }
    };

    // 대량 선택 시 API를 동시에 과도하게 호출하지 않도록 제한된 수의 worker만 실행한다.
    const workerCount = Math.min(DELETE_CONCURRENCY, files.length);
    await Promise.all(Array.from({ length: workerCount }, worker));
    return outcomes;
};

/**
 * 선택한 각 루트를 독립적으로 삭제한다.
 * 따라서 파일은 각자 다른 TRASH_ID를 받고, 폴더는 자신의 하위 항목과 하나의 TRASH_ID를 공유한다.
 */
export const deleteFilesAction = (files, callback, openConfirm, openAlert) => {
    if (!files?.length) return;

    const isSingle = files.length === 1;
    const targetName = isSingle ? `'${files[0].itemName}'` : `${files.length}개 항목`;

    openConfirm({
        type: "warning",
        title: isSingle ? "이 항목을 삭제할까요?" : "선택한 항목을 삭제할까요?",
        message: `${targetName}을(를) 휴지통으로 이동합니다. 폴더를 선택한 경우 내부 항목도 함께 이동합니다.`,
        confirmBtn: "삭제",
        onConfirm: async () => {
            const results = await executeDeleteBatch(files);
            const successCount = results.filter(Boolean).length;
            const failedCount = files.length - successCount;

            // 일부 요청만 성공한 경우에도 현재 폴더 목록은 서버 상태로 다시 맞춘다.
            if (successCount > 0) await callback?.();

            if (failedCount === 0) {
                openAlert({
                    type: "success",
                    title: "휴지통으로 이동 완료",
                    message: `${successCount}개 항목을 휴지통으로 이동했습니다.`,
                });
                return;
            }

            openAlert({
                type: successCount > 0 ? "warning" : "error",
                title: successCount > 0 ? "일부 항목 삭제 실패" : "삭제 실패",
                message: successCount > 0
                    ? `${successCount}개는 이동했고 ${failedCount}개는 이동하지 못했습니다.`
                    : "선택한 항목을 휴지통으로 이동하지 못했습니다.",
            });
        },
    });
};

export const deleteFileAction = (file, callback, openConfirm, openAlert) => {
    deleteFilesAction([file], callback, openConfirm, openAlert);
};
