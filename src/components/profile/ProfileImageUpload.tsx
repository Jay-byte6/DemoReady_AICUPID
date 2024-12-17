import React, { useRef, useState } from 'react';
import { Camera, X, Upload, Loader2 } from 'lucide-react';
import { profileService } from '../../services/supabaseService';

interface Props {
  userId: string;
  currentImage: string | null;
  onImageUpdate: (newImageUrl: string) => void;
}

const ProfileImageUpload: React.FC<Props> = ({ userId, currentImage, onImageUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      const updatedProfile = await profileService.uploadProfileImage(userId, file);
      if (updatedProfile?.profile_image) {
        onImageUpdate(updatedProfile.profile_image);
      }
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setError(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentImage) return;

    try {
      setIsUploading(true);
      setError(null);

      await profileService.deleteProfileImage(userId);
      onImageUpdate('');
    } catch (err: any) {
      console.error('Error deleting image:', err);
      setError(err.message || 'Failed to delete image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
        {currentImage ? (
          <img
            src={currentImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <Camera className="w-16 h-16 text-indigo-300" />
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      <div className="absolute -bottom-2 -right-2 flex space-x-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 disabled:bg-gray-100"
          title="Upload new image"
        >
          {isUploading ? (
            <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
          ) : (
            <Upload className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {currentImage && (
          <button
            onClick={handleDelete}
            disabled={isUploading}
            className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 disabled:bg-gray-100"
            title="Remove image"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      {error && (
        <div className="absolute top-full mt-2 w-48 bg-red-50 text-red-600 text-sm p-2 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default ProfileImageUpload; 