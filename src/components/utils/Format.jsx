import React from "react";
import {
    File as FileIcon,
    FileText,
    Folder,
    Image,
    ImageIcon,
    Music,
    Video,
    VideoIcon,
    MusicIcon
} from "lucide-react";

// 용량 포맷 유틸 함수 (JavaScript)
export const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

// 사용률 계산 함수
export const usedPercent = (total, usable) => {
    if (!total || total === 0) return '0%';

    const percent = ((total - usable) / total) * 100;
    return `${percent.toFixed(1)}%`;
}

// 타입 구분
export const getFileType = (extension) => {
    const ext = extension.split('.').pop()?.toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'image';
    if (['mp4', 'avi', 'mov', 'wmv'].includes(ext || '')) return 'video';
    if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext || '')) return 'audio';
    if (['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx'].includes(ext || '')) return 'document';
    return 'document';
};

// 파일 컬러
export const getFileColor = (file) => {
    switch (file.itemType) {
        case 'FOLDER': return 'file-card-bg-folder';
        case 'document': return 'file-card-bg-document';
        case 'image': return 'file-card-bg-image';
        case 'video': return 'file-card-bg-video';
        case 'audio': return 'file-card-bg-audio';
        default: return 'file-card-bg-default';
    }
};

// 파일 아이콘
export const getFileIcon = (file) => {
    switch (file.itemType) {
        case 'FOLDER': return <Folder className="card-icon folder-icon" />;
        case 'document': return <FileText className="card-icon document-icon" />;
        case 'image': return <Image className="card-icon image-icon" />;
        case 'video': return <Video className="card-icon video-icon" />;
        case 'audio': return <Music className="card-icon audio-icon" />;
        default: return <FileText className="card-icon default-icon" />;
    }
};

export const getUploadFileIcon = (file) => {
    switch (file.type) {
        case 'document': return <FileIcon className="upload-file-item-icon" />;
        case 'image': return <ImageIcon className="upload-file-item-icon" />;
        case 'video': return <VideoIcon className="upload-file-item-icon" />;
        case 'audio': return <MusicIcon className="upload-file-item-icon" />;

        default: return <FileText className="upload-file-item-icon" />;
    }
}

export const matchesCategory = (matchesSearch, selectedCategory, file) => {
    const matchesCategory =
        selectedCategory === 'all' ||
        (selectedCategory === 'folders' && file.itemType === 'FOLDER') ||
        (selectedCategory === 'images' && file.itemType === 'image') ||
        (selectedCategory === 'documents' && file.itemType === 'document') ||
        (selectedCategory === 'videos' && file.itemType === 'video') ||
        (selectedCategory === 'audio' && file.itemType === 'audio');

    return matchesSearch && matchesCategory;
}

const getColorClass = (file) => {
    switch (file.itemType) {
        case 'FOLDER': return { color: '#3b82f6' };
        case 'document': return { color: '#f97316' };
        case 'image': return { color: '#22c55e' };
        case 'video': return { color: '#a855f7' };
        case 'audio': return { color: '#ec4899' };
        default: return { color: '#6b7280' };
    }
}

export const getListFileIcon = (file) => {

    const iconProps = {
        className: 'file-icon',
        style: getColorClass(file)
    };

    switch (file.itemType) {
        case 'FOLDER': return <Folder {...iconProps} />;
        case 'document': return <FileText {...iconProps} />;
        case 'image': return <Image {...iconProps} />;
        case 'video': return <Video {...iconProps} />;
        case 'audio': return <Music {...iconProps} />;
        default: return <FileText {...iconProps} />;
    }
};

// 날짜 Format (2026.06.25)
export const formatDate = (dateString) => {
    const date = new Date(dateString);

    return `${date.getFullYear()}.` +
        `${String(date.getMonth() + 1).padStart(2, '0')}.` +
        `${String(date.getDate()).padStart(2, '0')}`;
}
