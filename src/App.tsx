import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import CSPage from '@/pages/CSPage';
import TestsPage from '@/pages/TestsPage';
import CabinetPage from '@/pages/CabinetPage';
import AdminPage from '@/pages/AdminPage';
import AboutPage from '@/pages/AboutPage';
import ContactsPage from '@/pages/ContactsPage';

type Page = 'home' | 'cs' | 'tests' | 'cabinet' | 'admin' | 'about' | 'contacts';

const noFooterPages: Page[] = ['admin'];

export default function App() {
  const [page, setPage] = useState<Page>('home');

  const navigate = (p: string) => {
    setPage(p as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (page) {
      case 'home': return <HomePage onNavigate={navigate} />;
      case 'cs': return <CSPage onNavigate={navigate} />;
      case 'tests': return <TestsPage />;
      case 'cabinet': return <CabinetPage />;
      case 'admin': return <AdminPage />;
      case 'about': return <AboutPage />;
      case 'contacts': return <ContactsPage />;
      default: return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen font-golos">
      <Navbar currentPage={page} onNavigate={navigate} />
      <main key={page} className="animate-fade-in">
        {renderPage()}
      </main>
      {!noFooterPages.includes(page) && <Footer onNavigate={navigate} />}
    </div>
  );
}
