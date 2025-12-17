import React, {useEffect, useState} from "react";
import * as gateway from "@components/common/Gateway";
import {useNavigate} from  "react-router-dom"

import { useAuth } from "@layout/auth/AuthContext";

import "@styles/pages/auth/Login.scss"

import { HardDrive, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {

    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { loginSuccess, isAuthenticated, loading } = useAuth();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            navigate("/home", { replace: true });
        }
    }, [loading, isAuthenticated, navigate]);

    const login = async () => {
        if (userId.trim() === '' || password.trim() === '') {
            alert('아이디와 비밀번호를 입력해주세요.');
            return;
        }

        try {
            const payload = {
                userId
                , password
            }
            setIsLoading(true);

            const response = await gateway.post("/auth/login", payload);

            if (response.status === 200) {
                if (response.data.code === '0000') {
                    loginSuccess();
                    navigate("/home", { replace: true });
                } else {
                    alert("아이디와 비밀번호를 확인해주세요.");
                }
            }
        } catch (e) {
            alert("로그인 중 문제가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleEnter = (e) => {
        if (e.key === "Enter") {
            login();
        }
    }

    return (
        <div className="page-wrapper">
            <div className="container">
                {/* 헤더 */}
                <div className="login-header">
                    <div className="logo-box">
                        <HardDrive className="w-8 h-8 text-white"/>
                    </div>
                    <h1 className="header-title">My Storage</h1>
                    <p className="header-sub">안전한 개인 저장소에 오신 것을 환영합니다</p>
                </div>

                {/* 로그인 폼 */}
                <div className="login-box">
                    <div className="login-group">
                        <label className="label">이메일</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon-left"/>
                            <input
                                type="text"
                                className="input"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                placeholder={"example"}
                                required
                            />
                        </div>
                    </div>

                    <div className="login-group">
                        <label className="label">비밀번호</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon-left"/>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={"••••••••"}
                                onKeyDown={handleEnter}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff/> : <Eye/>}
                            </button>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="login-button"
                        disabled={isLoading}
                        onClick={login}
                    >
                        {isLoading ? (
                            <>
                                <div className="spinner"></div>
                                로그인 중...
                            </>
                        ) : (
                            "로그인"
                        )}
                    </button>
                </div>

                <div className="footer">© 2025 My Storage. All rights reserved.</div>
            </div>
        </div>
    );
}