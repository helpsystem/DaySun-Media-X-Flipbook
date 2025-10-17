
import React from 'react';
import { Play, Square, Loader, AlertCircle } from 'lucide-react';

interface AudioControlsProps {
    onPlay: () => void;
    onStop: () => void;
    isLoading: boolean;
    isPlaying: boolean;
    error: string | null;
    disabled: boolean;
    autoTurn: boolean;
    onAutoTurnChange: () => void;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
    onPlay,
    onStop,
    isLoading,
    isPlaying,
    error,
    disabled,
    autoTurn,
    onAutoTurnChange,
}) => {
    const buttonClass = "p-3 rounded-full bg-cultural-blue text-white disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-opacity-90 transition-all shadow-lg";

    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/50 backdrop-blur-sm p-3 rounded-full flex items-center gap-4 shadow-md">
            <button
                onClick={onPlay}
                disabled={isLoading || isPlaying || disabled}
                className={buttonClass}
                aria-label="Play Narration"
            >
                {isLoading ? <Loader className="animate-spin" size={24} /> : <Play size={24} />}
            </button>
            <button
                onClick={onStop}
                disabled={!isPlaying && !isLoading}
                className={buttonClass}
                aria-label="Stop Narration"
            >
                <Square size={24} />
            </button>
            <div className="flex items-center gap-2 text-sm text-cultural-blue font-semibold">
                <input
                    type="checkbox"
                    id="auto-turn"
                    checked={autoTurn}
                    onChange={onAutoTurnChange}
                    className="w-4 h-4 rounded accent-cultural-blue cursor-pointer"
                    aria-labelledby="auto-turn-label"
                />
                <label id="auto-turn-label" htmlFor="auto-turn" className="cursor-pointer select-none">Auto-Turn Page</label>
            </div>
            {error && <AlertCircle className="text-red-500" title={error} />}
        </div>
    );
};
