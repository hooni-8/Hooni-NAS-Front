import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "@styles/pages/components/trash/Trash.scss";
import { useNavigate } from "react-router-dom";
import {
    Archive,
    ArchiveRestore,
    ChevronLeft,
    ChevronRight,
    Clock3,
    FileText,
    Folder,
    HardDrive,
    Image,
    LoaderCircle,
    Music,
    RefreshCw,
    Search,
    ShieldCheck,
    Trash2,
    Video,
    X,
} from "lucide-react";

import * as gateway from "@components/common/gateway/Gateway";
import { formatBytes } from "@components/utils/Format";
import { useAuth } from "@hooks/useAuth";
import { useModal } from "@hooks/useModal";

const PAGE_SIZE = 50;

const isSuccessResponse = (response) => (
    response?.status === 200 && response?.code === "0000"
);

const getErrorMessage = (response, fallback) => (
    response?.data?.message || response?.message || fallback
);

const formatDeletedAt = (value) => {
    if (!value) return "-";
    return value.replaceAll("-", ".").slice(0, 16);
};

const getFileKind = (extension = "") => {
    const ext = extension.replace(".", "").toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp", "heic", "heif"].includes(ext)) return "image";
    if (["mp4", "avi", "mov", "wmv", "mkv"].includes(ext)) return "video";
    if (["mp3", "wav", "ogg", "m4a", "flac"].includes(ext)) return "audio";
    if (["zip", "tar", "7z", "rar"].includes(ext)) return "archive";
    return "document";
};

const getItemIcon = (item) => {
    if (item.itemType === "FOLDER") return Folder;

    switch (getFileKind(item.extension)) {
        case "image": return Image;
        case "video": return Video;
        case "audio": return Music;
        case "archive": return Archive;
        default: return FileText;
    }
};

