import React from "react";

import * as gateway from "@components/common/gateway/Gateway";

import { useModal } from "@components/common/modal/useModal";

import {Download, Share2, Star, Trash2} from "lucide-react";

export default function MenuDropdown({ file, folderInfo, setShowMenu, fetchFileList }) {

    const { openConfirm, openAlert, closeConfirm } = useModal();

    const handleDeleteFile = (file) => {

        if (file.type === 'FOLDER') {
            openConfirm({
                type: "error",
                title: "삭제하시겠습니까?",
                message: "폴더 내의 모든 하위 폴더 및 파일도 함께 삭제되며, 삭제된 데이터는 복구할 수 없습니다.",
                confirmBtn: "삭제",
                onConfirm: () => handleDeleteFolderAfter(file.id)
            });
        } else {
            openConfirm({
                type: "error",
                title: "삭제하시겠습니까?",
                message: "이 파일을 영구적으로 삭제하시겠습니까?",
                confirmBtn: "삭제",
                onConfirm: () => handleDeleteFileAfter(file.id)
            });
        }

        setShowMenu(false);
    }

    // 폴더 삭제
    const handleDeleteFolderAfter = async (file) => {
        const payload = {
            folderId: file,
            parentFolderId: folderInfo.folderId
        };

        try {
            const response = await gateway.post("/nas/api/v1/folder/delete", payload);

            if (response.status === 200 && response.code === "0000") {
                openAlert({
                    type: "success",
                    title: "삭제 성공",
                    message: "삭제가 완료되었습니다."
                });
                fetchFileList();
            }
        } catch (e) {
            openAlert({
                type: "error",
                title: "삭제 실패",
                message: "삭제 중 오류가 발생하였습니다."
            });
            console.error(e);
        } finally {
            closeConfirm();
        }
    }

    // 파일 삭제
    const handleDeleteFileAfter = async (id) => {

        const payload = {
            fileId: id,
            folderId: folderInfo.folderId
        };

        try {
            const response = await gateway.post("/nas/api/v1/file/delete", payload);

            if (response.status === 200 && response.code === "0000") {
                openAlert({
                    type: "success",
                    title: "삭제 성공",
                    message: "삭제가 완료되었습니다."
                });
                fetchFileList();
            }
        } catch (e) {
            openAlert({
                type: "error",
                title: "삭제 실패",
                message: "삭제 중 오류가 발생하였습니다."
            });
            console.error(e);
        } finally {
            closeConfirm();
        }
    }

    return (
        <>
            <div
                className="menu-backdrop"
                onClick={() => setShowMenu(false)}
            ></div>
            <div className="file-card-menu-dropdown">
                <button className="file-card-menu-item">
                    <Download className="file-card-menu-item-icon"/>
                    <span>다운로드</span>
                </button>
                <button className="file-card-menu-item">
                    <Share2 className="file-card-menu-item-icon"/>
                    <span>공유</span>
                </button>
                <button className="file-card-menu-item">
                    <Star className="file-card-menu-item-icon"/>
                    <span>즐겨찾기</span>
                </button>
                <div className="file-card-menu-divider"></div>
                <button className="file-card-menu-item file-card-menu-item-delete" onClick={() => handleDeleteFile(file)}>
                    <Trash2 className="file-card-menu-item-icon"/>
                    <span>삭제</span>
                </button>
            </div>
        </>
    )
}