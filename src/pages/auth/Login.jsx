import React, {useState} from "react";
import * as gateway from "@components/common/Gateway";

import "@styles/pages/auth/Login.scss"

import { HardDrive, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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
                <div className="form-box">
                    <form >
                        <div className="form-group">
                            <label className="label">이메일</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon-left"/>
                                <input
                                    type="email"
                                    className="input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={"example@example.com"}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="label">비밀번호</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon-left"/>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={"••••••••"}
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

                        <button type="submit" className="login-button" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <div className="spinner"></div>
                                    로그인 중...
                                </>
                            ) : (
                                "로그인"
                            )}
                        </button>
                    </form>
                </div>

                <div className="footer">© 2025 My Storage. All rights reserved.</div>
            </div>
        </div>
    );
}