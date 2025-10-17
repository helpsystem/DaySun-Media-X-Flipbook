
export enum Language {
    EN = 'en',
    FA = 'fa',
}

export interface PageContent {
    id: number;
    title: string;
    text?: string;
    image?: string;
}
