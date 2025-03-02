import { createContext, useState, useEffect } from 'react';

// Define hardcoded users for authentication
const USERS = [
  { id: 1, email: 'admin@pipeline.com', password: 'admin123', role: 'admin', name: 'Admin User' },
  { id: 2, email: 'engineer@pipeline.com', password: 'engineer123', role: 'engineer', name: 'Engineer User' },
  { id: 3, email: 'designer@pipeline.com', password: 'designer123', role: 'designer', name: 'Designer User' }
];

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user data exists in localStorage
    const userData = localStorage.getItem('pipelineUser');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Find user in our hardcoded list
    const user = USERS.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Remove password from user object before storing
      const { password, ...userWithoutPassword } = user;
      
      // Create a fake token (in a real app, this would come from the server)
      const token = btoa(JSON.stringify({ 
        id: user.id, 
        email: user.email, 
        role: user.role,
        exp: new Date().getTime() + (3600 * 1000) // 1 hour expiration
      }));
      
      // Store user with token in state and localStorage
      const authenticatedUser = { 
        ...userWithoutPassword, 
        token,
        lastLogin: new Date().toISOString()
      };
      
      setCurrentUser(authenticatedUser);
      localStorage.setItem('pipelineUser', JSON.stringify(authenticatedUser));
      
      // Add activity record to localStorage
      const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
      activities.push({
        userId: user.id,
        userName: user.name,
        action: 'login',
        timestamp: new Date().toISOString(),
        details: `${user.role} logged in`
      });
      localStorage.setItem('userActivities', JSON.stringify(activities));
      
      return { success: true, user: authenticatedUser };
    }
    
    return { success: false, message: 'Invalid email or password' };
  };

  const logout = () => {
    if (currentUser) {
      // Add logout activity record
      const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
      activities.push({
        userId: currentUser.id,
        userName: currentUser.name,
        action: 'logout',
        timestamp: new Date().toISOString(),
        details: `${currentUser.role} logged out`
      });
      localStorage.setItem('userActivities', JSON.stringify(activities));
    }
    
    setCurrentUser(null);
    localStorage.removeItem('pipelineUser');
  };

  const checkAuth = () => {
    if (!currentUser) return false;
    
    try {
      // In a real app, we would verify the token with the server
      // Here we just check if the token has expired
      const tokenData = atob(currentUser.token);
      const tokenPayload = JSON.parse(tokenData);
      const isExpired = tokenPayload.exp < new Date().getTime();
      
      if (isExpired) {
        logout();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking authentication:', error);
      logout();
      return false;
    }
  };

  // Track user activity
  const logActivity = (action, details = '') => {
    if (!currentUser) return;
    
    const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
    activities.push({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      timestamp: new Date().toISOString(),
      details
    });
    localStorage.setItem('userActivities', JSON.stringify(activities));
  };

  const value = {
    currentUser,
    login,
    logout,
    checkAuth,
    logActivity,
    isAdmin: currentUser?.role === 'admin',
    isEngineer: currentUser?.role === 'engineer',
    isDesigner: currentUser?.role === 'designer',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};