import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../../assets/animations/loading.json';

const Loading = () => {
    return (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
            <Lottie
                style={{ height: 350, width: 350 }}
                animationData={loadingAnimation}
                loop={true}
            />
        </div>
    );
};

export default Loading;
