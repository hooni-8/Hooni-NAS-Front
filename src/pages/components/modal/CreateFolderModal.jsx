import { useState } from 'react';
import * as gateway from "@components/common/Gateway";

import { X, Folder } from 'lucide-react';
import "@styles/pages/components/modal/CreateFolderModal.scss"

export default function CreateFolderModal({ onClose }) {
    const [folderName, setFolderName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleCreate = async () => {
        if (!folderName.trim()) {
            alert("폴더명을 입력해주세요");
            return;
        }

        setIsCreating(true);

        const payload = {
            folderName: folderName,
            activeFolderId: sessionStorage.getItem("_af")
        }

        try {
            const response = await gateway.post("/nas/api/v1/folder/create", payload);

            if (response.status === 200 && response.code === "0000") {
                onClose();
            }
        } catch (e) {
            console.error(e);
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
                        onClick={onClose}
                        className="create-folder-close-btn"
                    >
                        <X className="create-folder-close-icon" />
                    </button>
                </div>

                <div className="create-folder-content">
                    <div className="create-folder-field">
                        <label htmlFor="folderName" className="create-folder-label">
                            폴더 이름
                        </label>
                        <div className="create-folder-input-wrapper">
                            <Folder className="create-folder-input-icon" />
                            <input
                                id="folderName"
                                type="text"
                                value={folderName}
                                onChange={(e) => setFolderName(e.target.value)}
                                placeholder="폴더 이름을 입력하세요"
                                autoFocus
                                required
                                className="create-folder-input"
                            />
                        </div>
                    </div>

                    <div className="create-folder-actions">
                        <button
                            type="button"
                            onClick={onClose}
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
                                    <span onClick={handleCreate} >폴더 만들기</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}