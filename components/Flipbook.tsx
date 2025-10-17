
import React, { useState, useCallback, useMemo } from 'react';
import { PageContent, Language } from '../types';
import Page from './Page';
import { AudioControls } from './AudioControls';
import { useTTS } from '../hooks/useTTS';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface FlipbookProps {
    pages: PageContent[];
    language: Language;
}

export const Flipbook: React.FC<FlipbookProps> = ({ pages, language }) => {
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [autoTurn, setAutoTurn] = useState(true);
    const { play, stop, isLoading, isPlaying, error } = useTTS();

    const isRtl = language === Language.FA;
    const orderedPages = useMemo(() => isRtl ? [...pages].reverse() : pages, [pages, isRtl]);

    const handleNextPage = useCallback(() => {
        stop();
        if (currentPageIndex < orderedPages.length - 2) {
            setCurrentPageIndex(prev => prev + 2);
        }
    }, [orderedPages.length, stop, currentPageIndex]);

    const handlePrevPage = useCallback(() => {
        stop();
        setCurrentPageIndex(prev => Math.max(prev - 2, 0));
    }, [stop]);

    const onNarrationEnd = useCallback(() => {
        if (autoTurn) {
            handleNextPage();
        }
    }, [autoTurn, handleNextPage]);
    
    // Determine which text to play, considering two-page view
    const leftPage = orderedPages[currentPageIndex];
    const rightPage = orderedPages[currentPageIndex + 1];
    
    const textParts: string[] = [];
    if (isRtl) {
        if (rightPage?.text) textParts.push(rightPage.text);
        if (leftPage?.text) textParts.push(leftPage.text);
    } else {
        if (leftPage?.text) textParts.push(leftPage.text);
        if (rightPage?.text) textParts.push(rightPage.text);
    }
    const textToRead = textParts.join(' ');

    const leftPageNumber = isRtl ? pages.length - currentPageIndex : currentPageIndex + 1;
    const rightPageNumber = orderedPages[currentPageIndex + 1] ? (isRtl ? pages.length - (currentPageIndex + 1) : currentPageIndex + 2) : null;


    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
             <div className="relative w-full max-w-[90vw] md:max-w-4xl aspect-[2/1.4] perspective-[2500px]">
                {/* Left Page */}
                <div 
                    className="absolute w-1/2 h-full left-0 origin-right transition-transform duration-700 ease-in-out"
                    style={{ 
                        transform: `rotateY(${currentPageIndex > 0 ? '-180deg' : '0deg'})`,
                        transformStyle: 'preserve-3d',
                        backfaceVisibility: 'hidden',
                        zIndex: currentPageIndex > 0 ? 1 : 2,
                     }}
                >
                    {leftPage && (
                       <div className="absolute w-full h-full" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(0deg)'}}>
                          <Page page={leftPage} pageNumber={leftPageNumber} />
                       </div>
                    )}
                </div>

                {/* Right Page */}
                <div 
                    className="absolute w-1/2 h-full right-0 origin-left"
                    style={{ zIndex: 1 }}
                >
                    {rightPage && <Page page={rightPage} pageNumber={rightPageNumber!} />}
                </div>

                {/* Flipped Left Page (Back) */}
                 {orderedPages[currentPageIndex - 1] && (
                    <div
                        className="absolute w-1/2 h-full left-0 origin-right"
                        style={{
                            transform: `rotateY(0deg)`,
                            transformStyle: 'preserve-3d',
                            backfaceVisibility: 'hidden',
                            zIndex: 0,
                        }}
                    >
                         <div className="absolute w-full h-full" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                            <Page page={orderedPages[currentPageIndex - 1]} pageNumber={isRtl ? pages.length - (currentPageIndex - 1) : currentPageIndex} />
                         </div>
                    </div>
                )}
                
                <AudioControls
                    onPlay={() => textToRead && play(textToRead, language, onNarrationEnd)}
                    onStop={stop}
                    isLoading={isLoading}
                    isPlaying={isPlaying}
                    error={error}
                    disabled={!textToRead}
                    autoTurn={autoTurn}
                    onAutoTurnChange={() => setAutoTurn(prev => !prev)}
                />
            </div>
            
            <div className="flex items-center justify-center gap-4 md:gap-8 mt-6">
                <button
                    onClick={isRtl ? handleNextPage : handlePrevPage}
                    disabled={currentPageIndex === 0}
                    className="p-3 rounded-full bg-sunrise-gold text-white disabled:bg-gray-300 transition-all shadow-md"
                    aria-label={isRtl ? "Next Page" : "Previous Page"}
                >
                    <ArrowLeft size={24} />
                </button>
                <span className="text-lg text-gray-600 w-40 text-center tabular-nums">
                    {rightPageNumber ? `Pages ${Math.min(leftPageNumber, rightPageNumber!)}-${Math.max(leftPageNumber, rightPageNumber!)}` : `Page ${leftPageNumber}`}
                    &nbsp;of {pages.length}
                </span>
                <button
                    onClick={isRtl ? handlePrevPage : handleNextPage}
                    disabled={currentPageIndex >= orderedPages.length - 2}
                    className="p-3 rounded-full bg-sunrise-gold text-white disabled:bg-gray-300 transition-all shadow-md"
                    aria-label={isRtl ? "Previous Page" : "Next Page"}
                >
                    <ArrowRight size={24} />
                </button>
            </div>
        </div>
    );
};
