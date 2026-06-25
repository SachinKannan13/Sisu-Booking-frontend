import { createContext, useContext, useEffect, useState } from 'react';
import { getUserProfile } from '../lib/api.js';
import supabase from '../lib/supabase.js';

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        try {
          const { data } = await getUserProfile();
          setProfile(data);
          if (!data || !data.profile_complete) {
            setTimeout(() => setShowProfileSetup(true), 2000);
          }
        } catch (_) { /* non-fatal — profile is optional */ }
        setProfileLoaded(true);
      } else {
        setProfile(null);
        setProfileLoaded(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <ProfileContext.Provider value={{
      profile, setProfile, profileLoaded,
      showProfileSetup, setShowProfileSetup
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
