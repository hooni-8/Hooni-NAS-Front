import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileQuestion, Home } from "lucide-react";

import "@styles/pages/error/Page404.scss";

export default function Page404() {
    const navigate = useNavigate();

    return (
        <div className="page404">
            <div className="page404__content">
                <div className="page404__icon-wrap" aria-hidden="true">
                    <FileQuestion />
                </div>
                <div className="page404__message">
                    <span className="page404__code">404</span>
                    <h1 className="page404__title">페이지를 찾을 수 없습니다</h1>
                    <p className="page404__description">
                        주소가 변경되었거나, 접근하려는 파일 또는 폴더가 더 이상 존재하지 않습니다.
                    </p>
                </div>
                <div className="page404__actions">
                    <button className="page404__btn page404__btn--primary" onClick={() => navigate("/", { replace: true })}>
                        <Home className="page404__btn-icon" />
                        <span>홈으로 돌아가기</span>
                    </button>
                    <button className="page404__btn page404__btn--secondary" onClick={() => navigate(-1)}>
                        <ArrowLeft className="page404__btn-icon" />
                        <span>이전 페이지</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
