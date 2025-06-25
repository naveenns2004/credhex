import React from 'react';

const UploadSection = ({ isUploading, onFileUpload, fileInputRef, onUploadAreaClick }) => {
  return (
    <section className="upload-section">
      <div className="upload-header">
        <h2 className="upload-title">
          <span className="material-icons-outlined upload-title-icon">cloud_upload</span>
          Upload Your Certificates
        </h2>
        <p className="upload-description">
          Securely store and manage your digital certificates in one place
        </p>
      </div>
      
      <div className="upload-area" onClick={onUploadAreaClick}>
        <div className="upload-content">
          <div className="upload-icon">
            {isUploading ? (
              <div className="loading-spinner"></div>
            ) : (
              <span className="material-icons-outlined">description</span>
            )}
          </div>
          <p className="upload-text">
            {isUploading ? 'Uploading certificates...' : 'Click to upload or drag and drop'}
          </p>
          <p className="upload-subtext">
            Support for PDF, JPG, PNG files up to 10MB each
          </p>
          <div className="upload-features">
            <div className="feature-item">
              <span className="material-icons-outlined">security</span>
              <span>Secure Storage</span>
            </div>
            <div className="feature-item">
              <span className="material-icons-outlined">cloud</span>
              <span>Cloud Backup</span>
            </div>
            <div className="feature-item">
              <span className="material-icons-outlined">download</span>
              <span>Easy Access</span>
            </div>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="file-input"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={onFileUpload}
          disabled={isUploading}
        />
      </div>
    </section>
  );
};

export default UploadSection;