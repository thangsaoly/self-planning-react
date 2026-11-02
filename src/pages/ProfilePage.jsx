import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import * as userService from "../services/userService";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function ProfilePage() {
  const { token, updateUser, logout } = useAuth();
  const { addToast } = useToast();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    createdAt: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Edit Profile Form State
  const [editForm, setEditForm] = useState({
    fullname: "",
    email: "",
  });
  
  // Change Password Form State
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const result = await userService.getProfile(token);
      if (result.unauthorized) {
        logout();
        addToast("Session expired, please log in again", "error");
        return;
      }
      if (result.success) {
        setProfile(result.data);
        setEditForm({
          fullname: result.data.name,
          email: result.data.email,
        });
      } else {
        addToast(result.error, "error");
      }
      setIsLoading(false);
    };
    
    if (token) {
      fetchProfile();
    }
  }, [token, addToast, logout]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const result = await userService.updateProfile(token, editForm);
    if (result.unauthorized) {
      logout();
      addToast("Session expired, please log in again", "error");
      return;
    }
    if (result.success) {
      addToast("Profile updated successfully", "success");
      setProfile({ ...profile, name: result.data.name, email: result.data.email });
      updateUser({ name: result.data.name, email: result.data.email });
    } else {
      addToast(result.error, "error");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      addToast("Passwords do not match", "error");
      return;
    }
    
    const result = await userService.changePassword(token, {
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
    });
    
    if (result.unauthorized) {
      logout();
      addToast("Session expired, please log in again", "error");
      return;
    }
    if (result.success) {
      addToast("Password changed successfully", "success");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      addToast(result.error, "error");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-(--color-bg-primary) flex items-center justify-center">
        <div className="text-(--color-text-primary)">Loading profile...</div>
      </div>
    );
  }

  const handleLogoutClick = () => {
    setIsLogoutConfirmOpen(true);
  };

  const handleLogout = () => {
    setIsLogoutConfirmOpen(false);
    logout();
    addToast("Logged out successfully", "info");
  };

  const initials = profile.name ? profile.name.split(" ").map(n => n[0]).join("").toUpperCase() : "?";

  return (
    <div className="min-h-screen bg-(--color-bg-primary) font-['Poppins',sans-serif] pb-14">
      <div className="flex items-center justify-center w-full">
        <NavBar />
      </div>

      <div className="max-w-4xl mx-auto mt-28 px-4 flex flex-col gap-8">
        <h1 className="text-3xl font-bold text-(--color-text-primary)">User Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-(--color-bg-card) rounded-xl p-6 shadow-md flex flex-col items-center gap-4 text-center">
              <div className="w-24 h-24 rounded-full bg-(--color-primary-blue) flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                {initials}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-(--color-text-primary)">{profile.name}</h2>
                <p className="text-(--color-text-secondary) text-sm">{profile.email}</p>
              </div>
              <div className="w-full pt-4 border-t border-(--color-border-primary) text-xs text-(--color-text-muted)">
                Member since: {new Date(profile.createdAt).toLocaleDateString()}
              </div>
              <button
                type="button"
                onClick={handleLogoutClick}
                className="w-full flex items-center justify-center gap-2 text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/40 rounded-lg py-2 hover:bg-red-500/20 hover:border-red-500/60 transition-colors cursor-pointer mt-2"
              >
                <i className="fi fi-rr-sign-out-alt text-base flex items-center" aria-hidden="true" />
                Log Out
              </button>
            </div>
          </div>

          {/* Edit Forms */}
          <div className="md:col-span-2 flex flex-col gap-8">
            {/* Edit Profile */}
            <div className="bg-(--color-bg-card) rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-(--color-text-primary) mb-4">Edit Profile</h3>
              <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-(--color-text-secondary)">Full Name</label>
                  <input 
                    type="text" 
                    value={editForm.fullname}
                    onChange={(e) => setEditForm({...editForm, fullname: e.target.value})}
                    className="bg-(--color-bg-secondary) text-(--color-text-primary) border border-(--color-border-primary) rounded-lg px-4 py-2 outline-none focus:border-(--color-primary-blue)"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-(--color-text-secondary)">Email Address</label>
                  <input 
                    type="email" 
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="bg-(--color-bg-secondary) text-(--color-text-primary) border border-(--color-border-primary) rounded-lg px-4 py-2 outline-none focus:border-(--color-primary-blue)"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-(--color-primary-blue) text-white font-medium py-2 rounded-lg hover:brightness-110 transition-all mt-2"
                >
                  Save Changes
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div className="bg-(--color-bg-card) rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-(--color-text-primary) mb-4">Change Password</h3>
              <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-(--color-text-secondary)">Old Password</label>
                  <input 
                    type="password" 
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                    className="bg-(--color-bg-secondary) text-(--color-text-primary) border border-(--color-border-primary) rounded-lg px-4 py-2 outline-none focus:border-(--color-primary-blue)"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-(--color-text-secondary)">New Password</label>
                  <input 
                    type="password" 
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    className="bg-(--color-bg-secondary) text-(--color-text-primary) border border-(--color-border-primary) rounded-lg px-4 py-2 outline-none focus:border-(--color-primary-blue)"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-(--color-text-secondary)">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    className="bg-(--color-bg-secondary) text-(--color-text-primary) border border-(--color-border-primary) rounded-lg px-4 py-2 outline-none focus:border-(--color-primary-blue)"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-(--color-primary-blue) text-white font-medium py-2 rounded-lg hover:brightness-110 transition-all mt-2"
                >
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-center w-full pt-10">
        <Footer />
      </div>

      {/* Log out confirmation modal — same pattern as the navbar dialog */}
      {isLogoutConfirmOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setIsLogoutConfirmOpen(false)}
        >
          <div
            className="bg-(--color-bg-card) border border-(--color-border-primary) p-6 rounded-xl shadow-2xl animate-fade-in flex flex-col gap-4 max-w-sm w-[90%] pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-red-500">
              <i className="fi fi-rr-sign-out-alt text-2xl flex items-center" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-(--color-text-primary)">Log Out</h3>
            </div>
            <p className="text-sm text-(--color-text-secondary)">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex gap-3 justify-end mt-2">
              <button
                type="button"
                onClick={() => setIsLogoutConfirmOpen(false)}
                className="px-4 py-2 text-xs font-medium text-(--color-text-secondary) hover:text-(--color-text-primary) hover:bg-(--color-bg-secondary) rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 text-xs font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
