import { useEffect, useState } from "react";
import { Search, Home, FolderOpen, ArrowLeft, FileQuestion } from "lucide-react";

import "@styles/pages/error/Page404.scss"

export default function Page404({ onNavigateHome }) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="page404">
            {/* 배경 그라데이션 효과 */}
            <div
                className="page404__bg-glow"
                style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.05), transparent 40%)`,
                }}
            />

            {/* 떠다니는 파일 아이콘들 */}
            <div className="page404__floating-icons">
                <div className="page404__floating-icon page404__floating-icon--1">
                    <FileQuestion className="page404__icon page404__icon--blue" />
                </div>
                <div className="page404__floating-icon page404__floating-icon--2">
                    <FolderOpen className="page404__icon page404__icon--lg page404__icon--purple" />
                </div>
                <div className="page404__floating-icon page404__floating-icon--3">
                    <Search className="page404__icon page404__icon--sm page404__icon--pink" />
                </div>
                <div className="page404__floating-icon page404__floating-icon--4">
                    <FileQuestion className="page404__icon page404__icon--md page404__icon--blue" />
                </div>
            </div>

            <div className="page404__content">
                {/* 404 숫자 */}
                <div className="page404__number-wrap">
                    <div
                        className="page404__number"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
            <span
                className={`page404__number-text${isHovering ? " page404__number-text--hovering" : ""}`}
            >
              404
            </span>
                    </div>

                    {/* 글리치 효과 레이어 */}
                    {isHovering && (
                        <>
                            <div className="page404__glitch page404__glitch--blue">404</div>
                            <div className="page404__glitch page404__glitch--pink">404</div>
                        </>
                    )}
                </div>

                {/* 메시지 */}
                <div className="page404__message">
                    <h1 className="page404__title">페이지를 찾을 수 없습니다</h1>
                    <p className="page404__description">
                        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
                        파일이 삭제되었거나 경로가 변경되었는지 확인해주세요.
                    </p>
                </div>

                {/* 통계 카드 */}
                <div className="page404__stats">
                    <div className="page404__stat-card page404__stat-card--blue">
                        <div className="page404__stat-value page404__stat-value--blue-purple">0</div>
                        <div className="page404__stat-label">파일 찾음</div>
                    </div>
                    <div className="page404__stat-card page404__stat-card--purple">
                        <div className="page404__stat-value page404__stat-value--purple-pink">404</div>
                        <div className="page404__stat-label">에러 코드</div>
                    </div>
                    <div className="page404__stat-card page404__stat-card--pink">
                        <div className="page404__stat-value page404__stat-value--pink-blue">∞</div>
                        <div className="page404__stat-label">다른 파일들</div>
                    </div>
                </div>

                {/* 액션 버튼 */}
                <div className="page404__actions">
                    <button className="page404__btn page404__btn--primary" onClick={onNavigateHome}>
                        <Home className="page404__btn-icon" />
                        <span>홈으로 돌아가기</span>
                    </button>
                    <button className="page404__btn page404__btn--secondary" onClick={() => window.history.back()}>
                        <ArrowLeft className="page404__btn-icon" />
                        <span>이전 페이지</span>
                    </button>
                </div>

                {/* 추천 링크 */}
                <div className="page404__links">
                    <p className="page404__links-label">다음 페이지를 확인해보세요:</p>
                    <div className="page404__links-list">
                        {["내 파일", "최근 항목", "공유됨", "휴지통"].map((label) => (
                            <button key={label} className="page404__link-btn">
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}