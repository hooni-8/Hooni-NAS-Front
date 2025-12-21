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
export const getFileType = (filename) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'image';
    if (['mp4', 'avi', 'mov', 'wmv'].includes(ext || '')) return 'video';
    if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext || '')) return 'audio';
    if (['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx'].includes(ext || '')) return 'document';
    return 'document';
};