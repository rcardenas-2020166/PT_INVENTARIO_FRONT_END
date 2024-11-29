import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import loadingAnimation from '../../images/lottie/NotFound404lottie.json';

const NotFoundComponent: React.FC = () => {
    return (
        <div
        className="fixed inset-0 dark:bg-boxdark-2 dark:text-bodydark"
    >
            <div className="flex flex-col items-center justify-center h-full">
                <Player
                    autoplay
                    loop
                    src={loadingAnimation}
                    style={{ height: '75vh', width: '75vw' }}
                />
                <span className="text-xl font-bold">Página No Encontrada.</span>
            </div>
        </div>

    );
};

export default NotFoundComponent;
