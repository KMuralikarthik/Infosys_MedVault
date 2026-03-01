import React, { useState, useEffect, useRef } from 'react';
import { FileText, Download, Trash2, Upload, Eye, Shield, Users, Lock, Unlock } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const MedicalRecords = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('records'); // 'records' or 'consent'
    const [records, setRecords] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All Records');
    const [dragActive, setDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    // Consent Management State
    const [doctors, setDoctors] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sharedAccess, setSharedAccess] = useState([]);


    const fetchInitialData = async () => {
        try {
            // Fetch records
            const recordsRes = await api.get('/records/my');
            if (recordsRes.data.success) {
                setRecords(recordsRes.data.data);
            }

            // Fetch doctors for consent sharing
            const docsRes = await api.get('/doctors');
            if (docsRes.data.success) {
                setDoctors(docsRes.data.data);
            }

            // In a real app we'd fetch active grants from backend. 
            // Mocking active grants for now since we don't have a GET /records/access endpoint for patients
            setSharedAccess([]);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleUpload(files[0]);
        }
    };

    const handleUpload = async (file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name);
        formData.append('category', 'Lab Report'); // Default or user selection
        formData.append('notes', '');

        setIsUploading(true);
        try {
            const response = await api.post('/records', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            if (response.data.success) {
                alert(`File "${file.name}" uploaded successfully!`);
                fetchRecords(); // Refresh the list
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload file");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            try {
                const response = await api.delete(`/records/${id}`);
                if (response.data.success) {
                    setRecords(records.filter(r => r.id !== id));
                    alert("Record deleted successfully");
                }
            } catch (error) {
                console.error("Delete error:", error);
                alert("Failed to delete record");
            }
        }
    };

    const categories = ['All Records', 'Prescriptions', 'Lab Report', 'Diagnosis'];

    const filteredRecords = records.filter(record => {
        if (activeCategory === 'All Records') return true;
        return record.category === activeCategory || record.category + 's' === activeCategory;
    });

    const handleGrantAccess = async (doctorId) => {
        try {
            const res = await api.post('/records/access/grant', { doctorId, days: 30 });
            if (res.data.success) {
                alert("Access granted successfully");
                // Update local mock state
                const doctorInfo = doctors.find(d => d.id === doctorId);
                setSharedAccess([...sharedAccess, { doctorId, doctorName: doctorInfo.name, days: 30 }]);
            }
        } catch (err) {
            alert("Failed to grant access");
        }
    };

    const handleRevokeAccess = async (doctorId) => {
        try {
            const res = await api.post('/records/access/revoke', { doctorId });
            if (res.data.success) {
                alert("Access revoked");
                setSharedAccess(sharedAccess.filter(s => s.doctorId !== doctorId));
            }
        } catch (err) {
            alert("Failed to revoke access");
        }
    };

    const hasAccess = (doctorId) => sharedAccess.some(s => s.doctorId === doctorId);

    const filteredDoctors = doctors.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.specialty.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div>
            <div className="mb-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Medical Records</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Securely store and share your medical history.</p>
                </div>

                <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.25rem', borderRadius: '8px' }}>
                    <button
                        onClick={() => setActiveTab('records')}
                        style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', background: activeTab === 'records' ? 'white' : 'transparent', color: activeTab === 'records' ? '#0ea5e9' : '#64748b', fontWeight: activeTab === 'records' ? 600 : 400, boxShadow: activeTab === 'records' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                        <FileText size={16} /> My Records
                    </button>
                    <button
                        onClick={() => setActiveTab('consent')}
                        style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', background: activeTab === 'consent' ? 'white' : 'transparent', color: activeTab === 'consent' ? '#10b981' : '#64748b', fontWeight: activeTab === 'consent' ? 600 : 400, boxShadow: activeTab === 'consent' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                        <Shield size={16} /> Consent Management
                    </button>
                </div>
            </div>

            {activeTab === 'records' ? (
                <>
                    {/* Upload Area */}
                    <div
                        className="card"
                        style={{
                            marginBottom: '2rem',
                            border: dragActive ? '2px dashed var(--primary)' : '2px dashed var(--border-color)',
                            backgroundColor: dragActive ? 'var(--bg-subtle)' : 'var(--bg-card)',
                            textAlign: 'center',
                            padding: '3rem',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer'
                        }}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <div
                            onClick={() => fileInputRef.current.click()}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={(e) => e.target.files[0] && handleUpload(e.target.files[0])}
                                style={{ display: 'none' }}
                            />
                            <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '50%', color: 'var(--primary)' }}>
                                <Upload size={32} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Click to upload or drag and drop</h3>
                                <p style={{ color: 'var(--text-muted)' }}>SVG, PNG, JPG or PDF (max. 10MB)</p>
                            </div>
                            <button className="btn btn-primary" type="button">Select File</button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`btn ${activeCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                                style={{
                                    borderRadius: '20px',
                                    padding: '0.5rem 1.25rem',
                                    border: activeCategory === cat ? 'none' : '1px solid var(--border-color)',
                                    color: activeCategory === cat ? 'white' : 'var(--text-muted)',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Records Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {filteredRecords.map(record => (
                            <div key={record.id} className="card" style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '8px',
                                            backgroundColor: '#f1f5f9',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--text-muted)'
                                        }}>
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>{record.title}</h4>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                                                {record.category} • {record.uploadDate ? new Date(record.uploadDate).toLocaleDateString() : 'Unknown Date'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                                    <button
                                        onClick={() => alert(`Viewing ${record.title} at URL: ${record.fileUrl}`)}
                                        className="btn btn-outline"
                                        style={{ padding: '0.4rem', color: 'var(--text-muted)', border: 'none', background: '#f8fafc' }}
                                        title="View"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button
                                        onClick={() => alert(`Downloading ${record.title}`)}
                                        className="btn btn-outline"
                                        style={{ padding: '0.4rem', color: 'var(--text-muted)', border: 'none', background: '#f8fafc' }}
                                        title="Download"
                                    >
                                        <Download size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(record.id)}
                                        className="btn btn-outline"
                                        style={{ padding: '0.4rem', color: '#ef4444', border: 'none', background: '#fef2f2' }}
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '2rem' }}>

                    {/* Doctors Search for Sharing */}
                    <div>
                        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><Users size={20} color="#0ea5e9" /> Share Records with Doctors</h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>Search for doctors within the MedVault network to grant them temporary access to your medical history.</p>

                            <input
                                type="text"
                                placeholder="Search by doctor name or specialty..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}
                            />

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {filteredDoctors.length === 0 ? (
                                    <p style={{ color: '#94a3b8', textAlign: 'center', padding: '1rem' }}>No doctors found.</p>
                                ) : (
                                    filteredDoctors.slice(0, 5).map(doc => (
                                        <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontWeight: 'bold' }}>
                                                    {doc.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 style={{ margin: 0 }}>{doc.name}</h4>
                                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{doc.specialty}</p>
                                                </div>
                                            </div>
                                            <div>
                                                {hasAccess(doc.id) ? (
                                                    <button onClick={() => handleRevokeAccess(doc.id)} style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid #ef4444', color: '#ef4444', backgroundColor: '#fef2f2', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                                                        <Lock size={14} /> Revoke
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleGrantAccess(doc.id)} style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid #10b981', color: '#10b981', backgroundColor: '#f0fdf4', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                                                        <Unlock size={14} /> Grant (30 days)
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Active Shared Access Sidebar */}
                    <div>
                        <div className="card" style={{ padding: '1.5rem' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1.1rem' }}><Shield size={18} color="#10b981" /> Active Grants</h3>

                            {sharedAccess.length === 0 ? (
                                <p style={{ fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center', padding: '2rem 0' }}>You have not shared your records with any doctor.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {sharedAccess.map(access => (
                                        <div key={access.doctorId} style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
                                            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{access.doctorName}</p>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>Expires in {access.days} days</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default MedicalRecords;
