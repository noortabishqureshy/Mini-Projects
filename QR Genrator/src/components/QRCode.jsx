import React, { useState } from 'react';

const QRCodeGenerator = () => {
    const [qrValue, setQrValue] = useState('');
    const [qrImage, setQrImage] = useState('');
    const [preValue, setPreValue] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const handleGenerateQRCode = () => {
        if (!qrValue || preValue === qrValue) return;

        setPreValue(qrValue);
        setIsGenerating(true);
        setQrImage(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrValue}`);

        const img = new Image();
        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrValue}`;
        img.onload = () => {
            setIsGenerating(false);
            setIsActive(true);
        };
    };

    const handleDownloadQRCode = () => {
        const qrCodeUrl = qrImage;
        const img = new Image();
        img.crossOrigin = 'Anonymous';

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            canvas.toBlob((blob) => {
                const link = document.createElement('a');
                const url = URL.createObjectURL(blob);
                link.href = url;
                link.download = 'qr-code.png';
                link.click();
                URL.revokeObjectURL(url);
            }, 'image/png');
        };

        img.src = qrCodeUrl;
    };

    return (
        <div className={`wrapper ${isActive ? 'active' : ''}`}>
            <header>
                <h1>QR Code Generator</h1>
                <p>Paste a url or enter text to create QR code</p>
            </header>
            <div className="form">
                <input
                    type="text"
                    placeholder="Enter text or url"
                    value={qrValue}
                    onChange={(e) => setQrValue(e.target.value)}
                    onKeyUp={() => {
                        if (!qrValue.trim()) {
                            setIsActive(false);
                            setQrImage('');
                            setPreValue('');
                        }
                    }}
                />
                <button onClick={handleGenerateQRCode} disabled={isGenerating}>
                    {isGenerating ? 'Generating QR Code...' : 'Generate QR Code'}
                </button>
                {qrImage && (
                    <button
                        id="downloadBtn"
                        style={{ display: isActive ? 'block' : 'none' }}
                        onClick={handleDownloadQRCode}
                    >
                        Download QR Code
                    </button>
                )}
            </div>
            <div className="qr-code" style={{ opacity: isActive ? 1 : 0 }}>
                {qrImage && <img src={qrImage} alt="qr-code" />}
            </div>
        </div>
    );
};

export default QRCodeGenerator;
