import React, { useRef } from 'react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { Printer, X } from 'lucide-react';
import { Student } from '@/types';
import QRCode from 'react-qr-code';

interface Props {
    show: boolean;
    onClose: () => void;
    student: Student | null;
}

export default function BarcodeModal({ show, onClose, student }: Props) {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        const printContent = printRef.current;
        if (!printContent) return;

        const originalContents = document.body.innerHTML;
        const newWindow = window.open('', '_blank', 'width=800,height=600');
        
        if (newWindow) {
            newWindow.document.write(`
                <html>
                    <head>
                        <title>Cetak QR Code - ${student?.name}</title>
                        <style>
                            body {
                                font-family: sans-serif;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                height: 100vh;
                                margin: 0;
                                background-color: white;
                            }
                            .card {
                                border: 2px solid #333;
                                border-radius: 12px;
                                padding: 30px;
                                text-align: center;
                                width: 350px;
                            }
                            .school-name {
                                font-size: 18px;
                                font-weight: bold;
                                margin-bottom: 5px;
                                text-transform: uppercase;
                            }
                            .title {
                                font-size: 14px;
                                margin-bottom: 20px;
                                color: #555;
                            }
                            .student-name {
                                font-size: 20px;
                                font-weight: bold;
                                margin-top: 15px;
                                margin-bottom: 5px;
                            }
                            .nis {
                                font-size: 16px;
                                color: #666;
                            }
                            .barcode-container {
                                display: flex;
                                justify-content: center;
                                margin: 20px 0;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="card">
                            <div class="school-name">Pondok Pesantren Mawar</div>
                            <div class="title">KARTU IDENTITAS SANTRI</div>
                            <div class="barcode-container">
                                ${printContent.innerHTML}
                            </div>
                            <div class="student-name">${student?.name}</div>
                            <div class="nis">NIS: ${student?.nis}</div>
                        </div>
                        <script>
                            window.onload = function() {
                                window.print();
                                setTimeout(function() { window.close(); }, 500);
                            }
                        </script>
                    </body>
                </html>
            `);
            newWindow.document.close();
        }
    };

    if (!student) return null;

    return (
        <Modal show={show} onClose={onClose} maxWidth="sm">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">QR Code Santri</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center mb-6">
                    <p className="text-sm font-medium text-gray-500 mb-4">Gunakan QR Code ini untuk Absensi</p>
                    
                    <div ref={printRef} className="bg-white p-4 rounded-xl shadow-sm inline-block mx-auto">
                        <QRCode 
                            value={student.nis} 
                            size={256}
                            level="M"
                        />
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mt-4">{student.name}</h3>
                    <p className="text-sm text-gray-500">NIS: {student.nis}</p>
                </div>

                <div className="flex justify-end gap-3">
                    <SecondaryButton onClick={onClose}>
                        Tutup
                    </SecondaryButton>
                    <button
                        onClick={handlePrint}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-xl font-bold text-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-50 transition-all shadow-sm"
                    >
                        <Printer className="w-4 h-4 mr-2" />
                        Cetak QR Code
                    </button>
                </div>
            </div>
        </Modal>
    );
}
