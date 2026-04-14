import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { LandingPage, Nav, styles } from "./App";
import TemplatesPage from "./pages/Templates/Templates";
import EditorPageWrapper from "./components/EditorPageWrapper";
import { PaymentPage, SuccessPage, Footer } from "./PaymentPages";
import PreviewPage from "./pages/PreviewPage";
import DownloadPage from "./pages/DownloadPage";
import AboutPage from "./pages/AboutPage";
import GoogleLogin from "./components/Auth/GoogleLogin";
import { supabase } from "./services/supabase";

function AppContent() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [user, setUser] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndRole = async (sessionUser) => {
       setUser(sessionUser);
       if (sessionUser) {
          // Check users table or fallback to metadata
          const { data } = await supabase.from('users').select('is_paid').eq('id', sessionUser.id).maybeSingle();
          if (data && data.is_paid) {
             setIsPaid(true);
          } else if (sessionUser.user_metadata?.is_paid) {
             setIsPaid(true);
          } else {
             setIsPaid(false);
          }
       } else {
          setIsPaid(false);
       }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchUserAndRole(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchUserAndRole(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const goTo = (p) => {
    if (!user && p !== "landing" && p !== "about") {
      setShowLogin(true);
      return;
    }
    
    // Map existing state 'pages' to our new routes to maintain compat with internal logic
    const routeMap = {
      landing: '/',
      templates: '/templates',
      editor: selectedTemplate ? `/editor/${selectedTemplate.id}` : '/templates',
      payment: '/payment',
      success: '/success',
      download: '/download',
      preview: '/preview',
      about: '/about'
    };
    
    navigate(routeMap[p] || '/');
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const currentPath = location.pathname;
  const showFooter = !currentPath.includes("/editor") && !currentPath.includes("/success");

  // A tiny local function to map current path to 'page' string for Nav component compatibility
  const getPageStr = () => {
     if (currentPath === '/') return 'landing';
     if (currentPath.includes('/editor')) return 'editor';
     return currentPath.substring(1);
  };

  return (
    <>
      <style>{styles.global}</style>
      <Nav page={getPageStr()} setPage={goTo} user={user} onLogout={handleLogout} />
      
      <Routes>
        <Route path="/" element={<LandingPage setPage={goTo} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/templates" element={<TemplatesPage setPage={goTo} onSelectTemplate={setSelectedTemplate} />} />
        
        {/* Guarded Routes */}
        <Route path="/editor/:templateId" element={<EditorPageWrapper setPage={goTo} selectedTemplate={selectedTemplate} user={user} isPaid={isPaid} />} />
        <Route path="/preview" element={<PreviewPage user={user} isPaid={isPaid} setPage={goTo} selectedTemplate={selectedTemplate} />} />
        <Route path="/download" element={<DownloadPage user={user} isPaid={isPaid} setPage={goTo} selectedTemplate={selectedTemplate} />} />
        
        <Route path="/payment" element={<PaymentPage setPage={goTo} user={user} />} />
        <Route path="/success" element={<SuccessPage setPage={goTo} />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {showFooter && <Footer setPage={goTo} />}
      
      {showLogin && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)' }} onClick={() => setShowLogin(false)} />
           <div style={{ zIndex: 10000 }}>
             <GoogleLogin />
           </div>
        </div>
      )}
    </>
  );
}

export default function Root() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
