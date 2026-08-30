import { RefreshCw, ServerCrash } from "lucide-react";

export default function FileLoadErrorView({ onRetry, onGoToRoot }) {
    return (
        <section className="file-load-error" aria-labelledby="file-load-error-title">
            <div className="file-load-error-card">
                <div className="file-load-error-icon" aria-hidden="true"><ServerCrash /></div>
                <span className="file-load-error-code">CONNECTION ISSUE</span>
                <h2 id="file-load-error-title">파일 목록을 불러오지 못했습니다</h2>
                <p>네트워크 연결 또는 NAS 서비스 상태를 확인한 뒤 다시 시도해주세요.</p>
                <div className="file-load-error-actions">
                    <button type="button" className="file-load-error-retry" onClick={onRetry}>
                        <RefreshCw aria-hidden="true" />
                        다시 시도
                    </button>
                    <button type="button" className="file-load-error-root" onClick={onGoToRoot}>
                        내 파일로 이동
                    </button>
                </div>
            </div>
        </section>
    );
}
