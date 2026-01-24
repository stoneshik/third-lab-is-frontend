import axios, { AxiosError, type AxiosProgressEvent } from 'axios';
import React, { useRef, useState, type ChangeEvent, type JSX } from 'react';
import { baseURL } from '~/lib/axios';
import { tokenService } from '~/services/tokenService';
import './CsvUploadForm.scss';

interface UploadResponse {
    message: string;
    importedCount?: number;
    errors?: string[];
    status: 'SUCCESS' | 'FAILED';
}

interface UploadProgress {
    loaded: number;
    total: number;
    percentage: number;
}

export function CsvUploadForm(): JSX.Element {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [uploadProgress, setUploadProgress] = useState<UploadProgress>({ loaded: 0, total: 0, percentage: 0 });
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [importStats, setImportStats] = useState<{ importedCount?: number; errors?: string[] }>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;
        const file = files[0];
        if (!validateFile(file)) {
            return;
        }
        setSelectedFile(file);
        setUploadStatus('idle');
        setErrorMessage('');
        setSuccessMessage('');
        setImportStats({});
    };
    const validateFile = (file: File): boolean => {
        const allowedExtensions = new Set<string>(['.csv', 'text/csv']);
        const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        if (!allowedExtensions.has(fileExtension) && !allowedExtensions.has(file.type)) {
            setErrorMessage('Пожалуйста, выберите файл в формате CSV (.csv)');
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
                return false;
            }
        }
        const MB_250 = 250 * 1024 * 1024;
        const maxSize = MB_250;
        if (file.size > maxSize) {
            setErrorMessage(`Файл слишком большой. Максимальный размер: 100MB`);
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
                return false;
            }
        }
        return true;
    };
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedFile) {
            setErrorMessage('Пожалуйста, выберите файл для загрузки');
            return;
        }
        setUploadStatus('uploading');
        setErrorMessage('');
        setSuccessMessage('');
        setUploadProgress({ loaded: 0, total: selectedFile.size, percentage: 0 });
        const formData = new FormData();
        formData.append('file', selectedFile);
        const credentials = tokenService.get();
        if (credentials === null) {
            setErrorMessage('Пользователь не авторизован');
            return;
        }
        formData.append('userId', credentials.userId.toString());
        try {
            const response = await axios.post<UploadResponse>(
                `${baseURL}/api/v1/insertion/csv`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${credentials.accessToken}`
                    },
                    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                        if (progressEvent.total) {
                            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            setUploadProgress({
                                loaded: progressEvent.loaded,
                                total: progressEvent.total,
                                percentage
                            });
                        }
                    },
                    withCredentials: true
                }
            );
            setUploadStatus('success');
            setSuccessMessage(response.data.message);
            setImportStats({
                importedCount: response.data.importedCount,
                errors: response.data.errors
            });
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            setUploadStatus('error');
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<UploadResponse>;
                if (axiosError.response) {
                    const serverError = axiosError.response.data;
                    setErrorMessage(serverError.message || `Ошибка сервера: ${axiosError.response.status}`);
                    if (serverError.errors) {
                        setImportStats({errors: serverError.errors});
                    }
                } else if (axiosError.request) {
                    setErrorMessage('Не удалось соединиться с сервером. Проверьте подключение к интернету.');
                } else {
                    setErrorMessage('Ошибка при отправке запроса: ' + axiosError.message);
                }
            } else {
                setErrorMessage('Неизвестная ошибка при загрузке файла');
            }
        }
    };
    const handleCancel = () => {
        setSelectedFile(null);
        setUploadStatus('idle');
        setErrorMessage('');
        setSuccessMessage('');
        setImportStats({});
        setUploadProgress({ loaded: 0, total: 0, percentage: 0 });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    return (
        <div className="csv-upload-container">
        <div className="csv-upload-card">
            <h2 className="upload-title">Импорт музыкальных объектов из CSV файла</h2>
            <p className="upload-subtitle">
                Загрузите CSV файл с данными музыкальных групп для импорта в базу данных
            </p>
            <form onSubmit={handleSubmit} className="upload-form">
                {/* Поле выбора файла */}
                <div className="file-input-container">
                    <label htmlFor="csv-file" className="file-input-label">
                    <div className="file-input-area">
                        <div className="upload-icon">📁</div>
                            <div className="file-input-text">
                            <p className="file-input-title">
                                {selectedFile ? selectedFile.name : 'Выберите CSV файл'}
                            </p>
                            <p className="file-input-hint">
                                {selectedFile
                                ? `Размер: ${formatFileSize(selectedFile.size)}`
                                : 'Нажмите для выбора файла или перетащите сюда'
                                }
                            </p>
                        </div>
                    </div>
                    <input
                        ref={fileInputRef}
                        id="csv-file"
                        type="file"
                        accept=".csv,text/csv"
                        onChange={handleFileSelect}
                        className="file-input-hidden"
                        disabled={uploadStatus === 'uploading'}/>
                    </label>
                </div>
                {/* Информация о файле */}
                {selectedFile && (
                    <div className="file-info">
                        <div className="file-info-row">
                            <span className="file-info-label">Файл:</span>
                            <span className="file-info-value">{selectedFile.name}</span>
                        </div>
                        <div className="file-info-row">
                            <span className="file-info-label">Размер:</span>
                            <span className="file-info-value">{formatFileSize(selectedFile.size)}</span>
                        </div>
                        <div className="file-info-row">
                            <span className="file-info-label">Тип:</span>
                            <span className="file-info-value">{selectedFile.type || 'text/csv'}</span>
                        </div>
                    </div>
                )}
                {/* Прогресс-бар загрузки */}
                {uploadStatus === 'uploading' && (
                    <div className="upload-progress">
                        <div className="progress-bar-container">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${uploadProgress.percentage}%` }}/>
                        </div>
                        <div className="progress-info">
                            <span>Загрузка: {uploadProgress.percentage}%</span>
                            <span>
                            {formatFileSize(uploadProgress.loaded)} / {formatFileSize(uploadProgress.total)}
                            </span>
                        </div>
                    </div>
                )}
                {/* Кнопки действия */}
                <div className="form-actions">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="btn btn-secondary"
                        disabled={uploadStatus === 'uploading'}>
                        Отмена
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={!selectedFile || uploadStatus === 'uploading'}>
                    {uploadStatus === 'uploading' ? (
                        <>
                        <span className="spinner"></span>
                        Данные импортируются...
                        </>
                    ) : 'Загрузить файл'}
                    </button>
                </div>
            </form>
            {/* Сообщение об ошибке */}
            {errorMessage && (
            <div className="alert alert-error">
                <div className="alert-icon">❌</div>
                <div className="alert-content">
                <strong>Ошибка!</strong> {errorMessage}
                </div>
            </div>
            )}
            {/* Сообщение об успехе */}
            {successMessage && (
            <div className="alert alert-success">
                <div className="alert-icon">✅</div>
                <div className="alert-content">
                <strong>Успех!</strong> {successMessage}
                </div>
            </div>
            )}
            {/* Список ошибок импорта */}
            {importStats.errors && importStats.errors.length > 0 && (
            <div className="import-errors">
                <h3>Ошибки при импорте</h3>
                <div className="errors-list">
                {importStats.errors.slice(0, 10).map((error, index) => (
                    <div key={index} className="error-item">
                    <span className="error-badge">Строка {index + 1}</span>
                    <span className="error-message">{error}</span>
                    </div>
                ))}
                {importStats.errors.length > 10 && (
                    <div className="errors-more">
                    ... и еще {importStats.errors.length - 10} ошибок
                    </div>
                )}
                </div>
            </div>
            )}
            {/* Подсказка по формату CSV */}
            <div className="format-hint">
                <h4>Требования к CSV файлу:</h4>
                <ul>
                    <li>Разделитель: точка с запятой (;)</li>
                    <li>Кодировка: UTF-8</li>
                    <li>Заголовки столбцов в первой строке</li>
                    <li>Максимальный размер файла: 250MB</li>
                </ul>
            </div>
        </div>
        </div>
    );
};
