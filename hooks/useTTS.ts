
import { useState, useCallback, useRef, useEffect } from 'react';
import { generateSpeech } from '../services/geminiService';
import { decode, decodeAudioData } from '../services/audioUtils';
import { Language } from '../types';

export const useTTS = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
    const audioBufferCache = useRef<Map<string, AudioBuffer>>(new Map());

    useEffect(() => {
        // Initialize AudioContext on client-side
        if (typeof window !== 'undefined' && !audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }

        return () => {
            // Cleanup on unmount
            audioContextRef.current?.close();
            sourceNodeRef.current?.stop();
        };
    }, []);

    const stop = useCallback(() => {
        if (sourceNodeRef.current) {
            sourceNodeRef.current.stop();
            sourceNodeRef.current.disconnect();
            sourceNodeRef.current = null;
        }
        setIsPlaying(false);
    }, []);

    const play = useCallback(async (text: string, lang: Language, onEnded?: () => void) => {
        stop();
        if (!text) return;
        
        const cacheKey = `${lang}:${text.slice(0, 50)}`;

        setIsLoading(true);
        setError(null);

        try {
            let buffer: AudioBuffer | undefined = audioBufferCache.current.get(cacheKey);

            if (!buffer) {
                const base64Audio = await generateSpeech(text, lang);
                if (!base64Audio || !audioContextRef.current) {
                    throw new Error("Failed to generate or decode audio.");
                }
                const decodedBytes = decode(base64Audio);
                buffer = await decodeAudioData(decodedBytes, audioContextRef.current, 24000, 1);
                audioBufferCache.current.set(cacheKey, buffer);
            }
            
            if (!audioContextRef.current) return;
            
            // Ensure context is running
            if (audioContextRef.current.state === 'suspended') {
                await audioContextRef.current.resume();
            }

            const source = audioContextRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContextRef.current.destination);
            source.onended = () => {
                setIsPlaying(false);
                sourceNodeRef.current = null;
                onEnded?.();
            };
            source.start();
            sourceNodeRef.current = source;
            setIsPlaying(true);
        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : "An unknown error occurred.");
            setIsPlaying(false);
        } finally {
            setIsLoading(false);
        }
    }, [stop]);

    return { play, stop, isLoading, isPlaying, error };
};
