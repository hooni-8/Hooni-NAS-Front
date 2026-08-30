import {useEffect, useState} from "react";

import { useFileControl } from "@hooks/useFileControl";

import { X, FolderPen, FilePen } from "lucide-react";
import "@styles/pages/components/modal/CreateFolderModal.scss";

export default function ReNameModal({ selectedFile, handleRenameAfter, closeReNameModal }) {

    const { reNameFile } = useFileControl();
    const [changeName, setChangeName] = useState("");
    const [isRenaming, setIsRenaming] = useState(false);

    const Icon = selectedFile.itemType === "FOLDER" ? FolderPen : FilePen;
    const itemLabel = selectedFile.itemType === "FOLDER" ? "폴더" : "파일";

    useEffect(() => {
        setChangeName(selectedFile.itemName || "");
    }, [selectedFile.itemName]);

    const handleRenameSuccess = (fileId, name) => {
        handleRenameAfter(fileId, name);
        closeReNameModal();
    };

    const handleRename = async (event) => {
        event?.preventDefault();

        const nextName = changeName.trim();
        if (!nextName || nextName === selectedFile.itemName || isRenaming) {
            return;
        }

        try {
            setIsRenaming(true);
            await reNameFile(selectedFile, nextName, handleRenameSuccess);
        } finally {
            setIsRenaming(false);
        }
    };

    return (
        <div className="create-folder-modal-overlay" role="presentation">
            <section className="create-folder-modal rename-modal" role="dialog" aria-modal="true" aria-labelledby="rename-title">
                <header className="create-folder-header">
                    <div className="create-folder-heading">
                        <div className="create-folder-heading-icon"><Icon aria-hidden="true" /></div>
                        <div>
                            <span className="create-folder-eyebrow">RENAME {itemLabel.toUpperCase()}</span>
                            <h2 id="rename-title" className="create-folder-title">이름 변경</h2>
                            <p>{itemLabel}의 새 이름을 입력해주세요.</p>
                        </div>
                    </div>
                    <button type="button" onClick={closeReNameModal} className="create-folder-close-btn" aria-label="이름 변경 창 닫기">
                        <X className="create-folder-close-icon" aria-hidden="true" />
                    </button>
                </header>

                <form className="create-folder-content" onSubmit={handleRename}>
                    <div className="create-folder-field">
                        <label className="create-folder-label" htmlFor="renameFileName">새 이름</label>
                        <div className="create-folder-input-wrapper">
                            <Icon className="create-folder-input-icon" aria-hidden="true" />
                            <input
                                id="renameFileName"
                                type="text"
                                value={changeName}
                                onChange={(event) => setChangeName(event.target.value)}
                                placeholder="변경할 이름을 입력하세요"
                                autoFocus
                                className="create-folder-input"
                            />
                        </div>
                    </div>

                    <div className="create-folder-actions">
                        <button type="button" onClick={closeReNameModal} className="create-folder-cancel-btn">취소</button>
                        <button
                            type="submit"
                            disabled={!changeName.trim() || isRenaming || selectedFile.itemName === changeName.trim()}
                            className="create-folder-submit-btn"
                        >
                            {isRenaming ? (
                                <><span className="create-folder-spinner" aria-hidden="true" /> <span>변경 중...</span></>
                            ) : (
                                <><Icon className="create-folder-submit-icon" aria-hidden="true" /> <span>이름 변경</span></>
                            )}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}
