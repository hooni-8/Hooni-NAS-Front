import { useState } from 'react';
import { X, Folder } from 'lucide-react';

import "@styles/pages/components/modal/CreateFolderModal.scss"

export default function CreateFolderModal({ onClose, onCreateFolder }) {
    const [folderName, setFolderName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!folderName.trim()) return;

        setIsCreating(true);

        setTimeout(() => {
            const newFolder = {
                id: Math.random().toString(36).substr(2, 9),
                name: folderName,
                type: 'folder',
                size: '0 MB',
                date: new Date().toISOString().split('T')[0],
            };

            onCreateFolder(newFolder);
            setIsCreating(false);
            onClose();
        }, 500);
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

                <form onSubmit={handleSubmit} className="create-folder-form">
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