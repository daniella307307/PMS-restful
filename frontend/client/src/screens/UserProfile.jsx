import React, { useEffect, useState } from 'react';
import { authApi, userProfileApi } from '../apis/userapi';
import { toast } from 'react-toastify';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userProfileApi.getMe();
        setUser(data);
        setFormData(data);
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Input change handlers
  const handleInputChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handlePasswordChange = (field) => (e) => {
    setPasswordData({ ...passwordData, [field]: e.target.value });
  };

  // Profile update handler
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const updatedUser = await userProfileApi.updateProfile(formData);
      setUser(updatedUser);
      toast.success('Profile updated successfully');
      setEditMode(false);
    } catch (error) {
      toast.error(error?.message || 'Failed to update profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Password change handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangingPassword(true);
    try {
      await userProfileApi.updatePassword(passwordData.currentPassword, passwordData.newPassword);
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (error) {
      toast.error(error?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = () => {
    authApi.logout();
  };

  if (loading) {
    return <div className="w-20 h-20 animate-spin mx-auto my-20 text-center">Loading profile...</div>;
  }

  if (!user) {
    return <div className="text-center py-10 text-red-600 text-4xl font-bold">User not found.</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">User Profile</h1>

      {!editMode ? (
        <div className="space-y-2 text-gray-700">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Birthday:</strong> {user.birthday ? new Date(user.birthday).toLocaleDateString() : '-'}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Status:</strong> {user.status}</p>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <input
            className="w-full p-2 border rounded"
            type="text"
            placeholder="Username"
            value={formData.username || ''}
            onChange={handleInputChange('username')}
            required
          />
          <input
            className="w-full p-2 border rounded"
            type="email"
            placeholder="Email"
            value={formData.email || ''}
            onChange={handleInputChange('email')}
            required
          />
          <input
            className="w-full p-2 border rounded"
            type="date"
            placeholder="Birthday"
            value={formData.birthday ? formData.birthday.slice(0, 10) : ''}
            onChange={handleInputChange('birthday')}
          />
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={updatingProfile}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:opacity-50"
            >
              {updatingProfile ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditMode(false);
                setFormData(user);
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <hr className="my-6" />

      <h2 className="text-xl font-semibold text-gray-800 mb-2">Change Password</h2>
      <form onSubmit={handleChangePassword} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          type="password"
          placeholder="Current Password"
          value={passwordData.currentPassword}
          onChange={handlePasswordChange('currentPassword')}
          required
        />
        <input
          className="w-full p-2 border rounded"
          type="password"
          placeholder="New Password"
          value={passwordData.newPassword}
          onChange={handlePasswordChange('newPassword')}
          required
        />
        <button
          type="submit"
          disabled={changingPassword}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition disabled:opacity-50"
        >
          {changingPassword ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}

export default UserProfile;