function TrashItemThumbnail({ item, itemKind, ItemIcon }) {
    const [thumbnailUrl, setThumbnailUrl] = useState(null);
    const supportsThumbnail = item.itemType === "FILE" && ["image", "video"].includes(itemKind);

    useEffect(() => {
        if (!supportsThumbnail) {
            setThumbnailUrl(null);
            return undefined;
        }

        let objectUrl = null;
        let disposed = false;
        setThumbnailUrl(null);

        const fetchThumbnail = async () => {
            try {
                const response = await gateway.getBlob(`/nas/api/v1/trash/thumbnail/${item.trashId}`);
                if (!response?.data) return;

                objectUrl = URL.createObjectURL(response.data);
                if (disposed) {
                    URL.revokeObjectURL(objectUrl);
                    return;
                }
                setThumbnailUrl(objectUrl);
            } catch {
                // 썸네일이 없거나 이미 정리된 경우에는 파일 종류 아이콘을 유지한다.
            }
        };

        fetchThumbnail();

        return () => {
            disposed = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [item.trashId, supportsThumbnail]);

    return (
        <div
            className={`trash-item-icon trash-item-icon-${itemKind}${thumbnailUrl ? " has-thumbnail" : ""}`}
            aria-hidden="true"
        >
            {thumbnailUrl ? <img src={thumbnailUrl} alt="" loading="lazy" /> : <ItemIcon />}
        </div>
    );
}

export default function Trash() {
    const navigate = useNavigate();
    const { rootFolderId } = useAuth();
    const { openConfirm, openAlert } = useModal();
    const selectAllRef = useRef(null);
    const requestIdRef = useRef(0);

    const [trashItems, setTrashItems] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [trashTotalCount, setTrashTotalCount] = useState(0);
    const [selectedIds, setSelectedIds] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    const hasTrashItems = trashItems.length > 0;
    const hasSelection = selectedIds.length > 0;
    const allSelected = hasTrashItems && selectedIds.length === trashItems.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setDebouncedQuery(searchQuery.trim());
            setPage(0);
        }, 300);

        return () => window.clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = hasSelection && !allSelected;
        }
    }, [allSelected, hasSelection]);

    const fetchTrashItems = useCallback(async () => {
        const requestId = ++requestIdRef.current;
        setLoading(true);
        setLoadError(false);

        try {
            const response = await gateway.post("/nas/api/v1/trash/list", {
                keyword: debouncedQuery,
                page,
                size: PAGE_SIZE,
            });

            if (!isSuccessResponse(response)) {
                throw new Error(getErrorMessage(response, "휴지통 목록을 불러오지 못했습니다."));
            }

            // 늦게 도착한 이전 검색 응답이 최신 화면을 덮어쓰지 않도록 요청 번호를 확인한다.
            if (requestId !== requestIdRef.current) return;

            const data = response.data ?? {};
            setTrashItems(data.items ?? []);
            setTotalCount(data.totalCount ?? 0);
            if (!debouncedQuery) setTrashTotalCount(data.totalCount ?? 0);
            setSelectedIds([]);
        } catch (error) {
            if (requestId !== requestIdRef.current) return;
            console.error(error);
            setTrashItems([]);
            setTotalCount(0);
            setSelectedIds([]);
            setLoadError(true);
        } finally {
            if (requestId === requestIdRef.current) setLoading(false);
        }
    }, [debouncedQuery, page]);

    useEffect(() => {
        fetchTrashItems();
    }, [fetchTrashItems]);

    const selectedItems = useMemo(() => (
        trashItems.filter(item => selectedIds.includes(item.trashId))
    ), [selectedIds, trashItems]);

    const toggleSelectAll = () => {
        setSelectedIds(allSelected ? [] : trashItems.map(item => item.trashId));
    };

    const toggleItem = (trashId) => {
        setSelectedIds(current => (
            current.includes(trashId)
                ? current.filter(id => id !== trashId)
                : [...current, trashId]
        ));
    };

    const reloadFromFirstPage = useCallback(() => {
        if (page === 0) {
            fetchTrashItems();
            return;
        }
        setPage(0);
    }, [fetchTrashItems, page]);

    const executeTrashAction = async ({ url, trashIds, successTitle, successMessage }) => {
        const response = await gateway.post(url, { trashIds });
        if (!isSuccessResponse(response)) {
            throw new Error(getErrorMessage(response, "요청 처리 중 오류가 발생했습니다."));
        }

        setTrashTotalCount(current => Math.max(0, current - trashIds.length));
        reloadFromFirstPage();
        openAlert({ type: "success", title: successTitle, message: successMessage });
    };

    const openActionConfirm = ({ action, items }) => {
        const trashIds = items.map(item => item.trashId);
        const isRestore = action === "restore";
        const itemLabel = items.length === 1 ? `'${items[0].itemName}'` : `${items.length}개 항목`;

        openConfirm({
            type: isRestore ? "info" : "error",
            title: isRestore ? "선택한 항목을 복원할까요?" : "선택한 항목을 영구 삭제할까요?",
            message: isRestore
                ? `${itemLabel}을(를) 원래 위치로 복원합니다. 원래 폴더가 없으면 내 파일로 이동합니다.`
                : `${itemLabel}은(는) 저장소에서도 삭제되며 이후 복구할 수 없습니다.`,
            confirmBtn: isRestore ? "복원" : "영구 삭제",
            onConfirm: async () => {
                try {
                    await executeTrashAction({
                        url: isRestore ? "/nas/api/v1/trash/restore" : "/nas/api/v1/trash/purge",
                        trashIds,
                        successTitle: isRestore ? "복원 완료" : "영구 삭제 완료",
                        successMessage: isRestore
                            ? `${itemLabel}을(를) 복원했습니다.`
                            : `${itemLabel}을(를) 영구 삭제했습니다.`,
                    });
                } catch (error) {
                    console.error(error);
                    openAlert({
                        type: "error",
                        title: isRestore ? "복원 실패" : "영구 삭제 실패",
                        message: error.message,
                    });
                }
            },
        });
    };

    const openEmptyConfirm = () => {
        openConfirm({
            type: "error",
            title: "휴지통을 비울까요?",
            message: `휴지통의 ${trashTotalCount}개 항목이 저장소에서도 삭제되며 이후 복구할 수 없습니다.`,
            confirmBtn: "휴지통 비우기",
            onConfirm: async () => {
                try {
                    const response = await gateway.post("/nas/api/v1/trash/empty");
                    if (!isSuccessResponse(response)) {
                        throw new Error(getErrorMessage(response, "휴지통을 비우지 못했습니다."));
                    }

                    setPage(0);
                    setTrashTotalCount(0);
                    await fetchTrashItems();
                    openAlert({
                        type: "success",
                        title: "휴지통 비우기 완료",
                        message: "휴지통의 모든 항목을 영구 삭제했습니다.",
                    });
                } catch (error) {
                    console.error(error);
                    openAlert({ type: "error", title: "휴지통 비우기 실패", message: error.message });
                }
            },
        });
    };

    return (
        <main className="trash-page" aria-labelledby="trash-page-title">
            <div className="trash-page-inner">
                <section className="trash-hero">
                    <div className="trash-hero-copy">
                        <span className="trash-eyebrow">RECOVERY SPACE</span>
                        <div className="trash-title-row">
                            <div className="trash-title-icon" aria-hidden="true"><Trash2 /></div>
                            <div>
                                <h1 id="trash-page-title">휴지통</h1>
                                <p>실수로 삭제한 파일과 폴더를 안전하게 복원할 수 있어요.</p>
                            </div>
                        </div>
                        <div className="trash-retention-inline" aria-label="휴지통 보관 정책">
                            <Clock3 aria-hidden="true" />
                            <span><strong>30일 동안 보관</strong> 후 자동으로 영구 삭제됩니다.</span>
                            <span className="trash-retention-status"><ShieldCheck aria-hidden="true" /> 자동 정리</span>
                        </div>
                    </div>

                    <div className="trash-hero-actions">
                    <span className="trash-count-badge">
                        <ArchiveRestore aria-hidden="true" /><strong>{trashTotalCount}</strong>개 항목
                    </span>
                        <button
                            type="button"
                            className="trash-empty-button"
                            disabled={trashTotalCount === 0 || loading}
                            title={trashTotalCount > 0 ? "휴지통 비우기" : "삭제된 항목이 없습니다"}
                            onClick={openEmptyConfirm}
                        >
                            <Trash2 aria-hidden="true" /> 휴지통 비우기
                        </button>
                    </div>
                </section>

                <section className="trash-content" aria-labelledby="trash-content-title">
                    <header className="trash-content-header">
                        <div className="trash-content-heading">
                            <div>
                                <h2 id="trash-content-title">삭제된 항목</h2>
                                <p>복원하거나 더 이상 필요하지 않은 항목을 영구 삭제할 수 있습니다.</p>
                            </div>
                            <label className="trash-search">
                                <Search aria-hidden="true" />
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={event => setSearchQuery(event.target.value)}
                                    placeholder="삭제된 항목 검색"
                                    aria-label="휴지통 검색"
                                />
                                {searchQuery && (
                                    <button type="button" onClick={() => setSearchQuery("")} aria-label="검색어 지우기">
                                        <X aria-hidden="true" />
                                    </button>
                                )}
                            </label>
                        </div>

                        {hasTrashItems && (
                            <div className={`trash-selection-bar${hasSelection ? " is-active" : ""}`}>
                                <label className="trash-select-all">
                                    <input ref={selectAllRef} type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
                                    <span>전체 선택</span>
                                </label>
                                <span className="trash-selected-count">
                                {hasSelection ? `${selectedIds.length}개 선택됨` : "항목을 선택해 주세요"}
                            </span>
                                <div className="trash-bulk-actions">
                                    <button
                                        type="button"
                                        className="trash-action-restore"
                                        disabled={!hasSelection}
                                        onClick={() => openActionConfirm({ action: "restore", items: selectedItems })}
                                    >
                                        <ArchiveRestore aria-hidden="true" /> 선택 복원
                                    </button>
                                    <button
                                        type="button"
                                        className="trash-action-purge"
                                        disabled={!hasSelection}
                                        onClick={() => openActionConfirm({ action: "purge", items: selectedItems })}
                                    >
                                        <Trash2 aria-hidden="true" /> 영구 삭제
                                    </button>
                                </div>
                            </div>
                        )}
                    </header>

                    {loading ? (
                        <div className="trash-loading" role="status">
                            <LoaderCircle aria-hidden="true" />
                            <strong>휴지통을 불러오는 중입니다</strong>
                            <span>삭제된 항목을 확인하고 있어요.</span>
                        </div>
                    ) : loadError ? (
                        <div className="trash-error-state" role="alert">
                            <div className="trash-error-icon"><RefreshCw aria-hidden="true" /></div>
                            <h3>휴지통을 불러오지 못했습니다</h3>
                            <p>잠시 후 다시 시도해 주세요.</p>
                            <button type="button" onClick={fetchTrashItems}>
                                <RefreshCw aria-hidden="true" /> 다시 시도
                            </button>
                        </div>
                    ) : hasTrashItems ? (
                        <>
                            <div className="trash-list" role="list">
                                {trashItems.map(item => {
                                    const ItemIcon = getItemIcon(item);
                                    const selected = selectedIds.includes(item.trashId);
                                    const remainingDays = Math.max(0, item.remainingDays ?? 0);
                                    const itemKind = item.itemType === "FOLDER" ? "folder" : getFileKind(item.extension);

                                    return (
                                        <article
                                            key={item.trashId}
                                            className={`trash-item${selected ? " is-selected" : ""}`}
                                            role="listitem"
                                        >
                                            <label className="trash-item-checkbox" aria-label={`${item.itemName} 선택`}>
                                                <input type="checkbox" checked={selected} onChange={() => toggleItem(item.trashId)} />
                                            </label>
                                            <TrashItemThumbnail item={item} itemKind={itemKind} ItemIcon={ItemIcon} />
                                            <div className="trash-item-main">
                                                <strong title={item.itemName}>{item.itemName}</strong>
                                                <div className="trash-item-meta">
                                                    <span>{item.itemType === "FOLDER" ? "폴더" : formatBytes(item.itemSize)}</span>
                                                    <span>삭제 {formatDeletedAt(item.deletedAt)}</span>
                                                </div>
                                            </div>
                                            <div className={`trash-item-expiry${remainingDays <= 3 ? " is-urgent" : ""}`}>
                                                <Clock3 aria-hidden="true" />
                                                {remainingDays === 0 ? "오늘 자동 삭제" : `${remainingDays}일 남음`}
                                            </div>
                                            <div className="trash-item-actions">
                                                <button
                                                    type="button"
                                                    className="trash-action-restore"
                                                    onClick={() => openActionConfirm({ action: "restore", items: [item] })}
                                                    aria-label={`${item.itemName} 복원`}
                                                >
                                                    <ArchiveRestore aria-hidden="true" /><span>복원</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="trash-action-purge"
                                                    onClick={() => openActionConfirm({ action: "purge", items: [item] })}
                                                    aria-label={`${item.itemName} 영구 삭제`}
                                                >
                                                    <Trash2 aria-hidden="true" /><span>삭제</span>
                                                </button>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>

                            {totalPages > 1 && (
                                <nav className="trash-pagination" aria-label="휴지통 페이지 이동">
                                    <button type="button" disabled={page === 0} onClick={() => setPage(current => Math.max(0, current - 1))}>
                                        <ChevronLeft aria-hidden="true" /> 이전
                                    </button>
                                    <span><strong>{page + 1}</strong> / {totalPages}</span>
                                    <button type="button" disabled={page + 1 >= totalPages} onClick={() => setPage(current => current + 1)}>
                                        다음 <ChevronRight aria-hidden="true" />
                                    </button>
                                </nav>
                            )}
                        </>
                    ) : (
                        <div className="trash-empty-state">
                            <div className="trash-empty-visual" aria-hidden="true">
                                <span className="trash-empty-orbit trash-empty-orbit-one" />
                                <span className="trash-empty-orbit trash-empty-orbit-two" />
                                <div className="trash-empty-icon">
                                    <Trash2 />
                                    <span className="trash-empty-check"><ShieldCheck /></span>
                                </div>
                            </div>
                            <span className="trash-empty-eyebrow">ALL CLEAR</span>
                            <h3>{debouncedQuery ? "검색 결과가 없습니다" : "휴지통이 비어 있습니다"}</h3>
                            <p>
                                {debouncedQuery
                                    ? `'${debouncedQuery}'에 해당하는 삭제 항목을 찾지 못했습니다.`
                                    : "삭제한 파일과 폴더가 여기에 표시됩니다. 지금은 정리할 항목이 없어요."}
                            </p>
                            {debouncedQuery ? (
                                <button type="button" onClick={() => setSearchQuery("")}>
                                    <X aria-hidden="true" /> 검색 초기화
                                </button>
                            ) : (
                                <button type="button" onClick={() => rootFolderId ? navigate(`/main/${rootFolderId}`) : navigate(-1)}>
                                    <HardDrive aria-hidden="true" /> 내 파일로 돌아가기
                                </button>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
