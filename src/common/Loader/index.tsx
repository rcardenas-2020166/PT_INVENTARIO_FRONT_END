import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import loadingAnimation from '../../images/lottie/loaderLottie.json';

const Loader: React.FC = () => {
    return (
        <div
            className="fixed inset-0 dark:bg-boxdark-2 dark:text-bodydark z-9999"
        >
            <div className="flex flex-col items-center justify-center h-full">
                <Player
                    autoplay
                    loop
                    src={loadingAnimation}
                    style={{ height: '50vh', width: '50vw' }}
                />
                <span className="text-xl font-bold">Cargando Página ...</span>
            </div>
        </div>

    );
};

export default Loader;
