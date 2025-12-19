import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import * as gateway from "@components/common/Gateway";
import * as format from "@components/utils/Format";
import { useAuth } from "@layout/auth/AuthContext";

import "@styles/pages/layout/Sidebar.scss";
import { HardDrive, Folder, Image, FileText, Video, Music, Star, Trash2, Clock, X, LogOut } from 'lucide-react';

export default function Sidebar ({ selectedCategory, onCategoryChange, onClose }) {

    const { logout } = useAuth();
    const navigate = useNavigate();

    const [totalVolume, setTotalVolume] = useState(0);
    const [freeVolume, setFreeVolume] = useState(0);
    const [usableVolume, setUsableVolume] = useState(0);
    const [usedPercent, setUsedPercent] = useState();


    const categories = [
        { id: 'all', name: '전체 파일', icon: HardDrive, color: '#4b5563' },
        { id: 'folders', name: '폴더', icon: Folder, color: '#3b82f6' },
        { id: 'images', name: '이미지', icon: Image, color: '#22c55e' },
        { id: 'documents', name: '문서', icon: FileText, color: '#f97316' },
        { id: 'videos', name: '비디오', icon: Video, color: '#a855f7' },
        { id: 'audio', name: '오디오', icon: Music, color: '#ec4899' },
    ];

    const quickAccess = [
        { id: 'recent', name: '최근 파일', icon: Clock },
        { id: 'starred', name: '즐겨찾기', icon: Star },
        { id: 'trash', name: '휴지통', icon: Trash2 },
    ];


    const handleLogout = async () => {
       await logout();
       navigate("/", {replace: true});
    }

    // Disk 용량 확인
    useEffect(() => {
        const diskVolume = async () => {

            try {
                const response = await gateway.post("/nas/api/v1/volume/disk");

                if (response.status === 200) {
                    const { total, free, usable } = response.data;

                    setTotalVolume(total);
                    setFreeVolume(free);
                    setUsableVolume(usable);

                    setUsedPercent(format.usedPercent(total, usable));
                } else {
                    console.error("통신 중 오류가 발생했습니다.");
                }
            } catch (e) {
                console.error(e);
            }
        }

        diskVolume();
    }, []);

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo-section">
                    <div className="sidebar-logo">
                        <HardDrive className="sidebar-logo-icon"/>
                    </div>
                    <div className="sidebar-title-section">
                        <h1 className="sidebar-title">My Storage</h1>
                        <p className="sidebar-subtitle">개인 저장소</p>
                    </div>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="sidebar-close-btn"
                    >
                        <X className="sidebar-close-icon"/>
                    </button>
                )}
            </div>

            <div className="sidebar-storage">
                <div className="sidebar-storage-info">
                    <span className="sidebar-storage-label">저장 공간</span>
                    <span className="sidebar-storage-usage">{ format.formatBytes(totalVolume - usableVolume) } / { format.formatBytes(totalVolume) }</span>
                </div>
                <div className="sidebar-storage-bar">
                    <div
                        className="sidebar-storage-fill"
                        style={{width: usedPercent}}
                    >
                        <span className="sidebar-storage-percent">{ usedPercent }</span>
                    </div>
                </div>
            </div>

            <nav className="sidebar-nav">
                <div className="sidebar-section">
                    <p className="sidebar-section-title">카테고리</p>
                    {categories.map(category => {
                        const Icon = category.icon;
                        const isActive = selectedCategory === category.id;
                        return (
                            <button
                                key={category.id}
                                onClick={() => onCategoryChange(category.id)}
                                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                            >
                                <Icon
                                    className="sidebar-nav-icon"
                                    style={{
                                        color: isActive ? '#3b82f6' : category.color
                                    }}
                                />
                                <span>{category.name}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="sidebar-section">
                    <p className="sidebar-section-title">빠른 접근</p>
                    {quickAccess.map(item => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                className="sidebar-nav-item"
                            >
                                <Icon className="sidebar-nav-icon" style={{color: '#4b5563'}}/>
                                <span>{item.name}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* 로그아웃 버튼 */}
            <div className="sidebar-logout">
                <button
                    onClick={handleLogout}
                    className="sidebar-logout-btn"
                >
                    <LogOut className="sidebar-logout-icon"/>
                    <span>로그아웃</span>
                </button>
            </div>
        </div>
    );
}