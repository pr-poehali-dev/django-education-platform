import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import VariantsPage from '@/pages/VariantsPage';
import ExamPage from '@/pages/ExamPage';
import ResultPage from '@/pages/ResultPage';
import CabinetPage from '@/pages/CabinetPage';
import TeacherPage from '@/pages/TeacherPage';
import AdminPage from '@/pages/AdminPage';
import AboutPage from '@/pages/AboutPage';
import RegisterPage from '@/pages/RegisterPage';
import LoginPage from '@/pages/LoginPage';
import PdPolicyPage from '@/pages/PdPolicyPage';
import { Variant } from '@/data/variants';

type Page =
  | 'home' | 'variants' | 'exam' | 'result'
  | 'cabinet' | 'teacher' | 'admin'
  | 'about' | 'register' | 'login' | 'pd-policy';

const NO_LAYOUT: Page[] = ['exam', 'result', 'register', 'login', 'admin'];

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [examAnswers, setExamAnswers] = useState<Record<number, string>>({});
  const [examVariant, setExamVariant] = useState<Variant | null>(null);

  const navigate = (p: string) => {
    setPage(p as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateWithData = (p: string) => {
    setPage(p as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExamFinish = (answers: Record<number, string>, variant: Variant) => {
    setExamAnswers(answers);
    setExamVariant(variant);
    setPage('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (page) {
      case 'home':     return <HomePage onNavigate={navigateWithData} />;
      case 'variants': return <VariantsPage onNavigate={(p) => { if (p === 'exam') setPage('exam'); else navigate(p); }} />;
      case 'exam':     return <ExamPage onFinish={handleExamFinish} onExit={() => navigate('variants')} />;
      case 'result':   return examVariant
        ? <ResultPage answers={examAnswers} variant={examVariant} onNavigate={navigate} onRetry={() => navigate('exam')} />
        : <HomePage onNavigate={navigate} />;
      case 'cabinet':  return <CabinetPage onNavigate={navigate} />;
      case 'teacher':  return <TeacherPage onNavigate={navigate} />;
      case 'admin':    return <AdminPage onNavigate={navigate} />;
      case 'about':    return <AboutPage />;
      case 'register': return <RegisterPage onNavigate={navigate} />;
      case 'login':    return <LoginPage onNavigate={navigate} />;
      case 'pd-policy': return <PdPolicyPage />;
      default:         return <HomePage onNavigate={navigate} />;
    }
  };

  const noLayout = NO_LAYOUT.includes(page);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'IBM Plex Sans', 'Golos Text', system-ui, sans-serif" }}>
      {!noLayout && <Navbar currentPage={page} onNavigate={navigate} />}
      <main key={page} className="animate-fade-in">
        {renderPage()}
      </main>
      {!noLayout && <Footer onNavigate={navigate} />}
    </div>
  );
}
