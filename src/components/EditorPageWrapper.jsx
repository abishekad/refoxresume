import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditorPage from "../EditorPage";
import { TEMPLATE_REGISTRY } from "../data/templateRegistry";

// This wrapper guards the /editor/:templateId route
export default function EditorPageWrapper({ setPage, selectedTemplate, user, isPaid }) {
  const { templateId } = useParams();
  const navigate = useNavigate();

  // Determine which template to render. 
  // If we came from the Templates page, selectedTemplate is set.
  // If we landed directly, we fetch from registry.
  const template = selectedTemplate || TEMPLATE_REGISTRY[templateId];

  useEffect(() => {
    if (!template) {
      navigate('/templates', { replace: true });
    }
  }, [template, navigate]);

  if (!template) {
    return <div style={{ minHeight: '100vh', background: '#000', color: '#fff', padding: 100 }}>Loading editor...</div>;
  }

  return <EditorPage setPage={setPage} selectedTemplate={template} user={user} isPaid={isPaid} />;
}
