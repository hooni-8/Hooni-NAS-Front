import React, {useState} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";

import "@styles/pages/auth/Login.scss";

import Logo from "@assets/imgs/Hooni_logo.png";
import { UserRound, LockKeyhole, Eye, EyeOff, ShieldCheck } from "lucide-react";

const getLoginError = (error) => {
    // gateway.post는 실패 시 AxiosError가 아니라 error.response(AxiosResponse)를 반환하므로
    // 두 형태를 모두 지원하고 서버 코드가 숫자로 와도 같은 값으로 비교한다.
    const response = error?.response ?? error;
    const payload = response?.data ?? error?.data;
    const code = payload?.code ?? payload?.data?.code;

    return {
        status: response?.status,
        code: code == null ? "" : String(code),
    };
};

export default function Login() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(
        searchParams.get("reason") === "session-expired"
            ? "로그인 세션이 만료되었습니다. 다시 로그인해주세요."
            : ""
    );

    const { login } = useAuth();

    const handleLogin  = async (event) => {
        event?.preventDefault();

        if (isLoading) {
            return;
        }

        if (userId.trim() === "" || password.trim() === "") {
            setErrorMessage("아이디와 비밀번호를 입력해주세요.");
            return;
        }

        try {
            setErrorMessage("");
            setIsLoading(true);

            const folderId = await login({userId, password, sourcePath: "NAS"});

            navigate(`/main/${folderId}`, { replace: true });

        } catch (error) {
            const { status, code } = getLoginError(error);

            // 현재 Auth API는 자격 증명 불일치에도 400/0001을 반환하므로
            // 서버 계약이 401/1001로 정리되기 전까지 두 응답을 모두 지원한다.
            const isInvalidCredentials = status === 401
                || code === "1001"
                || (status === 400 && code === "0001");

            if (isInvalidCredentials) {
                setErrorMessage('아이디 또는 비밀번호가 올바르지 않습니다.');
            } else if (status === 429 || code === "1004") {
                setErrorMessage('로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.');
            } else {
                setErrorMessage('로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="nas-login-page">
            <section className="nas-login-card" aria-labelledby="login-title">
                <header className="nas-login-brand">
                    <img className="nas-login-logo" src={Logo} alt="Hooni NAS" />
                    <p className="nas-login-product">PERSONAL CLOUD STORAGE</p>
                    <h1 id="login-title">다시 만나서 반가워요</h1>
                    <p className="nas-login-description">내 파일 공간에 안전하게 접속하세요.</p>
                </header>

                <form className="nas-login-form" onSubmit={handleLogin} noValidate>
                    <div className="nas-login-field">
                        <label htmlFor="userId">아이디</label>
                        <div className="nas-login-input-wrap">
                            <UserRound aria-hidden="true" className="nas-login-input-icon" />
                            <input
                                id="userId"
                                type="text"
                                value={userId}
                                onChange={(event) => {
                                    setUserId(event.target.value);
                                    setErrorMessage("");
                                }}
                                placeholder="아이디를 입력하세요"
                                autoComplete="username"
                                aria-invalid={Boolean(errorMessage)}
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="nas-login-field">
                        <label htmlFor="password">비밀번호</label>
                        <div className="nas-login-input-wrap">
                            <LockKeyhole aria-hidden="true" className="nas-login-input-icon" />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(event) => {
                                    setPassword(event.target.value);
                                    setErrorMessage("");
                                }}
                                placeholder="비밀번호를 입력하세요"
                                autoComplete="current-password"
                                aria-invalid={Boolean(errorMessage)}
                            />
                            <button
                                type="button"
                                className="nas-login-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                            >
                                {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                            </button>
                        </div>
                    </div>

                    {errorMessage && (
                        <p className="nas-login-error" role="alert">{errorMessage}</p>
                    )}

                    <button type="submit" className="nas-login-submit" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <span className="spinner" aria-hidden="true" />
                                로그인 중...
                            </>
                        ) : "로그인"}
                    </button>

                    <p className="nas-login-security-note">
                        <ShieldCheck aria-hidden="true" />
                        개인 NAS 보안 연결
                    </p>
                </form>

                <footer className="nas-login-footer">© {new Date().getFullYear()} Hooni NAS</footer>
            </section>
        </main>
    );
}
