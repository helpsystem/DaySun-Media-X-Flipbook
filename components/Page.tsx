
import React from 'react';
import { PageContent } from '../types';

interface PageProps {
    page: PageContent;
    pageNumber: number;
}

const Page = React.forwardRef<HTMLDivElement, PageProps>(({ page, pageNumber }, ref) => {
    return (
        <div ref={ref} className="bg-warm-light text-brand-text w-full h-full p-6 md:p-10 shadow-page overflow-hidden">
            <div className="flex flex-col h-full">
                {page.image ? (
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${page.image})` }}>
                        <div className="flex items-center justify-center h-full bg-black/30">
                            <h2 className="text-white text-3xl md:text-5xl font-bold text-center drop-shadow-lg">{page.title}</h2>
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 className="text-xl md:text-2xl font-bold text-cultural-blue mb-4">{page.title}</h2>
                        <p className="text-base md:text-lg leading-relaxed flex-grow">{page.text}</p>
                    </>
                )}
                <div className="text-right text-sm text-gray-400 mt-4">
                    {pageNumber}
                </div>
            </div>
        </div>
    );
});

Page.displayName = 'Page';

export default Page;
