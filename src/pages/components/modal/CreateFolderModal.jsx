import { useState } from 'react';
import { useParams } from "react-router-dom";

import { useModal } from "@hooks/useModal";

import * as gateway from "@components/common/gateway/Gateway";

import { X, Folder } from 'lucide-react';
import "@styles/pages/components/modal/CreateFolderModal.scss"

export default function CreateFolderModal({ fetchFileList }) {

    const { folderId } = useParams();

    const { closeModal } = useModal();

    const [folderName, setFolderName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleCreate = async (event) => {
        event?.preventDefault();

        if (!folderName.trim()) {
            setErrorMessage("폴더 이름을 입력해주세요.");
            return;
        }

        setErrorMessage('');
        setIsCreating(true);

        const payload = {
            folderName: folderName,
            folderId: folderId
        }

        try {
            const response = await gateway.post("/nas/api/v1/folder/create", payload);

            if (response.status === 200 && response.code === "0000") {
                closeModal("createFolder");
                fetchFileList();
            } else {
                setErrorMessage("폴더를 만들지 못했습니다. 잠시 후 다시 시도해주세요.");
            }
        } catch (e) {
            console.error(e);
            setErrorMessage("폴더를 만들지 못했습니다. 네트워크 상태를 확인해주세요.");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="create-folder-modal-overlay">
            <div className="create-folder-modal">
                <div className="create-folder-header">
                    <h2 className="create-folder-title">새 폴더 만들기</h2>
                    <button
                        onClick={() => closeModal("createFolder")}
                        className="create-folder-close-btn"
                    >
                        <X className="create-folder-close-icon" />
                    </button>
                </div>

                <form className="create-folder-content" onSubmit={handleCreate}>
                    <div className="create-folder-field">
                        <label className="create-folder-label" htmlFor="folderName">폴더 이름</label>
                        <div className="create-folder-input-wrapper">
                            <Folder className="create-folder-input-icon" />
                            <input
                                id="folderName"
                                type="text"
                                value={folderName}
                                onChange={(e) => {
                                    setFolderName(e.target.value);
                                    if (errorMessage) setErrorMessage('');
                                }}
                                placeholder="폴더 이름을 입력하세요"
                                autoFocus
                                required
                                className="create-folder-input"
                                aria-invalid={Boolean(errorMessage)}
                                aria-describedby={errorMessage ? "folder-name-error" : undefined}
                            />
                        </div>
                        {errorMessage && <p id="folder-name-error" className="create-folder-error" role="alert">{errorMessage}</p>}
                    </div>

                    <div className="create-folder-actions">
                        <button
                            type="button"
                            onClick={() => closeModal("createFolder")}
                            className="create-folder-cancel-btn"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={!folderName.trim() || isCreating}
                            className="create-folder-submit-btn"
                        >
                            {isCreating ? (
                                <>
                                    <div className="create-folder-spinner"></div>
                                    <span>생성 중...</span>
                                </>
                            ) : (
                                <>
                                    <Folder className="create-folder-submit-icon" />
                                    <span>폴더 만들기</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
