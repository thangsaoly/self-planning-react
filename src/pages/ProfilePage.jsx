import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import * as userService from "../services/userService";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function ProfilePage() {
  const { token, user: authUser } = useAuth();
  const { addToast } = useToast();
  
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
  }, [token, addToast]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const result = await userService.updateProfile(token, editForm);
    if (result.success) {
      addToast("Profile updated successfully", "success");
      setProfile({ ...profile, name: result.data.name, email: result.data.email });
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
    
    if (result.success) {
      addToast("Password changed successfully", "success");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      addToast(result.error, "error");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[color:var(--color-bg-primary)] flex items-center justify-center">
        <div className="text-[color:var(--color-text-primary)]">Loading profile...</div>
      </div>
    );
  }

  const initials = profile.name ? profile.name.split(" ").map(n => n[0]).join("").toUpperCase() : "?";

  return (
    <div className="min-h-screen bg-[color:var(--color-bg-primary)] font-['Poppins',sans-serif] pb-14">
      <div className="flex items-center justify-center w-full">
        <NavBar />
      </div>

      <div className="max-w-4xl mx-auto mt-28 px-4 flex flex-col gap-8">
        <h1 className="text-3xl font-bold text-[color:var(--color-text-primary)]">User Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-[color:var(--color-bg-card)] rounded-xl p-6 shadow-md flex flex-col items-center gap-4 text-center">
              <div className="w-24 h-24 rounded-full bg-[color:var(--color-primary-blue)] flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                {initials}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">{profile.name}</h2>
                <p className="text-[color:var(--color-text-secondary)] text-sm">{profile.email}</p>
              </div>
              <div className="w-full pt-4 border-t border-[color:var(--color-border-primary)] text-xs text-[color:var(--color-text-muted)]">
                Member since: {new Date(profile.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Edit Forms */}
          <div className="md:col-span-2 flex flex-col gap-8">
            {/* Edit Profile */}
            <div className="bg-[color:var(--color-bg-card)] rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-[color:var(--color-text-primary)] mb-4">Edit Profile</h3>
              <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-[color:var(--color-text-secondary)]">Full Name</label>
                  <input 
                    type="text" 
                    value={editForm.fullname}
                    onChange={(e) => setEditForm({...editForm, fullname: e.target.value})}
                    className="bg-[color:var(--color-bg-secondary)] text-[color:var(--color-text-primary)] border border-[color:var(--color-border-primary)] rounded-lg px-4 py-2 outline-none focus:border-[color:var(--color-primary-blue)]"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-[color:var(--color-text-secondary)]">Email Address</label>
                  <input 
                    type="email" 
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="bg-[color:var(--color-bg-secondary)] text-[color:var(--color-text-primary)] border border-[color:var(--color-border-primary)] rounded-lg px-4 py-2 outline-none focus:border-[color:var(--color-primary-blue)]"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-[color:var(--color-primary-blue)] text-white font-medium py-2 rounded-lg hover:brightness-110 transition-all mt-2"
                >
                  Save Changes
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div className="bg-[color:var(--color-bg-card)] rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-[color:var(--color-text-primary)] mb-4">Change Password</h3>
              <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-[color:var(--color-text-secondary)]">Old Password</label>
                  <input 
                    type="password" 
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                    className="bg-[color:var(--color-bg-secondary)] text-[color:var(--color-text-primary)] border border-[color:var(--color-border-primary)] rounded-lg px-4 py-2 outline-none focus:border-[color:var(--color-primary-blue)]"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-[color:var(--color-text-secondary)]">New Password</label>
                  <input 
                    type="password" 
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    className="bg-[color:var(--color-bg-secondary)] text-[color:var(--color-text-primary)] border border-[color:var(--color-border-primary)] rounded-lg px-4 py-2 outline-none focus:border-[color:var(--color-primary-blue)]"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-[color:var(--color-text-secondary)]">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    className="bg-[color:var(--color-bg-secondary)] text-[color:var(--color-text-primary)] border border-[color:var(--color-border-primary)] rounded-lg px-4 py-2 outline-none focus:border-[color:var(--color-primary-blue)]"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-[color:var(--color-primary-blue)] text-white font-medium py-2 rounded-lg hover:brightness-110 transition-all mt-2"
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
    </div>
  );
}
