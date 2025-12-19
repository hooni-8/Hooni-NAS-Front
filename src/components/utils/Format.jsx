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