
import React, { useState, useEffect } from 'react';
import { Flipbook } from './components/Flipbook';
import { STORY_PAGES_EN, STORY_PAGES_FA } from './constants';
import { Language } from './types';
import { Globe, BookOpen } from 'lucide-react';

const App: React.FC = () => {
    const [language, setLanguage] = useState<Language>(Language.EN);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        document.documentElement.lang = language;
        document.documentElement.dir = language === Language.FA ? 'rtl' : 'ltr';
    }, [language]);

    const toggleLanguage = () => {
        setLanguage(prev => (prev === Language.EN ? Language.FA : Language.EN));
    };

    const pages = language === Language.EN ? STORY_PAGES_EN : STORY_PAGES_FA;
    const fontFamily = language === Language.EN ? 'font-lora' : 'font-vazir';

    if (!isClient) {
        return null; 
    }

    return (
        <div className={`min-h-screen ${fontFamily} text-brand-text flex flex-col items-center justify-center p-4 md:p-8 transition-all duration-500`}>
            <header className="w-full max-w-5xl mx-auto mb-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <BookOpen className="w-8 h-8 text-sunrise-gold" />
                    <h1 className="text-2xl md:text-4xl font-bold text-cultural-blue">
                        DaySun Media X
                    </h1>
                </div>
                <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 px-4 py-2 bg-cultural-blue text-white rounded-lg shadow-md hover:bg-opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-sunrise-gold"
                >
                    <Globe size={20} />
                    <span>{language === Language.EN ? 'فارسی' : 'English'}</span>
                </button>
            </header>

            <main className="w-full flex-grow flex items-center justify-center">
                <Flipbook pages={pages} language={language} />
            </main>

            <footer className="w-full max-w-5xl mx-auto mt-6 text-center text-gray-500 text-sm">
                <p>“A new day is dawning in storytelling — bridging hearts, cultures, and generations.”</p>
            </footer>
        </div>
    );
};

export default App;
