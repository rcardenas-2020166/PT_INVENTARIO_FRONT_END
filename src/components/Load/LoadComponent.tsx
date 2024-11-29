import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import loadingAnimation from '../../images/lottie/loadLottie.json';

const LoadComponent: React.FC = () => {
    return (
        <div
            className="fixed inset-0 bg-gray-800 bg-opacity-50 z-9999"
            style={{ backgroundColor: 'rgba(128, 128, 128, 0.2)' }}
        >
            <div className="flex flex-col items-center justify-center h-full">
                <Player
                    autoplay
                    loop
                    src={loadingAnimation}
                    style={{ height: '50vh', width: '50vw' }}
                />
                <span className="text-xl font-bold">Cargando ...</span>
            </div>
        </div>

    );
};

export default LoadComponent;
