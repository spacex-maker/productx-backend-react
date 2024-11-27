import React, { useRef } from 'react';
import { Modal } from 'antd';
import './ImageOrVideoModal.css'
const ImageOrVideoModal = ({ isImageModalVisible, fullscreenImage, handleImageModalCancel }) => {
    // Reference to the video element
    const videoRef = useRef(null);

    // Handle modal close
    const handleCancel = () => {
        // Pause the video when the modal is closed
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0; // Optional: Reset the video to the beginning
        }
        handleImageModalCancel();
    };

    // Check if the fullscreenImage URL is a video
    const isVideo = fullscreenImage?.endsWith('.mp4') || fullscreenImage?.endsWith('.mov'); // Add other video formats if needed

    return (
        <Modal
            open={isImageModalVisible}
            footer={null}
            styles={{ padding: '0' }} // 设置 Modal 内容区域的 padding
            onCancel={handleCancel}
            style={{ width: '100%', maxHeight: '90vh' ,padding: '0px 0px'}}
            zIndex={2000}
        >
            {fullscreenImage && (
                isVideo ? (
                    <video
                        controls
                        style={{ width: '100%' }}
                        src={fullscreenImage}
                        ref={videoRef}
                    />
                ) : (
                    <img src={fullscreenImage} style={{ width: '100%',borderRadius: '2rem' }} alt="fullscreen" />
                )
            )}
        </Modal>
    );
};

export default ImageOrVideoModal;
