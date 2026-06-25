import {useEffect, useState} from 'react';

import { useFileControl } from "@hooks/useFileControl"

import { X, FolderPen, FilePen } from 'lucide-react';
import "@styles/pages/components/modal/CreateFolderModal.scss"

export default function ReNameModal({ selectedFile, handleRenameAfter, closeReNameModal }) {

    const { reNameFile } = useFileControl();

    const [changeName, setChangeName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const Icon = selectedFile.itemType === "FOLDER" ? FolderPen : FilePen;

    useEffect(() => {
        setChangeName(selectedFile.itemName);
    }, []);

    const handleRenameSuccess = (fileId, changeName) => {
        handleRenameAfter(fileId, changeName);
        closeReNameModal();
    };

    const handleRename = async () => {
        try {
            setIsCreating(true);

            await reNameFile(selectedFile, changeName, handleRenameSuccess);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="create-folder-modal-overlay">
            <div className="create-folder-modal">
                <div className="create-folder-header">
                    <h2 className="create-folder-title">파일명 변경</h2>
                    <button
                        onClick={closeReNameModal}
                        className="create-folder-close-btn"
                    >
                        <X className="create-folder-close-icon" />
                    </button>
                </div>

                <div className="create-folder-content">
                    <div className="create-folder-field">
                        <div className="create-folder-input-wrapper">
                            <Icon className="create-folder-input-icon" />
                            <input
                                id="folderName"
                                type="text"
                                value={changeName}
                                onChange={(e) => setChangeName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleRename();
                                    }
                                }}
                                placeholder="변경할 이름을 입력하세요"
                                autoFocus
                                required
                                className="create-folder-input"
                            />
                        </div>
                    </div>

                    <div className="create-folder-actions">
                        <button
                            type="button"
                            onClick={closeReNameModal}
                            className="create-folder-cancel-btn"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={!changeName.trim() || isCreating || selectedFile.itemName === changeName}
                            className="create-folder-submit-btn"
                        >
                            {isCreating ? (
                                <>
                                    <div className="create-folder-spinner"></div>
                                    <span>변경 중...</span>
                                </>
                            ) : (
                                <span onClick={handleRename}>변경</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}