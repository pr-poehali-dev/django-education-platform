import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import TopicsPage from '@/pages/CSPage';
import TestsPage from '@/pages/TestsPage';
import CabinetPage from '@/pages/CabinetPage';
import AdminPage from '@/pages/AdminPage';
import TeacherPage from '@/pages/TeacherPage';
import AboutPage from '@/pages/AboutPage';
import ContactsPage from '@/pages/ContactsPage';
import RegisterPage from '@/pages/RegisterPage';
import LoginPage from '@/pages/LoginPage';
import LeaderboardPage from '@/pages/LeaderboardPage';
import PdPolicyPage from '@/pages/PdPolicyPage';

type Page =
  | 'home' | 'topics' | 'tests' | 'cabinet' | 'teacher'
  | 'admin' | 'about' | 'contacts' | 'register' | 'login'
  | 'leaderboard' | 'pd-policy';

const NO_LAYOUT: Page[] = ['register', 'login', 'admin'];

export default function App() {
  const [page, setPage] = useState<Page>('home');

  const navigate = (p: string) => {
    setPage(p as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (page) {
      case 'home':        return <HomePage onNavigate={navigate} />;
      case 'topics':      return <TopicsPage onNavigate={navigate} />;
      case 'tests':       return <TestsPage />;
      case 'cabinet':     return <CabinetPage onNavigate={navigate} />;
      case 'teacher':     return <TeacherPage onNavigate={navigate} />;
      case 'admin':       return <AdminPage />;
      case 'about':       return <AboutPage />;
      case 'contacts':    return <ContactsPage />;
      case 'register':    return <RegisterPage onNavigate={navigate} />;
      case 'login':       return <LoginPage onNavigate={navigate} />;
      case 'leaderboard': return <LeaderboardPage />;
      case 'pd-policy':   return <PdPolicyPage />;
      default:            return <HomePage onNavigate={navigate} />;
    }
  };

  const noLayout = NO_LAYOUT.includes(page);

  return (
    <div className="min-h-screen bg-white font-ibm">
      {!noLayout && <Navbar currentPage={page} onNavigate={navigate} />}
      <main key={page} className="animate-fade-in">
        {renderPage()}
      </main>
      {!noLayout && <Footer onNavigate={navigate} />}
    </div>
  );
}
